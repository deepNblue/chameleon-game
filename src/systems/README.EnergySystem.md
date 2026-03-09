# EnergySystem 能量系统

变色龙游戏的核心能量管理系统，提供完整的能量消耗、恢复和警告机制。

## 📋 功能特性

- ✅ **能量消耗计算** - 支持多种消耗类型（移动、技能、攻击、特殊能力、变身）
- ✅ **能量恢复机制** - 支持自动恢复和手动恢复
- ✅ **低能量警告** - 分级警告系统（低能量/极低能量）
- ✅ **事件系统** - 完整的事件监听机制
- ✅ **灵活配置** - 可自定义所有参数
- ✅ **TypeScript支持** - 完整的类型定义

## 🚀 快速开始

### 基本使用

```typescript
import { EnergySystem } from './systems/EnergySystem';

// 创建能量系统（使用默认配置）
const energySystem = new EnergySystem();

// 消耗能量
energySystem.consume(20);

// 恢复能量
energySystem.recover(10);

// 获取当前能量
console.log(energySystem.getEnergy()); // 90
```

### 自定义配置

```typescript
import { EnergySystem, EnergyConfig } from './systems/EnergySystem';

const config: Partial<EnergyConfig> = {
  maxEnergy: 200,              // 最大能量值
  initialEnergy: 150,          // 初始能量
  recoveryRate: 10,            // 每秒恢复10点
  lowEnergyThreshold: 0.25,    // 25%以下触发低能量警告
  criticalEnergyThreshold: 0.1 // 10%以下触发极低能量警告
};

const energySystem = new EnergySystem(config);
```

## 📚 API 文档

### 构造函数

```typescript
constructor(config?: Partial<EnergyConfig>)
```

### 主要方法

#### 能量操作

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `consume(amount, type?)` | 消耗能量 | `boolean` - 是否成功 |
| `recover(amount)` | 恢复能量 | `number` - 实际恢复量 |
| `hasEnoughEnergy(amount)` | 检查能量是否足够 | `boolean` |
| `getEnergy()` | 获取当前能量值 | `number` |
| `getEnergyPercent()` | 获取能量百分比 | `number` (0-1) |
| `getMaxEnergy()` | 获取最大能量值 | `number` |

#### 自动恢复

| 方法 | 说明 |
|------|------|
| `startRecovery()` | 启动自动恢复 |
| `stopRecovery()` | 停止自动恢复 |
| `update(deltaTime)` | 更新系统（每帧调用） |

#### 事件系统

| 方法 | 说明 |
|------|------|
| `on(eventType, callback)` | 注册事件监听器 |
| `off(eventType, callback)` | 移除事件监听器 |

#### 工具方法

| 方法 | 说明 |
|------|------|
| `calculateEnergyCost(type, params?)` | 计算指定动作的能量消耗 |
| `getStatus()` | 获取完整状态信息 |
| `reset()` | 重置到初始状态 |

## 🎯 能量消耗类型

```typescript
enum EnergyCostType {
  MOVE = 'move',               // 移动消耗
  SKILL = 'skill',             // 技能消耗
  ATTACK = 'attack',           // 攻击消耗
  SPECIAL = 'special',         // 特殊能力消耗
  TRANSFORMATION = 'transformation' // 变身消耗
}
```

### 基础消耗值

| 类型 | 基础消耗 | 说明 |
|------|---------|------|
| MOVE | 2 | 可受距离影响 |
| ATTACK | 10 | 攻击消耗 |
| SKILL | 15 | 可受技能等级影响 |
| SPECIAL | 25 | 特殊能力消耗 |
| TRANSFORMATION | 40 | 变身消耗 |

## 📡 事件系统

### 事件类型

```typescript
enum EnergyEventType {
  CONSUMED = 'consumed',   // 能量消耗
  RECOVERED = 'recovered', // 能量恢复
  LOW = 'low',             // 低能量警告
  CRITICAL = 'critical',   // 极低能量
  EMPTY = 'empty',         // 能量耗尽
  FULL = 'full'           // 能量满
}
```

### 使用示例

```typescript
// 监听低能量警告
energySystem.on(EnergyEventType.LOW, (eventType, current, max) => {
  console.log(`⚠️ 能量不足! ${current}/${max}`);
});

// 监听能量消耗
energySystem.on(EnergyEventType.CONSUMED, (eventType, current, max, data) => {
  console.log(`消耗了 ${data.amount} 点能量`);
});

// 监听极低能量
energySystem.on(EnergyEventType.CRITICAL, (eventType, current, max) => {
  // 触发紧急UI提示
  showCriticalWarning();
});
```

## 🎮 游戏集成示例

```typescript
class Player {
  private energySystem: EnergySystem;
  
  constructor() {
    this.energySystem = new EnergySystem();
    this.setupEnergyEvents();
  }
  
  private setupEnergyEvents() {
    this.energySystem.on(EnergyEventType.LOW, () => {
      this.showLowEnergyUI();
    });
    
    this.energySystem.on(EnergyEventType.CRITICAL, () => {
      this.disableSpecialAbilities();
    });
  }
  
  move(distance: number): boolean {
    const cost = this.energySystem.calculateEnergyCost(
      EnergyCostType.MOVE, 
      { distance }
    );
    
    return this.energySystem.consume(cost, EnergyCostType.MOVE);
  }
  
  useSkill(skillName: string, level: number): boolean {
    const cost = this.energySystem.calculateEnergyCost(
      EnergyCostType.SKILL,
      { level }
    );
    
    return this.energySystem.consume(cost, EnergyCostType.SKILL);
  }
  
  update(deltaTime: number) {
    // 每帧更新能量系统
    this.energySystem.update(deltaTime);
  }
}
```

## 📊 配置参数说明

### EnergyConfig 接口

```typescript
interface EnergyConfig {
  maxEnergy: number;           // 最大能量值（默认：100）
  initialEnergy: number;       // 初始能量值（默认：100）
  recoveryRate: number;        // 每秒恢复的能量值（默认：5）
  lowEnergyThreshold: number;  // 低能量警告阈值（默认：0.3，即30%）
  criticalEnergyThreshold: number; // 极低能量阈值（默认：0.1，即10%）
}
```

## 🔧 高级用法

### 自定义能量消耗计算

```typescript
// 根据距离计算移动消耗
const moveCost = energySystem.calculateEnergyCost(
  EnergyCostType.MOVE,
  { distance: 5 } // 5倍距离
);

// 根据技能等级计算技能消耗
const skillCost = energySystem.calculateEnergyCost(
  EnergyCostType.SKILL,
  { level: 3 } // 等级3的技能
);
```

### 获取详细状态

```typescript
const status = energySystem.getStatus();
// 返回:
// {
//   currentEnergy: 50,
//   maxEnergy: 100,
//   energyPercent: 0.5,
//   isRecovering: true,
//   isLowEnergy: false,
//   isCriticalEnergy: false
// }
```

## 📝 注意事项

1. **每帧更新**: 必须在游戏主循环中调用 `update(deltaTime)` 以保证自动恢复正常工作
2. **事件清理**: 不再使用的事件监听器应及时移除，避免内存泄漏
3. **能量限制**: 能量值始终在 `[0, maxEnergy]` 范围内
4. **警告机制**: 低能量和极低能量警告只会触发一次，能量恢复后会重置

## 📦 完整示例

查看 `EnergySystem.example.ts` 文件获取更多使用示例：

- 基本使用
- 自定义配置
- 能量消耗计算
- 事件监听
- 自动恢复
- 游戏集成

## 🤝 贡献

欢迎提交问题和改进建议！

## 📄 许可证

MIT License

---

**创建时间**: 2026-03-09  
**版本**: 1.0.0  
**作者**: 变色龙游戏开发团队
