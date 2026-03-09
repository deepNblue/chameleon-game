import Phaser from 'phaser';
import { Chameleon } from './Chameleon';

export type EnemyType = 'snake' | 'bird';

export enum EnemyState {
  IDLE = 'idle',
  PATROL = 'patrol',
  CHASE = 'chase',
  ATTACK = 'attack',
  RETURN = 'return'
}

export class Enemy extends Phaser.GameObjects.Container {
  private sprite!: Phaser.GameObjects.Graphics;
  private physicsBody!: Phaser.Physics.Arcade.Body;
  private enemyType: EnemyType;
  private currentState: EnemyState = EnemyState.PATROL;
  
  // 基础属性
  private speed: number;
  private chaseSpeed: number;
  private damage: number;
  private health: number;
  private maxHealth: number;
  
  // 巡逻相关
  private patrolPoints: Phaser.Math.Vector2[] = [];
  private currentPatrolIndex: number = 0;
  private patrolWaitTime: number = 0;
  private patrolPauseDuration: number = 2000; // 毫秒
  
  // 追击相关
  private detectionRange: number = 150;
  private attackRange: number = 40;
  private loseSightRange: number = 250;
  private target: Chameleon | null = null;

  // 初始位置（用于返回巡逻）
  private homePosition: Phaser.Math.Vector2;

  // 动画相关
  private animationTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: EnemyType = 'snake'
  ) {
    super(scene, x, y);
    this.enemyType = type;
    this.homePosition = new Phaser.Math.Vector2(x, y);

    // 根据类型设置属性
    if (type === 'snake') {
      // 蛇：速度慢，伤害中等，血量高
      this.speed = 60;
      this.chaseSpeed = 100;
      this.damage = 20;
      this.health = 100;
      this.maxHealth = 100;
      this.detectionRange = 120;
    } else {
      // 鸟：速度快，伤害高，血量低
      this.speed = 100;
      this.chaseSpeed = 180;
      this.damage = 30;
      this.health = 60;
      this.maxHealth = 60;
      this.detectionRange = 200;
    }

    this.createGraphics();
    this.setupPhysics(scene);
    this.generatePatrolPoints(scene);
    
    scene.add.existing(this);
  }

  private createGraphics(): void {
    this.sprite = this.scene.add.graphics();
    
    if (this.enemyType === 'snake') {
      this.drawSnake();
    } else {
      this.drawBird();
    }
    
    this.add(this.sprite);
  }

  private drawSnake(): void {
    const g = this.sprite;
    g.clear();
    
    // 蛇身体（波浪形）
    g.fillStyle(0x2e8b57, 1); // 海绿色
    g.fillRoundedRect(-50, -10, 100, 20, 10);
    
    // 头部
    g.fillStyle(0x3cb371, 1);
    g.fillCircle(-45, 0, 12);
    
    // 眼睛
    g.fillStyle(0xff0000, 1);
    g.fillCircle(-48, -3, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(-47, -3, 2);
    
    // 舌头
    g.lineStyle(2, 0xff1493);
    g.beginPath();
    g.moveTo(-57, 0);
    g.lineTo(-70, -5);
    g.moveTo(-57, 0);
    g.lineTo(-70, 5);
    g.strokePath();
    
    // 身体纹理
    g.lineStyle(1, 0x228b22);
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      g.moveTo(-30 + i * 20, -10);
      g.lineTo(-30 + i * 20, 10);
      g.strokePath();
    }
  }

  private drawBird(): void {
    const g = this.sprite;
    g.clear();
    
    // 身体
    g.fillStyle(0x8b4513, 1); // 棕色
    g.fillEllipse(0, 0, 40, 30);
    
    // 翅膀
    g.fillStyle(0xa0522d, 1);
    g.fillTriangle(-30, 0, 0, -25, 10, 0);
    g.fillTriangle(30, 0, 0, -25, -10, 0);
    
    // 头部
    g.fillStyle(0x8b4513, 1);
    g.fillCircle(25, -5, 12);
    
    // 喙
    g.fillStyle(0xffa500, 1);
    g.fillTriangle(35, -5, 50, -3, 35, 0);
    
    // 眼睛
    g.fillStyle(0xffd700, 1);
    g.fillCircle(28, -8, 5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(29, -8, 2);
    
    // 尾巴
    g.fillStyle(0x654321, 1);
    g.fillTriangle(-30, 0, -50, -15, -50, 15);
  }

  private setupPhysics(scene: Phaser.Scene): void {
    scene.physics.add.existing(this);
    this.physicsBody = this.body as Phaser.Physics.Arcade.Body;
    
    this.physicsBody.setCollideWorldBounds(true);
    this.physicsBody.setBounce(0.2, 0.2);
    
    if (this.enemyType === 'snake') {
      this.physicsBody.setSize(100, 20);
      this.physicsBody.setOffset(-50, -10);
    } else {
      this.physicsBody.setSize(60, 40);
      this.physicsBody.setOffset(-30, -20);
    }
    
    this.physicsBody.setDrag(100, 100);
  }

  private generatePatrolPoints(scene: Phaser.Scene): void {
    // 生成3-5个巡逻点
    const numPoints = Phaser.Math.RND.between(3, 5);
    const patrolRadius = 150;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = Phaser.Math.RND.between(patrolRadius * 0.5, patrolRadius);
      const px = this.homePosition.x + Math.cos(angle) * radius;
      const py = this.homePosition.y + Math.sin(angle) * radius;
      
      // 确保在场景范围内
      const clampedX = Phaser.Math.Clamp(px, 50, (scene.scale.width as number) - 50);
      const clampedY = Phaser.Math.Clamp(py, 50, (scene.scale.height as number) - 50);
      
      this.patrolPoints.push(new Phaser.Math.Vector2(clampedX, clampedY));
    }
  }

  setTarget(player: Chameleon | null): void {
    this.target = player;
  }

  update(_time: number, _delta: number): void {
    // 状态机更新
    switch (this.currentState) {
      case EnemyState.IDLE:
        this.updateIdle(delta);
        break;
      case EnemyState.PATROL:
        this.updatePatrol(delta);
        break;
      case EnemyState.CHASE:
        this.updateChase(delta);
        break;
      case EnemyState.ATTACK:
        this.updateAttack(delta);
        break;
      case EnemyState.RETURN:
        this.updateReturn(delta);
        break;
    }
    
    // 动画更新
    this.updateAnimation(delta);
    
    // 更新朝向
    this.updateDirection();
  }

  private updateIdle(delta: number): void {
    // 检测玩家
    if (this.detectPlayer()) {
      this.changeState(EnemyState.CHASE);
      return;
    }
    
    // 空闲一段时间后开始巡逻
    this.patrolWaitTime -= delta;
    if (this.patrolWaitTime <= 0) {
      this.changeState(EnemyState.PATROL);
    }
  }

  private updatePatrol(_delta: number): void {
    // 检测玩家
    if (this.detectPlayer()) {
      this.changeState(EnemyState.CHASE);
      return;
    }
    
    // 移动到下一个巡逻点
    if (this.patrolPoints.length === 0) return;
    
    const target = this.patrolPoints[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      target.x, target.y
    );
    
    if (distance < 10) {
      // 到达巡逻点，等待后移动到下一个
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      this.patrolWaitTime = this.patrolPauseDuration;
      this.changeState(EnemyState.IDLE);
    } else {
      // 移动到巡逻点
      this.scene.physics.moveTo(
        this,
        target.x,
        target.y,
        this.speed
      );
    }
  }

  private updateChase(delta: number): void {
    if (!this.target) {
      this.changeState(EnemyState.RETURN);
      return;
    }
    
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.target.x, this.target.y
    );
    
    // 检查是否在攻击范围内
    if (distanceToPlayer <= this.attackRange) {
      this.changeState(EnemyState.ATTACK);
      return;
    }
    
    // 检查是否丢失目标
    if (distanceToPlayer > this.loseSightRange) {
      this.lastKnownPlayerPos = new Phaser.Math.Vector2(this.target.x, this.target.y);
      this.changeState(EnemyState.RETURN);
      return;
    }
    
    // 追击玩家
    this.scene.physics.moveTo(
      this,
      this.target.x,
      this.target.y,
      this.chaseSpeed
    );
  }

  private updateAttack(_delta: number): void {
    // 停止移动
    this.physicsBody.setVelocity(0, 0);
    
    // 造成伤害（通过场景中的碰撞检测处理）
    // 这里可以添加攻击动画和特效
    
    // 攻击后短暂停顿
    this.patrolWaitTime = 500;
    this.changeState(EnemyState.IDLE);
  }

  private updateReturn(_delta: number): void {
    // 返回初始位置或巡逻路线
    const distanceToHome = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.homePosition.x,
      this.homePosition.y
    );
    
    // 检测玩家
    if (this.detectPlayer()) {
      this.changeState(EnemyState.CHASE);
      return;
    }
    
    if (distanceToHome < 20) {
      // 到达初始位置，恢复巡逻
      this.currentPatrolIndex = 0;
      this.changeState(EnemyState.PATROL);
    } else {
      // 返回初始位置
      this.scene.physics.moveTo(
        this,
        this.homePosition.x,
        this.homePosition.y,
        this.speed
      );
    }
  }

  private detectPlayer(): boolean {
    if (!this.target) return false;
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.target.x, this.target.y
    );
    
    // TODO: 可以添加视线检测（raycast）
    
    return distance <= this.detectionRange;
  }

  private changeState(newState: EnemyState): void {
    if (this.currentState === newState) return;
    
    // 退出旧状态
    this.onStateExit(this.currentState);
    
    // 进入新状态
    this.currentState = newState;
    this.onStateEnter(newState);
  }

  private onStateEnter(state: EnemyState): void {
    switch (state) {
      case EnemyState.IDLE:
        this.physicsBody.setVelocity(0, 0);
        break;
      case EnemyState.CHASE:
        // 可以播放追击音效
        break;
      case EnemyState.ATTACK:
        // 可以播放攻击音效
        break;
    }
  }

  private onStateExit(_state: EnemyState): void {
    // 清理状态相关资源
  }

  private updateAnimation(delta: number): void {
    this.animationTimer += delta;
    
    // 简单的动画效果
    if (this.enemyType === 'snake') {
      // 蛇的扭动效果
      const wave = Math.sin(this.animationTimer * 0.01) * 3;
      this.sprite.y = wave;
    } else {
      // 鸟的上下浮动
      const float = Math.sin(this.animationTimer * 0.005) * 5;
      this.sprite.y = float;
    }
  }

  private updateDirection(): void {
    // 根据速度方向更新朝向
    if (this.physicsBody.velocity.x > 10) {
      this.sprite.setScale(1, 1);
    } else if (this.physicsBody.velocity.x < -10) {
      this.sprite.setScale(-1, 1);
    }
  }

  // 公共方法
  takeDamage(amount: number): void {
    this.health -= amount;
    
    // 闪烁效果
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2
    });
    
    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    // 死亡动画
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 500,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  getDamage(): number {
    return this.damage;
  }

  getType(): EnemyType {
    return this.enemyType;
  }

  getState(): EnemyState {
    return this.currentState;
  }

  getHealth(): number {
    return this.health;
  }

  getHealthPercent(): number {
    return this.health / this.maxHealth;
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}
