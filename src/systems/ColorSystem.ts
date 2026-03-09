export class ColorSystem {
  /**
   * 计算两个颜色的匹配度（0-100）
   */
  static calculateMatch(color1: number, color2: number): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    // 欧几里得距离
    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );

    // 最大距离
    const maxDistance = Math.sqrt(3 * Math.pow(255, 2));

    // 转换为百分比（距离越小，匹配度越高）
    const matchPercent = Math.max(0, 100 - (distance / maxDistance) * 100);

    return Math.round(matchPercent);
  }

  /**
   * 颜色插值
   */
  static lerpColor(color1: number, color2: number, t: number): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return (r << 16) | (g << 8) | b;
  }

  /**
   * 获取背景主要颜色（简化版）
   */
  static getBackgroundColor(scene: Phaser.Scene): number {
    // 从场景背景色获取
    const bgColor = scene.cameras.main.backgroundColor;
    return Phaser.Display.Color.GetColor(bgColor.red, bgColor.green, bgColor.blue);
  }

  /**
   * 判断是否隐身（匹配度 > 70%）
   */
  static isHidden(matchPercent: number): boolean {
    return matchPercent >= 70;
  }
}