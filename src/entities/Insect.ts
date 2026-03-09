import Phaser from 'phaser';
import { InsectConfig } from '../config/GameConfig';

export type InsectType = 'butterfly' | 'bee' | 'cricket';

export class Insect extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;
  private insectType: InsectType;
  private scoreValue: number;
  private moveSpeed: number;
  private moveTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: InsectType = 'butterfly'
  ) {
    super(scene, x, y);
    this.insectType = type;

    // 根据类型设置属性
    const config = InsectConfig[type.toUpperCase() as keyof typeof InsectConfig];
    this.scoreValue = config.SCORE;
    this.moveSpeed = config.SPEED;

    // 创建昆虫图形
    const graphics = scene.add.graphics();
    const color = this.getInsectColor();

    if (type === 'butterfly') {
      // 蝴蝶：翅膀形状
      graphics.fillStyle(color, 1);
      graphics.fillEllipse(-15, 0, 20, 25);
      graphics.fillEllipse(15, 0, 20, 25);
      graphics.fillStyle(0x000000, 1);
      graphics.fillRect(-3, -10, 6, 20);
    } else if (type === 'bee') {
      // 蜜蜂：条纹圆形
      graphics.fillStyle(0xffd700, 1);
      graphics.fillCircle(0, 0, 15);
      graphics.fillStyle(0x000000, 1);
      graphics.fillRect(-15, -3, 30, 3);
      graphics.fillRect(-15, 3, 30, 3);
    } else {
      // 蟋蟀：椭圆形
      graphics.fillStyle(0x228b22, 1);
      graphics.fillEllipse(0, 0, 25, 15);
      graphics.fillStyle(0x000000, 1);
      graphics.fillCircle(-8, -5, 3);
    }

    this.add(graphics);

    // 设置物理属性
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setCircle(20);

    scene.add.existing(this);

    // 开始随机移动
    this.startRandomMovement();
  }

  private getInsectColor(): number {
    const colors: Record<InsectType, number> = {
      butterfly: Phaser.Math.RND.pick([0xff69b4, 0x9370db, 0x87ceeb]),
      bee: 0xffd700,
      cricket: 0x228b22,
    };
    return colors[this.insectType];
  }

  private startRandomMovement(): void {
    // 随机方向移动
    const angle = Phaser.Math.RND.angle();
    this.scene.physics.velocityFromAngle(angle, this.moveSpeed, this.body.velocity);
  }

  update(_time: number, delta: number): void {
    this.moveTimer += delta;

    // 每隔一段时间改变方向
    if (this.moveTimer > 2000) {
      this.moveTimer = 0;
      this.startRandomMovement();
    }

    // 边界反弹
    if (this.x <= 20 || this.x >= 780) {
      this.body.velocity.x *= -1;
    }
    if (this.y <= 20 || this.y >= 580) {
      this.body.velocity.y *= -1;
    }
  }

  getScore(): number {
    return this.scoreValue;
  }

  getType(): InsectType {
    return this.insectType;
  }
}