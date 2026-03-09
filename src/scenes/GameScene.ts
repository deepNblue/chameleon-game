import Phaser from 'phaser';
import { Chameleon } from '../entities/Chameleon';
import { Insect } from '../entities/Insect';
import { Enemy } from '../entities/Enemy';
import { EnergySystem } from '../systems/EnergySystem';
import { ColorSystem } from '../systems/ColorSystem';
import { GameConfig } from '../config/GameConfig';

export class GameScene extends Phaser.Scene {
  private chameleon!: Chameleon;
  private insects!: Phaser.GameObjects.Group;
  private enemies!: Phaser.GameObjects.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private energySystem!: EnergySystem;
  private energyBar!: Phaser.GameObjects.Graphics;
  private matchText!: Phaser.GameObjects.Text;
  private currentLevel: number = 0;
  private levelTimer!: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // 设置背景色
    const levelConfig = GameConfig.LEVELS[this.currentLevel];
    this.cameras.main.setBackgroundColor(levelConfig.backgroundColor);

    // 创建变色龙
    this.chameleon = new Chameleon(this, 400, 300);

    // 初始化能量系统
    this.energySystem = new EnergySystem();

    // 创建昆虫组
    this.insects = this.add.group();
    this.spawnInsects(levelConfig.insects);

    // 创建敌人组
    this.enemies = this.add.group();
    this.spawnEnemies(levelConfig.enemies);

    // 创建UI
    this.createUI();

    // 创建键盘控制
    this.createControls();

    // 设置碰撞
    this.setupCollisions();

    // 设置关卡计时器
    this.levelTimer = levelConfig.duration;
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnInsects(count: number): void {
    const types: ('butterfly' | 'bee' | 'cricket')[] = ['butterfly', 'bee', 'cricket'];
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.RND.between(50, 750);
      const y = Phaser.Math.RND.between(50, 550);
      const type = Phaser.Math.RND.pick(types);
      const insect = new Insect(this, x, y, type);
      this.insects.add(insect);
    }
  }

  private spawnEnemies(count: number): void {
    const types: ('snake' | 'bird')[] = ['snake', 'bird'];
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.RND.between(100, 700);
      const y = Phaser.Math.RND.between(100, 500);
      const type = Phaser.Math.RND.pick(types);
      const enemy = new Enemy(this, x, y, type);
      this.enemies.add(enemy);
    }
  }

  private createUI(): void {
    // 分数
    this.scoreText = this.add.text(20, 20, '分数: 0', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    });

    // 能量条
    this.add.text(20, 60, '能量:', {
      fontSize: '18px',
      color: '#ffffff',
    });

    this.energyBar = this.add.graphics();
    this.updateEnergyBar();

    // 颜色匹配度
    this.matchText = this.add.text(20, 100, '隐身度: 0%', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    });

    // 关卡信息
    const levelConfig = GameConfig.LEVELS[this.currentLevel];
    this.add.text(this.cameras.main.width - 20, 20, `关卡: ${levelConfig.name}`, {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(1, 0);

    // 计时器
    this.add.text(this.cameras.main.width - 20, 50, '', {
      fontSize: '18px',
      color: '#ffffff',
    }).setName('timerText').setOrigin(1, 0);
  }

  private updateEnergyBar(): void {
    this.energyBar.clear();
    
    const energyPercent = this.energySystem.getEnergyPercent();
    const barWidth = energyPercent * 2;
    
    // 背景条
    this.energyBar.fillStyle(0x333333, 1);
    this.energyBar.fillRect(80, 62, 200, 20);
    
    // 能量条
    const color = energyPercent > 30 ? 0x4a9eff : 0xff6b6b;
    this.energyBar.fillStyle(color, 1);
    this.energyBar.fillRect(80, 62, barWidth, 20);
  }

  private createControls(): void {
    const cursors = this.input.keyboard?.createCursorKeys();

    if (cursors) {
      this.events.on('update', () => {
        let dx = 0;
        let dy = 0;

        if (cursors.left.isDown) dx = -1;
        else if (cursors.right.isDown) dx = 1;

        if (cursors.up.isDown) dy = -1;
        else if (cursors.down.isDown) dy = 1;

        if (dx !== 0 || dy !== 0) {
          this.chameleon.move(dx, dy);
        }
      });
    }

    // 空格键变色
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.energySystem.changeColor()) {
        this.chameleon.changeColor();
        this.updateEnergyBar();
      }
    });

    // ESC键暂停
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  private setupCollisions(): void {
    // 捕食昆虫
    this.physics.add.overlap(
      this.chameleon,
      this.insects,
      this.catchInsect as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // 碰到敌人
    this.physics.add.overlap(
      this.chameleon,
      this.enemies,
      this.hitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  private catchInsect(
    _chameleon: Phaser.GameObjects.GameObject,
    insectObj: Phaser.GameObjects.GameObject
  ): void {
    const insect = insectObj as Insect;
    
    // 增加分数
    this.score += insect.getScore();
    this.scoreText.setText(`分数: ${this.score}`);
    
    // 增加能量
    this.energySystem.eatInsect();
    this.updateEnergyBar();
    
    // 移除昆虫
    insect.destroy();
    
    // 检查是否还有昆虫
    if (this.insects.getLength() === 0) {
      this.levelComplete();
    }
  }

  private hitEnemy(
    _chameleon: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ): void {
    const enemy = enemyObj as Enemy;
    const bgColor = ColorSystem.getBackgroundColor(this);
    const matchPercent = ColorSystem.calculateMatch(this.chameleon.getColor(), bgColor);
    
    // 如果隐身度不够，游戏结束
    if (!ColorSystem.isHidden(matchPercent)) {
      this.gameOver();
    }
  }

  private updateTimer(): void {
    this.levelTimer -= 1000;
    const seconds = Math.ceil(this.levelTimer / 1000);
    const timerText = this.children.getByName('timerText') as Phaser.GameObjects.Text;
    
    if (timerText) {
      timerText.setText(`时间: ${seconds}s`);
    }
    
    if (this.levelTimer <= 0) {
      this.gameOver();
    }
  }

  private levelComplete(): void {
    // 进入下一关或游戏结束
    this.currentLevel++;
    
    if (this.currentLevel >= GameConfig.LEVELS.length) {
      // 游戏胜利
      this.scene.start('GameOverScene', { score: this.score });
    } else {
      // 进入下一关
      this.scene.restart({ level: this.currentLevel });
    }
  }

  private gameOver(): void {
    this.scene.start('GameOverScene', { score: this.score });
  }

  update(): void {
    // 更新变色龙
    this.chameleon.update();
    
    // 更新昆虫
    this.insects.getChildren().forEach((child) => {
      const insect = child as Insect;
      insect.update(0, 16.67);
    });
    
    // 更新敌人
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Enemy;
      enemy.update(0, 16.67);
    });
    
    // 更新颜色匹配度
    const bgColor = ColorSystem.getBackgroundColor(this);
    const matchPercent = ColorSystem.calculateMatch(this.chameleon.getColor(), bgColor);
    this.matchText.setText(`隐身度: ${matchPercent}%`);
    
    // 根据匹配度改变文字颜色
    if (ColorSystem.isHidden(matchPercent)) {
      this.matchText.setColor('#00ff00');
    } else {
      this.matchText.setColor('#ff0000');
    }
  }
}