import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // 暂停标题
    const title = this.add.text(width / 2, height / 3, '游戏暂停', {
      fontSize: '48px',
      color: '#4a9eff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // 继续游戏按钮
    const resumeButton = this.add.text(width / 2, height / 2, '继续游戏', {
      fontSize: '32px',
      color: '#4a9eff',
      backgroundColor: '#1a1a2e',
      padding: { x: 30, y: 15 },
    });
    resumeButton.setOrigin(0.5);
    resumeButton.setInteractive({ useHandCursor: true });

    resumeButton.on('pointerover', () => {
      resumeButton.setStyle({ color: '#7ec8ff' });
    });

    resumeButton.on('pointerout', () => {
      resumeButton.setStyle({ color: '#4a9eff' });
    });

    resumeButton.on('pointerdown', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    // 重新开始按钮
    const restartButton = this.add.text(width / 2, height / 2 + 70, '重新开始', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#2d4059',
      padding: { x: 25, y: 12 },
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
      this.scene.stop();
    });

    // 返回菜单按钮
    const menuButton = this.add.text(width / 2, height / 2 + 130, '返回菜单', {
      fontSize: '28px',
      color: '#aaaaaa',
      backgroundColor: '#2d4059',
      padding: { x: 25, y: 12 },
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerdown', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
      this.scene.stop();
    });

    // 游戏说明
    const instructions = this.add.text(
      width / 2,
      height - 100,
      '方向键移动 | 空格键变色 | ESC暂停',
      {
        fontSize: '16px',
        color: '#888888',
      }
    );
    instructions.setOrigin(0.5);
  }
}