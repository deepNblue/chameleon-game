import Phaser from 'phaser';
import { Chameleon } from '../entities/Chameleon';

export class GameScene extends Phaser.Scene {
  private chameleon!: Chameleon;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private energyText!: Phaser.GameObjects.Text;
  private energy: number = 100;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // 设置背景色（模拟环境）
    this.cameras.main.setBackgroundColor('#4a7c59');

    // 创建变色龙
    this.chameleon = new Chameleon(this, 400, 300);

    // 创建UI
    this.createUI();

    // 创建键盘控制
    this.createControls();

    // TODO: 创建昆虫和天敌
    // TODO: 创建颜色匹配系统
  }

  private createUI(): void {
    // 分数
    this.scoreText = this.add.text(20, 20, '分数: 0', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });

    // 能量条
    this.add.text(20, 60, '能量:', {
      fontSize: '18px',
      color: '#ffffff',
    });

    const energyBar = this.add.graphics();
    energyBar.fillStyle(0x4a9eff, 1);
    energyBar.fillRect(80, 62, this.energy * 2, 20);

    this.energyText = this.add.text(
      80 + this.energy + 10,
      60,
      `${this.energy}%`,
      {
        fontSize: '18px',
        color: '#ffffff',
      }
    );
  }

  private createControls(): void {
    // 方向键控制
    const cursors = this.input.keyboard?.createCursorKeys();

    if (cursors) {
      this.events.on('update', () => {
        if (cursors.left.isDown) {
          this.chameleon.move(-5, 0);
        } else if (cursors.right.isDown) {
          this.chameleon.move(5, 0);
        }

        if (cursors.up.isDown) {
          this.chameleon.move(0, -5);
        } else if (cursors.down.isDown) {
          this.chameleon.move(0, 5);
        }
      });
    }

    // 空格键变色
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.chameleon.changeColor();
    });
  }

  update(): void {
    // TODO: 更新游戏逻辑
  }

  addScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`分数: ${this.score}`);
  }

  useEnergy(amount: number): void {
    this.energy = Math.max(0, this.energy - amount);
    // TODO: 更新能量条
  }
}