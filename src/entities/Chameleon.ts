import Phaser from 'phaser';

export class Chameleon extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;
  private color: number = 0x4a9eff; // 当前颜色
  private targetColor: number = 0x4a9eff; // 目标颜色

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // 创建变色龙图形（临时使用圆形）
    const graphics = scene.add.graphics();
    graphics.fillStyle(this.color, 1);
    graphics.fillCircle(0, 0, 30);
    this.add(graphics);

    // 添加眼睛
    const eyeLeft = scene.add.circle(-10, -10, 8, 0xffffff);
    const eyeRight = scene.add.circle(10, -10, 8, 0xffffff);
    const pupilLeft = scene.add.circle(-10, -10, 4, 0x000000);
    const pupilRight = scene.add.circle(10, -10, 4, 0x000000);

    this.add(eyeLeft);
    this.add(eyeRight);
    this.add(pupilLeft);
    this.add(pupilRight);

    // 添加尾巴
    const tail = scene.add.graphics();
    tail.lineStyle(8, this.color, 1);
    tail.beginPath();
    tail.moveTo(30, 0);
    // 使用 lineTo 代替 quadraticCurveTo
    tail.lineTo(45, -10);
    tail.lineTo(60, 0);
    tail.strokePath();
    this.add(tail);

    // 设置物理属性
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setCircle(30);

    scene.add.existing(this);
  }

  move(dx: number, dy: number): void {
    this.body.velocity.x = dx * 60;
    this.body.velocity.y = dy * 60;
  }

  changeColor(): void {
    // 随机生成新颜色
    const r = Phaser.Math.Between(100, 255);
    const g = Phaser.Math.Between(100, 255);
    const b = Phaser.Math.Between(100, 255);
    this.targetColor = (r << 16) | (g << 8) | b;

    // TODO: 添加颜色过渡动画
    this.updateColor();
  }

  private updateColor(): void {
    // 更新变色龙颜色
    const graphics = this.getAt(0) as Phaser.GameObjects.Graphics;
    graphics.clear();
    graphics.fillStyle(this.targetColor, 1);
    graphics.fillCircle(0, 0, 30);
    this.color = this.targetColor;
  }

  getColor(): number {
    return this.color;
  }

  matchColor(environmentColor: number): number {
    // 计算颜色匹配度（0-100）
    const r1 = (this.color >> 16) & 0xff;
    const g1 = (this.color >> 8) & 0xff;
    const b1 = this.color & 0xff;

    const r2 = (environmentColor >> 16) & 0xff;
    const g2 = (environmentColor >> 8) & 0xff;
    const b2 = environmentColor & 0xff;

    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );

    const maxDistance = Math.sqrt(3 * Math.pow(255, 2));
    const matchPercent = Math.max(0, 100 - (distance / maxDistance) * 100);

    return Math.round(matchPercent);
  }

  update(): void {
    // 停止移动（减速）
    this.body.velocity.x *= 0.95;
    this.body.velocity.y *= 0.95;
  }
}