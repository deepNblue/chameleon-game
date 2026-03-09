import Phaser from 'phaser';

/**
 * 启动场景 - 负责加载游戏资源并显示加载进度
 * 
 * 功能：
 * - 显示加载进度条和百分比
 * - 预加载游戏所需的所有资源（图片、音效等）
 * - 加载完成后自动跳转到菜单场景
 */
export class BootScene extends Phaser.Scene {
  // 场景标识符
  constructor() {
    super({ key: 'BootScene' });
  }

  /**
   * 预加载方法 - 加载所有游戏资源
   */
  preload(): void {
    // 创建加载UI
    this.createLoadingUI();
    
    // 加载游戏资源
    this.loadGameAssets();
  }

  /**
   * 创建加载界面UI元素
   */
  private createLoadingUI(): void {
    const { width, height } = this.cameras.main;

    // 背景色
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // ========== 进度条背景 ==========
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 50);
    progressBox.lineStyle(3, 0x4a9eff, 1);
    progressBox.strokeRect(width / 2 - 160, height / 2 - 15, 320, 50);

    // ========== 进度条前景 ==========
    const progressBar = this.add.graphics();

    // ========== 加载文字 ==========
    const loadingText = this.add.text(
      width / 2,
      height / 2 - 80,
      '🦎 变色龙大冒险',
      {
        fontSize: '36px',
        color: '#4a9eff',
        fontStyle: 'bold',
      }
    );
    loadingText.setOrigin(0.5, 0.5);

    // ========== 加载提示 ==========
    const tipText = this.add.text(
      width / 2,
      height / 2 + 60,
      '正在加载游戏资源...',
      {
        fontSize: '18px',
        color: '#aaaaaa',
      }
    );
    tipText.setOrigin(0.5, 0.5);

    // ========== 百分比文字 ==========
    const percentText = this.add.text(width / 2, height / 2 + 10, '0%', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    percentText.setOrigin(0.5, 0.5);

    // ========== 加载动画 ==========
    const dots = ['.', '..', '...', '....'];
    let dotIndex = 0;
    const dotTimer = this.time.addEvent({
      delay: 300,
      callback: () => {
        tipText.setText(`正在加载游戏资源${dots[dotIndex]}`);
        dotIndex = (dotIndex + 1) % dots.length;
      },
      loop: true,
    });

    // ========== 进度事件监听 ==========
    this.load.on('progress', (value: number) => {
      // 更新百分比文字
      const percent = Math.round(value * 100);
      percentText.setText(`${percent}%`);

      // 更新进度条
      progressBar.clear();
      progressBar.fillStyle(0x4a9eff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 5, 300 * value, 30);

      // 添加渐变效果
      progressBar.fillStyle(0x7ec8ff, 0.5);
      progressBar.fillRect(width / 2 - 150, height / 2 - 5, 300 * value, 15);
    });

    // ========== 加载完成事件 ==========
    this.load.on('complete', () => {
      // 停止动画定时器
      dotTimer.destroy();

      // 淡出动画
      this.cameras.main.fadeOut(500, 0, 0, 0);

      // 清理UI元素
      this.tweens.add({
        targets: [progressBar, progressBox, loadingText, percentText, tipText],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
          percentText.destroy();
          tipText.destroy();
        },
      });
    });

    // ========== 加载错误事件 ==========
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error(`资源加载失败: ${file.key}`, file);
      tipText.setText(`加载失败: ${file.key}`);
      tipText.setColor('#ff4444');
    });
  }

  /**
   * 加载游戏资源
   */
  private loadGameAssets(): void {
    // ========== 图片资源 ==========
    // 变色龙精灵
    // this.load.image('chameleon', 'assets/sprites/chameleon.png');
    // this.load.spritesheet('chameleon-idle', 'assets/sprites/chameleon-idle.png', {
    //   frameWidth: 64,
    //   frameHeight: 64,
    // });

    // 背景图片
    // this.load.image('bg-forest', 'assets/backgrounds/forest.png');
    // this.load.image('bg-desert', 'assets/backgrounds/desert.png');
    // this.load.image('bg-jungle', 'assets/backgrounds/jungle.png');

    // UI元素
    // this.load.image('button', 'assets/ui/button.png');
    // this.load.image('button-hover', 'assets/ui/button-hover.png');
    // this.load.image('heart', 'assets/ui/heart.png');

    // 障碍物和道具
    // this.load.image('platform', 'assets/sprites/platform.png');
    // this.load.image('enemy', 'assets/sprites/enemy.png');
    // this.load.image('collectible', 'assets/sprites/collectible.png');

    // ========== 音频资源 ==========
    // 背景音乐
    // this.load.audio('bgm-menu', 'assets/audio/menu.mp3');
    // this.load.audio('bgm-game', 'assets/audio/game.mp3');

    // 音效
    // this.load.audio('sfx-jump', 'assets/audio/jump.wav');
    // this.load.audio('sfx-color-change', 'assets/audio/color-change.wav');
    // this.load.audio('sfx-collect', 'assets/audio/collect.wav');
    // this.load.audio('sfx-hit', 'assets/audio/hit.wav');

    // ========== 图集资源 ==========
    // this.load.atlas('particles', 'assets/particles/particles.png', 'assets/particles/particles.json');

    // ========== 字体资源 ==========
    // this.load.bitmapFont('font-main', 'assets/fonts/main.png', 'assets/fonts/main.fnt');

    // 模拟加载延迟（开发阶段使用，生产环境删除）
    // this.load.image('__placeholder__', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  }

  /**
   * 创建方法 - 加载完成后执行
   */
  create(): void {
    // 等待淡出动画完成后跳转
    this.time.delayedCall(600, () => {
      // 淡入效果
      this.cameras.main.fadeIn(500);
      
      // 跳转到菜单场景
      this.scene.start('MenuScene');
    });

    // 可以在这里初始化游戏数据
    this.initializeGameData();
  }

  /**
   * 初始化游戏数据
   */
  private initializeGameData(): void {
    // 初始化游戏设置
    if (!this.registry.has('highScore')) {
      this.registry.set('highScore', 0);
    }
    
    if (!this.registry.has('soundEnabled')) {
      this.registry.set('soundEnabled', true);
    }
    
    if (!this.registry.has('musicEnabled')) {
      this.registry.set('musicEnabled', true);
    }

    // 初始化游戏统计
    if (!this.registry.has('totalPlays')) {
      this.registry.set('totalPlays', 0);
    }
  }
}
