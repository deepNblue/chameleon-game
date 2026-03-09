import Phaser from 'phaser';

/**
 * 主菜单场景
 * 显示游戏标题、开始按钮、游戏说明按钮和背景装饰
 */
export class MenuScene extends Phaser.Scene {
  // 按钮引用，用于动画效果
  private startButton!: Phaser.GameObjects.Container;
  private helpButton!: Phaser.GameObjects.Container;
  private helpPanel!: Phaser.GameObjects.Container;
  private isHelpVisible: boolean = false;

  constructor() {
    super({ key: 'MenuScene' });
  }

  /**
   * 创建菜单场景
   */
  create(): void {
    const { width, height } = this.cameras.main;

    // 设置背景色
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 创建背景装饰
    this.createBackgroundDecorations();

    // 创建游戏标题
    this.createTitle(width, height);

    // 创建菜单按钮
    this.createButtons(width, height);

    // 创建游戏说明面板（默认隐藏）
    this.createHelpPanel(width, height);

    // 创建底部信息
    this.createFooter(width, height);

    // 添加键盘快捷键
    this.setupKeyboardShortcuts();
  }

  /**
   * 创建背景装饰图形
   */
  private createBackgroundDecorations(): void {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();

    // 绘制渐变背景效果
    for (let i = 0; i < 5; i++) {
      const alpha = 0.05 + i * 0.02;
      graphics.fillStyle(0x4a9eff, alpha);
      graphics.fillCircle(
        Phaser.Math.RND.between(0, width),
        Phaser.Math.RND.between(0, height),
        Phaser.Math.RND.between(50, 150)
      );
    }

    // 绘制装饰性几何图形
    this.createFloatingShapes();

    // 绘制底部波浪效果
    this.createWaveEffect();
  }

  /**
   * 创建浮动装饰图形
   */
  private createFloatingShapes(): void {
    const { width, height } = this.cameras.main;
    const colors = [0x4a9eff, 0xff6b6b, 0x4ecdc4, 0xffe66d];

    // 创建多个浮动的图形
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.RND.between(50, width - 50);
      const y = Phaser.Math.RND.between(50, height - 50);
      const size = Phaser.Math.RND.between(10, 30);
      const color = Phaser.Math.RND.pick(colors);

      // 随机创建不同形状
      const shape = this.add.graphics();
      shape.fillStyle(color, 0.3);
      shape.lineStyle(2, color, 0.5);

      const shapeType = i % 3;
      if (shapeType === 0) {
        // 圆形
        shape.fillCircle(0, 0, size);
        shape.strokeCircle(0, 0, size);
      } else if (shapeType === 1) {
        // 三角形
        shape.fillTriangle(0, -size, -size, size, size, size);
        shape.strokeTriangle(0, -size, -size, size, size, size);
      } else {
        // 菱形
        shape.fillRect(-size / 2, -size / 2, size, size);
        shape.strokeRect(-size / 2, -size / 2, size, size);
      }

      shape.setPosition(x, y);

      // 添加浮动动画
      this.tweens.add({
        targets: shape,
        y: y + Phaser.Math.RND.between(-20, 20),
        alpha: { from: 0.3, to: 0.6 },
        duration: Phaser.Math.RND.between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  /**
   * 创建底部波浪效果
   */
  private createWaveEffect(): void {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();

    // 绘制波浪
    const drawWave = (yOffset: number, color: number, alpha: number) => {
      graphics.fillStyle(color, alpha);
      graphics.beginPath();
      graphics.moveTo(0, height);

      for (let x = 0; x <= width; x += 10) {
        const y = height - yOffset + Math.sin(x * 0.02 + this.time.now * 0.001) * 10;
        graphics.lineTo(x, y);
      }

      graphics.lineTo(width, height);
      graphics.closePath();
      graphics.fillPath();
    };

    // 多层波浪
    drawWave(100, 0x4a9eff, 0.1);
    drawWave(80, 0x4a9eff, 0.15);
    drawWave(60, 0x4a9eff, 0.2);
  }

  /**
   * 创建游戏标题
   */
  private createTitle(width: number, height: number): void {
    // 变色龙图标
    const chameleonIcon = this.add.text(width / 2, height / 4 - 20, '🦎', {
      fontSize: '80px',
    });
    chameleonIcon.setOrigin(0.5);

    // 主标题
    const title = this.add.text(width / 2, height / 4 + 60, '变色龙大冒险', {
      fontSize: '56px',
      color: '#4a9eff',
      fontStyle: 'bold',
      stroke: '#1a1a2e',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 5,
        fill: true,
      },
    });
    title.setOrigin(0.5);

    // 副标题
    const subtitle = this.add.text(width / 2, height / 4 + 120, 'Chameleon Adventure', {
      fontSize: '20px',
      color: '#aaaaaa',
      fontStyle: 'italic',
    });
    subtitle.setOrigin(0.5);

    // 标题动画
    this.tweens.add({
      targets: [chameleonIcon, title],
      scaleX: { from: 0.8, to: 1 },
      scaleY: { from: 0.8, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Back.easeOut',
    });
  }

  /**
   * 创建菜单按钮
   */
  private createButtons(width: number, height: number): void {
    // 开始游戏按钮
    this.startButton = this.createButton(
      width / 2,
      height / 2 + 50,
      '🎮  开始游戏',
      '#4a9eff',
      () => this.startGame()
    );

    // 游戏说明按钮
    this.helpButton = this.createButton(
      width / 2,
      height / 2 + 130,
      '📖  游戏说明',
      '#4ecdc4',
      () => this.toggleHelp()
    );

    // 按钮入场动画
    this.tweens.add({
      targets: this.startButton,
      y: height / 2 + 50,
      alpha: { from: 0, to: 1 },
      duration: 600,
      delay: 300,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: this.helpButton,
      y: height / 2 + 130,
      alpha: { from: 0, to: 1 },
      duration: 600,
      delay: 500,
      ease: 'Back.easeOut',
    });
  }

  /**
   * 创建单个按钮
   */
  private createButton(
    x: number,
    y: number,
    text: string,
    color: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // 按钮背景
    const background = this.add.graphics();
    const buttonWidth = 240;
    const buttonHeight = 50;
    const radius = 10;

    // 解析颜色
    const fillColor = Phaser.Display.Color.HexStringToColor(color).color;

    // 绘制圆角矩形
    background.fillStyle(fillColor, 0.2);
    background.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
    background.lineStyle(2, fillColor, 0.8);
    background.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);

    // 按钮文字
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: color,
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    container.add([background, buttonText]);
    container.setSize(buttonWidth, buttonHeight);
    container.setInteractive({ useHandCursor: true });

    // Hover效果
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Sine.easeOut',
      });

      // 高亮背景
      background.clear();
      background.fillStyle(fillColor, 0.4);
      background.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
      background.lineStyle(3, fillColor, 1);
      background.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);

      buttonText.setStyle({ color: '#ffffff' });
    });

    container.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Sine.easeOut',
      });

      // 恢复背景
      background.clear();
      background.fillStyle(fillColor, 0.2);
      background.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
      background.lineStyle(2, fillColor, 0.8);
      background.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);

      buttonText.setStyle({ color: color });
    });

    // 点击效果
    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback,
      });
    });

    return container;
  }

  /**
   * 创建游戏说明面板
   */
  private createHelpPanel(width: number, height: number): void {
    this.helpPanel = this.add.container(width / 2, height / 2);
    this.helpPanel.setVisible(false);
    this.helpPanel.setAlpha(0);

    // 半透明背景
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setInteractive(); // 阻止点击穿透

    // 面板背景
    const panelWidth = 500;
    const panelHeight = 400;
    const panel = this.add.graphics();
    panel.fillStyle(0x1a1a2e, 0.95);
    panel.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 20);
    panel.lineStyle(3, 0x4a9eff, 0.8);
    panel.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 20);

    // 标题
    const title = this.add.text(0, -panelHeight / 2 + 40, '📖 游戏说明', {
      fontSize: '32px',
      color: '#4a9eff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // 说明内容
    const content = `
【游戏目标】
控制变色龙捕食昆虫，躲避天敌

【操作方式】
⬆️ ⬇️ ⬅️ ➡️  方向键移动
空格键  变换身体颜色
ESC键  暂停游戏

【游戏技巧】
• 变色可以躲避天敌
• 捕食昆虫恢复能量
• 颜色匹配度越高越安全

【计分规则】
🦋 蝴蝶: 10分
🐝 蜜蜂: 20分
🦗 蟋蟀: 15分
    `;

    const contentText = this.add.text(0, 20, content, {
      fontSize: '16px',
      color: '#ffffff',
      align: 'left',
      lineSpacing: 8,
    });
    contentText.setOrigin(0.5);

    // 关闭按钮
    const closeButton = this.add.text(panelWidth / 2 - 30, -panelHeight / 2 + 30, '✕', {
      fontSize: '28px',
      color: '#ff6b6b',
    });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on('pointerover', () => closeButton.setColor('#ff9999'));
    closeButton.on('pointerout', () => closeButton.setColor('#ff6b6b'));
    closeButton.on('pointerdown', () => this.toggleHelp());

    // 点击背景关闭
    overlay.on('pointerdown', () => this.toggleHelp());

    this.helpPanel.add([overlay, panel, title, contentText, closeButton]);
  }

  /**
   * 创建底部信息
   */
  private createFooter(width: number, height: number): void {
    // 操作提示
    const hint = this.add.text(width / 2, height - 60, '按 Enter 快速开始 | 按 H 查看说明', {
      fontSize: '14px',
      color: '#666666',
    });
    hint.setOrigin(0.5);

    // 版本信息
    const version = this.add.text(width - 20, height - 20, 'v1.0.0', {
      fontSize: '12px',
      color: '#444444',
    });
    version.setOrigin(1, 1);

    // 闪烁动画
    this.tweens.add({
      targets: hint,
      alpha: { from: 0.5, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * 设置键盘快捷键
   */
  private setupKeyboardShortcuts(): void {
    // Enter键快速开始
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (!this.isHelpVisible) {
        this.startGame();
      }
    });

    // H键查看说明
    this.input.keyboard?.on('keydown-H', () => {
      this.toggleHelp();
    });

    // ESC键关闭说明
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.isHelpVisible) {
        this.toggleHelp();
      }
    });
  }

  /**
   * 开始游戏
   */
  private startGame(): void {
    // 过渡动画
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  /**
   * 切换帮助面板显示状态
   */
  private toggleHelp(): void {
    this.isHelpVisible = !this.isHelpVisible;

    if (this.isHelpVisible) {
      this.helpPanel.setVisible(true);
      this.tweens.add({
        targets: this.helpPanel,
        alpha: 1,
        scale: { from: 0.8, to: 1 },
        duration: 200,
        ease: 'Back.easeOut',
      });
    } else {
      this.tweens.add({
        targets: this.helpPanel,
        alpha: 0,
        scale: 0.8,
        duration: 150,
        ease: 'Sine.easeIn',
        onComplete: () => this.helpPanel.setVisible(false),
      });
    }
  }
}
