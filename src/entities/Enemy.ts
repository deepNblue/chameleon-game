import Phaser from 'phaser';

export type EnemyType = 'snake' | 'bird';

export class Enemy extends Phaser.GameObjects.Container {
  private body!: Phaser.GameObjects.ArcadeBody;
  private enemyType: EnemyType;
  private speed: number;
  private damage: number;
  private targetX: number = 0;
  private targetY: number = 0;
  private patrolTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: EnemyType = 'snake'
  ) {
    super(scene, x, y);
    this.enemyType = type;

    // 设置属性
    if (type === 'snake') {
      this.speed = 60;
      this.damage = 20;
    } else {
      this.speed = 200;
      this.damage = 30;
    }

    // 创建敌人图形
    const graphics = scene.add.graphics();
    const color = type === 'snake' ? 0x2e8b57 : 0x8b4513;

    if (type === 'snake') {
      // 蛇：长条形
      graphics.fillStyle(color, 1);
      graphics.fillRoundedRect(-40, -8, 80, 16, 8);
      graphics.fillStyle(0xff0000, 1);
      graphics.fillCircle(-35, 0, 6);
      graphics.fillCircle(-35, -3, 2);
    } else {
      // 鸟：翅膀形状
      graphics.fillStyle(color, 1);
      graphics.fillTriangle(-20, 0, 0, -20, 20, 0);
      graphics.fillStyle(0xffa500, 1);
      graphics.fillTriangle(-25, 0, -35, 5, -20, 0);
    }

    this.add(graphics);

    // 设置物理属性
    scene.physics.add.existing(this);
    this.body = this.body as Phaser.GameObjects.ArcadeBody;
    this.body.setCollideWorldBounds(true);
    this.body.setCircle(30);

    scene.add.existing(this);

    // 开始巡逻
    this.startPatrol();
  }

  private startPatrol(): void {
    // 设置随机目标点
    this.setNewTarget();
  }

  private setNewTarget(): void {
    this.targetX = Phaser.Math.RND.between(50, 750);
    this.targetY = Phaser.Math.RND.between(50, 550);
  }

  update(time: number, delta: number): void {
    this.patrolTimer += delta;

    // 每隔一段时间改变巡逻目标
    if (this.patrolTimer > 5000) {
      this.patrolTimer = 0;
      this.setNewTarget();
    }

    // 朝目标移动
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.targetX,
      this.targetY
    );

    if (distance > 10) {
      this.scene.physics.moveTo(this, this.targetX, this.targetY, this.speed);
    } else {
      this.setNewTarget();
    }
  }

  getDamage(): number {
    return this.damage;
  }

  getType(): EnemyType {
    return this.enemyType;
  }
}