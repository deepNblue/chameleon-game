import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 显示加载进度
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
      font: '20px Arial',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5, 0.5);

    // 加载进度事件
    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt((value * 100).toString()).toString() + '%');
      progressBar.clear();
      progressBar.fillStyle(0x4a9eff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // TODO: 加载游戏资源
    // this.load.image('chameleon', 'assets/sprites/chameleon.png');
    // this.load.audio('bgm', 'assets/audio/bgm.mp3');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}