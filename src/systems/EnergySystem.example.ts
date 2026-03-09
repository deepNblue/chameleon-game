/**
 * EnergySystem 使用示例
 * 
 * 展示如何使用能量系统的各种功能
 */

import { 
  EnergySystem, 
  EnergyConfig, 
  EnergyCostType, 
  EnergyEventType
} from './EnergySystem';

/**
 * 示例1：基本使用
 */
function basicUsageExample() {
  console.log('=== 示例1：基本使用 ===\n');
  
  // 使用默认配置创建能量系统
  const energySystem = new EnergySystem();
  
  console.log('初始状态:', energySystem.getStatus());
  
  // 消耗能量
  energySystem.consume(20, EnergyCostType.MOVE);
  console.log('移动后能量:', energySystem.getEnergy());
  
  // 恢复能量
  energySystem.recover(10);
  console.log('恢复后能量:', energySystem.getEnergy());
  
  console.log();
}

/**
 * 示例2：自定义配置
 */
function customConfigExample() {
  console.log('=== 示例2：自定义配置 ===\n');
  
  const customConfig: Partial<EnergyConfig> = {
    maxEnergy: 200,
    initialEnergy: 150,
    recoveryRate: 10,
    lowEnergyThreshold: 0.25, // 25%
    criticalEnergyThreshold: 0.1 // 10%
  };
  
  const energySystem = new EnergySystem(customConfig);
  
  console.log('自定义配置状态:', energySystem.getStatus());
  console.log();
}

/**
 * 示例3：能量消耗计算
 */
function energyCostCalculationExample() {
  console.log('=== 示例3：能量消耗计算 ===\n');
  
  const energySystem = new EnergySystem();
  
  // 计算不同动作的能量消耗
  console.log('移动消耗:', energySystem.calculateEnergyCost(EnergyCostType.MOVE));
  console.log('攻击消耗:', energySystem.calculateEnergyCost(EnergyCostType.ATTACK));
  console.log('技能消耗:', energySystem.calculateEnergyCost(EnergyCostType.SKILL));
  
  // 计算带参数的消耗
  console.log(
    '移动消耗（距离2倍）:', 
    energySystem.calculateEnergyCost(EnergyCostType.MOVE, { distance: 2 })
  );
  console.log(
    '技能消耗（等级3）:', 
    energySystem.calculateEnergyCost(EnergyCostType.SKILL, { level: 3 })
  );
  
  console.log();
}

/**
 * 示例4：事件监听
 */
function eventListenerExample() {
  console.log('=== 示例4：事件监听 ===\n');
  
  const energySystem = new EnergySystem();
  
  // 监听能量消耗事件
  energySystem.on(EnergyEventType.CONSUMED, (_eventType, current, max, data) => {
    console.log(`⚡ 能量消耗: ${data.amount}点 (类型: ${data.type})`);
    console.log(`   当前能量: ${current}/${max}`);
  });
  
  // 监听能量恢复事件
  energySystem.on(EnergyEventType.RECOVERED, (_eventType, current, max, data) => {
    console.log(`💚 能量恢复: ${data.amount}点`);
    console.log(`   当前能量: ${current}/${max}`);
  });
  
  // 监听低能量警告
  energySystem.on(EnergyEventType.LOW, (_eventType, current, max) => {
    console.log(`⚠️ 低能量警告! 当前能量: ${current}/${max} (${Math.round(current/max*100)}%)`);
  });
  
  // 监听极低能量警告
  energySystem.on(EnergyEventType.CRITICAL, (_eventType, current, max) => {
    console.log(`🔴 极低能量警告! 当前能量: ${current}/${max} (${Math.round(current/max*100)}%)`);
  });
  
  // 监听能量耗尽
  energySystem.on(EnergyEventType.EMPTY, (_eventType, _current, _max, data) => {
    console.log(`❌ 能量不足! 需要: ${data.required}, 拥有: ${data.available}`);
  });
  
  // 测试事件
  console.log('消耗30点能量...');
  energySystem.consume(30, EnergyCostType.ATTACK);
  
  console.log('\n恢复20点能量...');
  energySystem.recover(20);
  
  console.log('\n尝试消耗100点能量（应该失败）...');
  energySystem.consume(100, EnergyCostType.SPECIAL);
  
  console.log();
}

/**
 * 示例5：自动恢复
 */
function autoRecoveryExample() {
  console.log('=== 示例5：自动恢复 ===\n');
  
  const energySystem = new EnergySystem({
    recoveryRate: 10 // 每秒恢复10点
  });
  
  // 先消耗一些能量
  energySystem.consume(50);
  console.log('消耗50点后:', energySystem.getEnergy());
  
  // 启动自动恢复
  energySystem.startRecovery();
  console.log('启动自动恢复');
  
  // 模拟游戏循环（每帧更新）
  const deltaTime = 1 / 60; // 假设60 FPS
  
  console.log('\n模拟5秒的游戏更新...');
  for (let i = 0; i < 300; i++) { // 300帧 = 5秒
    energySystem.update(deltaTime);
    
    // 每秒打印一次
    if (i % 60 === 0) {
      console.log(`第${i/60}秒: 能量 = ${energySystem.getEnergy().toFixed(1)}`);
    }
  }
  
  energySystem.stopRecovery();
  console.log('\n停止自动恢复');
  console.log();
}

/**
 * 示例6：游戏集成
 */
function gameIntegrationExample() {
  console.log('=== 示例6：游戏集成示例 ===\n');
  
  // 模拟玩家类
  class Player {
    private energySystem: EnergySystem;
    
    constructor() {
      this.energySystem = new EnergySystem({
        maxEnergy: 100,
        recoveryRate: 5
      });
      
      // 设置事件监听
      this.setupEventListeners();
    }
    
    private setupEventListeners() {
      // 低能量警告 - 显示UI提示
      this.energySystem.on(EnergyEventType.LOW, () => {
        console.log('🎮 UI提示: 能量不足，请注意休息！');
      });
      
      // 极低能量 - 限制某些动作
      this.energySystem.on(EnergyEventType.CRITICAL, () => {
        console.log('🎮 UI提示: 能量严重不足，无法使用特殊技能！');
      });
    }
    
    // 移动
    move(distance: number): boolean {
      const cost = this.energySystem.calculateEnergyCost(
        EnergyCostType.MOVE, 
        { distance }
      );
      
      if (this.energySystem.hasEnoughEnergy(cost)) {
        this.energySystem.consume(cost, EnergyCostType.MOVE);
        console.log(`✅ 移动成功，消耗${cost}点能量`);
        return true;
      } else {
        console.log(`❌ 能量不足，无法移动`);
        return false;
      }
    }
    
    // 使用技能
    useSkill(skillName: string, level: number = 1): boolean {
      const cost = this.energySystem.calculateEnergyCost(
        EnergyCostType.SKILL,
        { level }
      );
      
      if (this.energySystem.hasEnoughEnergy(cost)) {
        this.energySystem.consume(cost, EnergyCostType.SKILL);
        console.log(`✅ 使用技能【${skillName}】成功，消耗${cost}点能量`);
        return true;
      } else {
        console.log(`❌ 能量不足，无法使用技能【${skillName}】`);
        return false;
      }
    }
    
    // 变身
    transform(): boolean {
      const cost = this.energySystem.calculateEnergyCost(EnergyCostType.TRANSFORMATION);
      
      if (this.energySystem.hasEnoughEnergy(cost)) {
        this.energySystem.consume(cost, EnergyCostType.TRANSFORMATION);
        console.log(`✅ 变身成功，消耗${cost}点能量`);
        return true;
      } else {
        console.log(`❌ 能量不足，无法变身`);
        return false;
      }
    }
    
    // 更新（游戏主循环调用）
    update(deltaTime: number) {
      this.energySystem.update(deltaTime);
    }
    
    // 获取能量状态
    getEnergyStatus() {
      return this.energySystem.getStatus();
    }
    
    // 开始休息（恢复能量）
    startRest() {
      this.energySystem.startRecovery();
      console.log('💤 开始休息，恢复能量...');
    }
    
    // 停止休息
    stopRest() {
      this.energySystem.stopRecovery();
      console.log('🏃 停止休息');
    }
  }
  
  // 使用示例
  const player = new Player();
  
  console.log('玩家初始状态:', player.getEnergyStatus());
  
  // 玩家移动
  player.move(3);
  
  // 玩家使用技能
  player.useSkill('火球术', 2);
  
  // 玩家尝试变身
  player.transform();
  
  // 玩家休息恢复能量
  player.startRest();
  
  console.log('\n当前能量状态:', player.getEnergyStatus());
  
  console.log();
}

// 运行所有示例
console.log('╔══════════════════════════════════════╗');
console.log('║   EnergySystem 使用示例               ║');
console.log('╚══════════════════════════════════════╝\n');

basicUsageExample();
customConfigExample();
energyCostCalculationExample();
eventListenerExample();
autoRecoveryExample();
gameIntegrationExample();

console.log('✅ 所有示例运行完成！');
