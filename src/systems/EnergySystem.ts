import { GameConfig } from '../config/GameConfig';

export class EnergySystem {
  private energy: number;
  private maxEnergy: number;

  constructor(initialEnergy: number = GameConfig.ENERGY.MAX) {
    this.maxEnergy = GameConfig.ENERGY.MAX;
    this.energy = Math.min(initialEnergy, this.maxEnergy);
  }

  /**
   * 获取当前能量
   */
  getEnergy(): number {
    return this.energy;
  }

  /**
   * 使用能量
   */
  useEnergy(amount: number): boolean {
    if (this.energy >= amount) {
      this.energy -= amount;
      return true;
    }
    return false;
  }

  /**
   * 增加能量
   */
  addEnergy(amount: number): void {
    this.energy = Math.min(this.energy + amount, this.maxEnergy);
  }

  /**
   * 变色消耗能量
   */
  changeColor(): boolean {
    return this.useEnergy(GameConfig.ENERGY.CHANGE_COLOR_COST);
  }

  /**
   * 捕食昆虫获得能量
   */
  eatInsect(): void {
    this.addEnergy(GameConfig.ENERGY.INSECT_BONUS);
  }

  /**
   * 能量是否充足
   */
  hasEnoughEnergy(amount: number): boolean {
    return this.energy >= amount;
  }

  /**
   * 获取能量百分比
   */
  getEnergyPercent(): number {
    return (this.energy / this.maxEnergy) * 100;
  }
}