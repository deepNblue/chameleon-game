/**
 * 变色龙生存游戏 - 游戏配置文件
 * 包含所有游戏参数、实体属性、关卡设置等
 */

// ==================== 游戏基础设置 ====================

export const GameSettings = {
  // 画布尺寸
  width: 1280,
  height: 720,

  // 游戏颜色
  colors: {
    background: 0x1a1a2e,
    ground: 0x2d5a27,
    sky: 0x87ceeb,
    ui: {
      primary: 0x4ecdc4,
      secondary: 0xff6b6b,
      text: 0xffffff,
      energy: 0xffd93d,
      health: 0x6bcb77,
    },
  },

  // 物理设置
  physics: {
    gravity: 800,
    friction: 0.9,
  },

  // 游戏时间
  roundTime: 120, // 每关120秒
  fps: 60,
} as const;

// ==================== 变色龙属性配置 ====================

export const ChameleonConfig = {
  // 基础属性
  maxHealth: 100,
  maxEnergy: 100,
  initialHealth: 100,
  initialEnergy: 100,

  // 移动速度
  moveSpeed: 200,
  jumpForce: 450,
  climbSpeed: 150,

  // 伪装系统
  camouflage: {
    cooldown: 3000, // 伪装冷却时间(ms)
    duration: 5000, // 伪装持续时间(ms)
    energyCost: 20, // 每次伪装消耗能量
    detectionRadius: 150, // 被发现的半径
  },

  // 舌头攻击
  tongue: {
    length: 200,
    speed: 800,
    cooldown: 500, // ms
    energyCost: 5,
    damage: 25,
  },

  // 体型
  body: {
    width: 60,
    height: 40,
    headSize: 25,
  },

  // 颜色变化
  colors: {
    idle: 0x228b22, // 绿色
    moving: 0x32cd32, // 浅绿色
    camouflage: 0x2d5a27, // 伪装绿
    damaged: 0xff4444, // 受伤红
  },
} as const;

// ==================== 昆虫类型配置 ====================

export const InsectConfig = {
  // 蝴蝶
  butterfly: {
    name: '蝴蝶',
    emoji: '🦋',
    score: 30,
    energy: 25,
    health: 1,
    speed: 100,
    movement: {
      pattern: 'flutter', // 飘动飞行模式
      amplitude: 30,
      frequency: 2,
    },
    spawn: {
      weight: 30, // 生成权重
      minInterval: 2000,
      maxInterval: 5000,
    },
    colors: [0xff69b4, 0x87ceeb, 0xffa500, 0x9370db],
  },

  // 蜜蜂
  bee: {
    name: '蜜蜂',
    emoji: '🐝',
    score: 50,
    energy: 35,
    health: 1,
    speed: 150,
    movement: {
      pattern: 'zigzag', // 之字形飞行
      amplitude: 20,
      frequency: 4,
    },
    spawn: {
      weight: 25,
      minInterval: 3000,
      maxInterval: 6000,
    },
    attack: {
      damage: 10,
      range: 50,
    },
    colors: [0xffd700, 0x000000],
  },

  // 蟋蟀
  cricket: {
    name: '蟋蟀',
    emoji: '🦗',
    score: 20,
    energy: 40,
    health: 1,
    speed: 180,
    movement: {
      pattern: 'jump', // 跳跃移动
      jumpHeight: 100,
      jumpInterval: 1500,
    },
    spawn: {
      weight: 45,
      minInterval: 1500,
      maxInterval: 4000,
    },
    colors: [0x556b2f, 0x8b4513],
  },

  // 通用设置
  common: {
    minSpawnDistance: 100, // 离变色龙最小生成距离
    maxCount: 15, // 场上最大昆虫数量
    despawnTime: 10000, // 超时消失时间(ms)
  },
} as const;

// ==================== 天敌配置 ====================

export const PredatorConfig = {
  // 蛇
  snake: {
    name: '蛇',
    emoji: '🐍',
    damage: 30,
    health: 100,
    speed: 120,
    detection: {
      range: 250,
      angle: 180, // 检测角度(度)
    },
    behavior: {
      patrol: {
        distance: 200,
        pauseTime: 2000,
      },
      chase: {
        speedMultiplier: 1.5,
        giveUpDistance: 400,
      },
    },
    attack: {
      cooldown: 1500,
      range: 60,
    },
    score: 0, // 击杀不得分
    spawn: {
      weight: 40,
      maxCount: 2,
    },
    colors: {
      body: 0x8b4513,
      pattern: 0xdaa520,
    },
  },

  // 鸟
  bird: {
    name: '鸟',
    emoji: '🦅',
    damage: 25,
    health: 60,
    speed: 200,
    detection: {
      range: 350,
      angle: 270, // 鸟类视野更广
    },
    behavior: {
      flight: {
        altitude: { min: 150, max: 300 },
        diveSpeed: 350,
      },
      patrol: {
        radius: 300,
        speed: 100,
      },
      attack: {
        diveAngle: 45,
        cooldown: 2000,
      },
    },
    score: 0,
    spawn: {
      weight: 60,
      maxCount: 3,
    },
    colors: {
      body: 0x4a4a4a,
      wings: 0x2f2f2f,
      beak: 0xffa500,
    },
  },

  // 通用设置
  common: {
    alertDuration: 5000, // 警觉持续时间
    giveUpTime: 8000, // 追击放弃时间
    spawnMinDistance: 400, // 最小生成距离
  },
} as const;

// ==================== 能量系统配置 ====================

export const EnergyConfig = {
  // 基础消耗
  consumption: {
    idle: 0.5, // 每秒消耗
    moving: 1.0,
    jumping: 5,
    climbing: 0.8,
    camouflage: 2.0, // 伪装时每秒消耗
  },

  // 恢复
  recovery: {
    fromFood: {
      butterfly: 25,
      bee: 35,
      cricket: 40,
    },
    fromRest: 2.0, // 静止时每秒恢复
    criticalThreshold: 20, // 低于此值进入危急状态
  },

  // 能量效果
  effects: {
    lowEnergy: {
      threshold: 30,
      speedPenalty: 0.7, // 速度惩罚
    },
    criticalEnergy: {
      threshold: 10,
      healthDrain: 2, // 每秒扣血
    },
  },

  // UI显示
  ui: {
    barWidth: 200,
    barHeight: 15,
    position: { x: 20, y: 50 },
  },
} as const;

// ==================== 关卡配置 ====================

export const LEVELS = [
  {
    name: '森林新手',
    backgroundColor: 0x228b22,
    insects: 10,
    enemies: 1,
    duration: 60000, // 60秒
  },
  {
    name: '草原狩猎',
    backgroundColor: 0x3cb371,
    insects: 15,
    enemies: 2,
    duration: 90000, // 90秒
  },
  {
    name: '丛林危机',
    backgroundColor: 0x2e8b57,
    insects: 20,
    enemies: 3,
    duration: 120000, // 120秒
  },
];

export const LevelConfig = {
  // 第一关：森林入门
  level1: {
    name: '森林新手',
    description: '学习基本的捕食和伪装技巧',
    difficulty: 1,

    // 环境设置
    environment: {
      biome: 'forest',
      timeOfDay: 'day',
      weather: 'clear',
      platforms: 8,
      trees: 6,
      bushes: 10,
    },

    // 生成配置
    spawning: {
      insects: {
        butterfly: { enabled: true, rate: 1.0 },
        bee: { enabled: false, rate: 0 },
        cricket: { enabled: true, rate: 0.8 },
      },
      predators: {
        snake: { enabled: false, maxCount: 0 },
        bird: { enabled: false, maxCount: 0 },
      },
    },

    // 目标
    objectives: {
      scoreTarget: 500,
      survivalTime: 60,
      insectsEaten: 10,
    },

    // 奖励
    rewards: {
      stars: {
        one: { score: 500 },
        two: { score: 750 },
        three: { score: 1000 },
      },
    },
  },

  // 第二关：草原进阶
  level2: {
    name: '草原狩猎',
    description: '在开阔地带躲避天敌，追捕更多昆虫',
    difficulty: 2,

    // 环境设置
    environment: {
      biome: 'grassland',
      timeOfDay: 'afternoon',
      weather: 'windy',
      platforms: 5,
      trees: 3,
      bushes: 15,
      tallGrass: 20,
    },

    // 生成配置
    spawning: {
      insects: {
        butterfly: { enabled: true, rate: 0.8 },
        bee: { enabled: true, rate: 0.6 },
        cricket: { enabled: true, rate: 1.0 },
      },
      predators: {
        snake: { enabled: true, maxCount: 1 },
        bird: { enabled: false, maxCount: 0 },
      },
    },

    // 目标
    objectives: {
      scoreTarget: 1000,
      survivalTime: 90,
      insectsEaten: 25,
    },

    // 奖励
    rewards: {
      stars: {
        one: { score: 1000 },
        two: { score: 1500 },
        three: { score: 2000 },
      },
    },
  },

  // 第三关：丛林生存
  level3: {
    name: '丛林危机',
    description: '在危险的热带丛林中生存，面对多重威胁',
    difficulty: 3,

    // 环境设置
    environment: {
      biome: 'jungle',
      timeOfDay: 'dusk',
      weather: 'rainy',
      platforms: 12,
      trees: 10,
      bushes: 8,
      vines: 8,
      waterPools: 3,
    },

    // 生成配置
    spawning: {
      insects: {
        butterfly: { enabled: true, rate: 0.6 },
        bee: { enabled: true, rate: 0.8 },
        cricket: { enabled: true, rate: 1.2 },
      },
      predators: {
        snake: { enabled: true, maxCount: 2 },
        bird: { enabled: true, maxCount: 2 },
      },
    },

    // 目标
    objectives: {
      scoreTarget: 2000,
      survivalTime: 120,
      insectsEaten: 50,
    },

    // 奖励
    rewards: {
      stars: {
        one: { score: 2000 },
        two: { score: 3000 },
        three: { score: 4000 },
      },
    },
  },
} as const;

// ==================== 类型导出 ====================

export type InsectType = keyof typeof InsectConfig & 'common';
export type PredatorType = keyof typeof PredatorConfig & 'common';
export type LevelNumber = keyof typeof LevelConfig;

// ==================== 辅助函数 ====================

/**
 * 获取关卡配置
 */
export function getLevelConfig(level: number) {
  const levelKey = `level${level}` as keyof typeof LevelConfig;
  return LevelConfig[levelKey] || null;
}

/**
 * 获取昆虫配置
 */
export function getInsectConfig(type: InsectType) {
  if (type === 'common') return InsectConfig.common;
  return InsectConfig[type as keyof typeof InsectConfig] || null;
}

/**
 * 获取天敌配置
 */
export function getPredatorConfig(type: PredatorType) {
  if (type === 'common') return PredatorConfig.common;
  return PredatorConfig[type as keyof typeof PredatorConfig] || null;
}

/**
 * 根据权重随机选择昆虫类型
 */
export function getRandomInsectType(): 'butterfly' | 'bee' | 'cricket' {
  const types = ['butterfly', 'bee', 'cricket'] as const;
  const totalWeight = types.reduce(
    (sum, type) => sum + InsectConfig[type].spawn.weight,
    0
  );

  let random = Math.random() * totalWeight;

  for (const type of types) {
    random -= InsectConfig[type].spawn.weight;
    if (random <= 0) return type;
  }

  return 'butterfly';
}

/**
 * 计算能量消耗
 */
export function calculateEnergyDrain(
  action: keyof typeof EnergyConfig.consumption,
  deltaTime: number
): number {
  const rate = EnergyConfig.consumption[action];
  return rate * (deltaTime / 1000);
}

/**
 * 检查是否在低能量状态
 */
export function getEnergyState(energy: number): 'normal' | 'low' | 'critical' {
  if (energy <= EnergyConfig.effects.criticalEnergy.threshold) return 'critical';
  if (energy <= EnergyConfig.effects.lowEnergy.threshold) return 'low';
  return 'normal';
}

// ==================== 默认导出 ====================

export default {
  GameSettings,
  ChameleonConfig,
  InsectConfig,
  PredatorConfig,
  EnergyConfig,
  LevelConfig,
};
