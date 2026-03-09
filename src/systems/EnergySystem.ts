/**
 * 能量系统 - EnergySystem
 * 
 * 管理变色龙游戏中的能量消耗、恢复和警告机制
 */

/**
 * 能量配置接口
 */
export interface EnergyConfig {
  maxEnergy: number;           // 最大能量值
  initialEnergy: number;       // 初始能量值
  recoveryRate: number;        // 每秒恢复的能量值
  lowEnergyThreshold: number;  // 低能量警告阈值（百分比 0-1）
  criticalEnergyThreshold: number; // 极低能量阈值（百分比 0-1）
}

/**
 * 能量消耗类型
 */
export enum EnergyCostType {
  MOVE = 'move',               // 移动消耗
  SKILL = 'skill',             // 技能消耗
  ATTACK = 'attack',           // 攻击消耗
  SPECIAL = 'special',         // 特殊能力消耗
  TRANSFORMATION = 'transformation' // 变身消耗
}

/**
 * 能量事件类型
 */
export enum EnergyEventType {
  CONSUMED = 'consumed',       // 能量消耗
  RECOVERED = 'recovered',     // 能量恢复
  LOW = 'low',                 // 低能量警告
  CRITICAL = 'critical',       // 极低能量
  EMPTY = 'empty',             // 能量耗尽
  FULL = 'full'               // 能量满
}

/**
 * 能量事件回调
 */
export type EnergyEventCallback = (
  eventType: EnergyEventType,
  currentEnergy: number,
  maxEnergy: number,
  data?: any
) => void;

/**
 * 能量系统类
 */
export class EnergySystem {
  private currentEnergy: number;
  private maxEnergy: number;
  private recoveryRate: number;
  private lowEnergyThreshold: number;
  private criticalEnergyThreshold: number;
  
  private isRecovering: boolean = false;
  private recoveryAccumulator: number = 0;
  
  private eventListeners: Map<EnergyEventType, EnergyEventCallback[]> = new Map();
  
  private lowEnergyWarned: boolean = false;
  private criticalEnergyWarned: boolean = false;

  /**
   * 创建能量系统实例
   * @param config 能量配置
   */
  constructor(config: Partial<EnergyConfig> = {}) {
    // 默认配置
    const defaultConfig: EnergyConfig = {
      maxEnergy: 100,
      initialEnergy: 100,
      recoveryRate: 5, // 每秒恢复5点能量
      lowEnergyThreshold: 0.3, // 30%
      criticalEnergyThreshold: 0.1 // 10%
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    this.maxEnergy = finalConfig.maxEnergy;
    this.currentEnergy = Math.min(finalConfig.initialEnergy, this.maxEnergy);
    this.recoveryRate = finalConfig.recoveryRate;
    this.lowEnergyThreshold = finalConfig.lowEnergyThreshold;
    this.criticalEnergyThreshold = finalConfig.criticalEnergyThreshold;
    
    // 初始化事件监听器映射
    Object.values(EnergyEventType).forEach(type => {
      this.eventListeners.set(type, []);
    });
  }

  /**
   * 消耗能量
   * @param amount 消耗量
   * @param type 消耗类型
   * @returns 是否消耗成功
   */
  consume(amount: number, type: EnergyCostType = EnergyCostType.MOVE): boolean {
    if (amount < 0) {
      console.warn('[EnergySystem] 消耗量不能为负数');
      return false;
    }
    
    if (this.currentEnergy < amount) {
      // 能量不足
      this.emit(EnergyEventType.EMPTY, this.currentEnergy, this.maxEnergy, { 
        required: amount, 
        available: this.currentEnergy,
        type 
      });
      return false;
    }
    
    const previousEnergy = this.currentEnergy;
    this.currentEnergy -= amount;
    
    // 触发消耗事件
    this.emit(EnergyEventType.CONSUMED, this.currentEnergy, this.maxEnergy, {
      amount,
      type,
      previousEnergy
    });
    
    // 检查低能量警告
    this.checkEnergyWarnings();
    
    return true;
  }

  /**
   * 恢复能量
   * @param amount 恢复量
   * @returns 实际恢复的能量值
   */
  recover(amount: number): number {
    if (amount < 0) {
      console.warn('[EnergySystem] 恢复量不能为负数');
      return 0;
    }
    
    const previousEnergy = this.currentEnergy;
    this.currentEnergy = Math.min(this.currentEnergy + amount, this.maxEnergy);
    const actualRecovered = this.currentEnergy - previousEnergy;
    
    if (actualRecovered > 0) {
      // 触发恢复事件
      this.emit(EnergyEventType.RECOVERED, this.currentEnergy, this.maxEnergy, {
        amount: actualRecovered,
        previousEnergy
      });
      
      // 检查是否满能量
      if (this.currentEnergy >= this.maxEnergy) {
        this.emit(EnergyEventType.FULL, this.currentEnergy, this.maxEnergy);
      }
      
      // 重置警告状态
      this.resetWarnings();
    }
    
    return actualRecovered;
  }

  /**
   * 更新能量系统（每帧调用）
   * @param deltaTime 距离上一帧的时间（秒）
   */
  update(deltaTime: number): void {
    if (!this.isRecovering || this.recoveryRate <= 0) {
      return;
    }
    
    // 累积恢复能量
    this.recoveryAccumulator += this.recoveryRate * deltaTime;
    
    // 当累积值 >= 1 时，恢复能量
    if (this.recoveryAccumulator >= 1) {
      const recoverAmount = Math.floor(this.recoveryAccumulator);
      this.recover(recoverAmount);
      this.recoveryAccumulator -= recoverAmount;
    }
  }

  /**
   * 启动自动恢复
   */
  startRecovery(): void {
    this.isRecovering = true;
  }

  /**
   * 停止自动恢复
   */
  stopRecovery(): void {
    this.isRecovering = false;
    this.recoveryAccumulator = 0;
  }

  /**
   * 检查低能量警告
   */
  private checkEnergyWarnings(): void {
    const energyRatio = this.currentEnergy / this.maxEnergy;
    
    // 极低能量警告
    if (energyRatio <= this.criticalEnergyThreshold && !this.criticalEnergyWarned) {
      this.criticalEnergyWarned = true;
      this.lowEnergyWarned = true;
      this.emit(EnergyEventType.CRITICAL, this.currentEnergy, this.maxEnergy);
    }
    // 低能量警告
    else if (energyRatio <= this.lowEnergyThreshold && !this.lowEnergyWarned) {
      this.lowEnergyWarned = true;
      this.emit(EnergyEventType.LOW, this.currentEnergy, this.maxEnergy);
    }
  }

  /**
   * 重置警告状态
   */
  private resetWarnings(): void {
    const energyRatio = this.currentEnergy / this.maxEnergy;
    
    if (energyRatio > this.lowEnergyThreshold) {
      this.lowEnergyWarned = false;
    }
    
    if (energyRatio > this.criticalEnergyThreshold) {
      this.criticalEnergyWarned = false;
    }
  }

  /**
   * 注册事件监听器
   * @param eventType 事件类型
   * @param callback 回调函数
   */
  on(eventType: EnergyEventType, callback: EnergyEventCallback): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.push(callback);
    }
  }

  /**
   * 移除事件监听器
   * @param eventType 事件类型
   * @param callback 回调函数
   */
  off(eventType: EnergyEventType, callback: EnergyEventCallback): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param eventType 事件类型
   * @param currentEnergy 当前能量
   * @param maxEnergy 最大能量
   * @param data 附加数据
   */
  private emit(
    eventType: EnergyEventType,
    currentEnergy: number,
    maxEnergy: number,
    data?: any
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(eventType, currentEnergy, maxEnergy, data);
        } catch (error) {
          console.error(`[EnergySystem] 事件回调执行错误:`, error);
        }
      });
    }
  }

  /**
   * 检查是否有足够能量
   * @param amount 需要的能量值
   * @returns 是否有足够能量
   */
  hasEnoughEnergy(amount: number): boolean {
    return this.currentEnergy >= amount;
  }

  /**
   * 获取当前能量值
   */
  getEnergy(): number {
    return this.currentEnergy;
  }

  /**
   * 获取能量百分比
   */
  getEnergyPercent(): number {
    return this.currentEnergy / this.maxEnergy;
  }

  /**
   * 获取最大能量值
   */
  getMaxEnergy(): number {
    return this.maxEnergy;
  }

  /**
   * 设置最大能量值
   * @param maxEnergy 新的最大能量值
   */
  setMaxEnergy(maxEnergy: number): void {
    if (maxEnergy <= 0) {
      console.warn('[EnergySystem] 最大能量必须大于0');
      return;
    }
    
    this.maxEnergy = maxEnergy;
    // 如果当前能量超过新的最大值，则调整
    if (this.currentEnergy > this.maxEnergy) {
      this.currentEnergy = this.maxEnergy;
    }
  }

  /**
   * 设置能量值（用于调试或特殊能力）
   * @param energy 能量值
   */
  setEnergy(energy: number): void {
    this.currentEnergy = Math.max(0, Math.min(energy, this.maxEnergy));
    this.checkEnergyWarnings();
    this.resetWarnings();
  }

  /**
   * 重置能量系统到初始状态
   */
  reset(): void {
    this.currentEnergy = this.maxEnergy;
    this.isRecovering = false;
    this.recoveryAccumulator = 0;
    this.lowEnergyWarned = false;
    this.criticalEnergyWarned = false;
  }

  /**
   * 获取能量系统状态信息
   */
  getStatus(): {
    currentEnergy: number;
    maxEnergy: number;
    energyPercent: number;
    isRecovering: boolean;
    isLowEnergy: boolean;
    isCriticalEnergy: boolean;
  } {
    const energyPercent = this.getEnergyPercent();
    return {
      currentEnergy: this.currentEnergy,
      maxEnergy: this.maxEnergy,
      energyPercent,
      isRecovering: this.isRecovering,
      isLowEnergy: energyPercent <= this.lowEnergyThreshold,
      isCriticalEnergy: energyPercent <= this.criticalEnergyThreshold
    };
  }

  /**
   * 计算指定动作的能量消耗
   * @param type 消耗类型
   * @param params 计算参数
   * @returns 能量消耗值
   */
  calculateEnergyCost(type: EnergyCostType, params?: any): number {
    // 基础消耗值
    const baseCosts: Record<EnergyCostType, number> = {
      [EnergyCostType.MOVE]: 2,
      [EnergyCostType.SKILL]: 15,
      [EnergyCostType.ATTACK]: 10,
      [EnergyCostType.SPECIAL]: 25,
      [EnergyCostType.TRANSFORMATION]: 40
    };
    
    let cost = baseCosts[type] || 0;
    
    // 根据参数调整消耗（可以扩展）
    if (params) {
      // 例如：距离影响移动消耗
      if (type === EnergyCostType.MOVE && params.distance) {
        cost = Math.ceil(cost * params.distance);
      }
      
      // 技能等级影响技能消耗
      if (type === EnergyCostType.SKILL && params.level) {
        cost = Math.ceil(cost * (1 + params.level * 0.1));
      }
    }
    
    return cost;
  }

  /**
   * 改变颜色（消耗能量）
   * @returns 是否有足够能量改变颜色
   */
  changeColor(): boolean {
    return this.consume(20, EnergyCostType.TRANSFORMATION);
  }

  /**
   * 吃昆虫（恢复能量）
   */
  eatInsect(): void {
    this.recover(10);
  }
}

// 导出默认配置
export const DEFAULT_ENERGY_CONFIG: EnergyConfig = {
  maxEnergy: 100,
  initialEnergy: 100,
  recoveryRate: 5,
  lowEnergyThreshold: 0.3,
  criticalEnergyThreshold: 0.1
};
