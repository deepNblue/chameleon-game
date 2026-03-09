export const GameConfig = {
  // 游戏设置
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,

  // 变色龙设置
  CHAMELEON: {
    SPEED: 300,
    SIZE: 30,
    COLOR_TRANSITION_SPEED: 0.1,
  },

  // 昆虫设置
  INSECTS: {
    BUTTERFLY: {
      SCORE: 100,
      SPEED: 150,
      SIZE: 20,
    },
    BEE: {
      SCORE: 50,
      SPEED: 100,
      SIZE: 15,
    },
    CRICKET: {
      SCORE: 30,
      SPEED: 80,
      SIZE: 18,
    },
  },

  // 天敌设置
  ENEMIES: {
    SNAKE: {
      SPEED: 60,
      DAMAGE: 20,
    },
    BIRD: {
      SPEED: 200,
      DAMAGE: 30,
    },
  },

  // 能量设置
  ENERGY: {
    MAX: 100,
    CHANGE_COLOR_COST: 10,
    INSECT_BONUS: 15,
  },

  // 关卡设置
  LEVELS: [
    {
      name: '热带雨林',
      backgroundColor: 0x4a7c59,
      duration: 60000, // 60秒
      insects: 20,
      enemies: 2,
    },
    {
      name: '沙漠',
      backgroundColor: 0xd4a574,
      duration: 90000,
      insects: 30,
      enemies: 3,
    },
    {
      name: '花园',
      backgroundColor: 0x7cb342,
      duration: 120000,
      insects: 40,
      enemies: 4,
    },
  ],
};