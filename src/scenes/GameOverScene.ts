import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number }): void {
    const { width, height } = this.cameras.main;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 游戏结束标题
    const title = this.add.text(width / 2, height / 3, '游戏结束', {
      fontSize: '48px',
      color: '#ff6b6b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // 最终分数
    const scoreText = this.add.text(
      width / 2,
      height / 2,
      `最终分数: ${data.score}`,
      {
        fontSize: '32px',
        color: '#ffffff',
      }
    );
    scoreText.setOrigin(0.5);

    // 重新开始按钮
    const restartButton = this.add.text(
      width / 2,
      height / 2 + 80,
      '重新开始',
      {
        fontSize: '28px',
        color: '#4a9eff',
        backgroundColor: '#2d4059',
        padding: { x: 25, y: 12 },
      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 返回菜单按钮
    const menuButton = this.add.text(
      width / 2,
      height / 2 + 140,
      '返回菜单',
      {
        fontSize: '24px',
        color: '#aaaaaa',
      }
    );
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}