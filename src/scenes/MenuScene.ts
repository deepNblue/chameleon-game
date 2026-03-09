import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 背景色
    this.cameras.main.setBackgroundColor('#2d4059');

    // 游戏标题
    const title = this.add.text(width / 2, height / 3, '🦎 变色龙大冒险', {
      fontSize: '48px',
      color: '#4a9eff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // 副标题
    const subtitle = this.add.text(
      width / 2,
      height / 3 + 60,
      'Chameleon Adventure',
      {
        fontSize: '24px',
        color: '#ffffff',
      }
    );
    subtitle.setOrigin(0.5);

    // 开始按钮
    const startButton = this.add.text(width / 2, height / 2 + 50, '开始游戏', {
      fontSize: '32px',
      color: '#4a9eff',
      backgroundColor: '#1a1a2e',
      padding: { x: 30, y: 15 },
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    // 按钮悬停效果
    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#7ec8ff' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#4a9eff' });
    });

    // 点击开始游戏
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 说明文字
    const instructions = this.add.text(
      width / 2,
      height - 80,
      '使用方向键移动，空格键变色',
      {
        fontSize: '16px',
        color: '#aaaaaa',
      }
    );
    instructions.setOrigin(0.5);

    // 版本信息
    const version = this.add.text(width - 20, height - 20, 'v1.0.0', {
      fontSize: '14px',
      color: '#666666',
    });
    version.setOrigin(1, 1);
  }
}