import Mass from "./Mass";
import mouse from "./mouse";
import { between, bound } from "./utilities";

export default class Player extends Mass {
  public width = 15;
  public height = 20;
  public jetpackForceX = 0.4; // (kg * px) / fr^2
  public jetpackForceY = 1.3; // (kg * px) / fr^2
  public MAX_FUEL = 100;
  public MIN_FUEL = 0;
  public MAX_FUEL_RECHARGE = 25;
  public fuelRechargeRate = 0.1;
  public fuelRechargeDelay = 200;
  public lastBurn = null as null|Date;
  private _fuel = 100;

  get burning(): boolean {
    return this.fuel > 0 && mouse.pressed;
  }

  get axJetpack(): number {
    if (!this.burning) return 0;

    const mouseDistance = mouse.x - this.x;
    const leftMargin = -1 * this.width;
    const rightMargin = 2 * this.width;
    if (between(mouseDistance, leftMargin, rightMargin)) return 0;

    const jetpackAcceleration = this.jetpackForceX / this.mass;
    return mouseDistance > 0 ? jetpackAcceleration : -1 * jetpackAcceleration;
  }

  get ayJetpack(): number {
    if (!this.burning) return 0;

    const mouseDistance = mouse.y - this.y;
    const topMargin = 0;
    const bottomMargin = this.height;
    if (mouseDistance >= 0 || between(mouseDistance, topMargin, bottomMargin)) return 0;

    const jetpackAcceleration = this.jetpackForceY / this.mass;
    return -1 * jetpackAcceleration;
  }

  get ax(): number {
    return super.ax + this.axJetpack;
  }

  get ay(): number {
    return super.ay + this.ayJetpack;
  }

  get burnerXSide(): 'left'|'none'|'right' {
    if (this.axJetpack === 0) return 'none';
    return this.axJetpack > 0 ? 'left' : 'right';
  }

  get burnerYSide(): 'bottom'|'none'|'top' {
    if (this.ayJetpack === 0) return 'none';
    return this.ayJetpack > 0 ? 'top' : 'bottom';
  }

  set fuel(fuel: number) {
    this._fuel = bound(fuel, this.MIN_FUEL, this.MAX_FUEL);
  }

  get fuel(): number {
    return this._fuel;
  }

  update(): void {
    super.update();
    if (this.burning) {
      this.fuel -= 0.5;
      this.lastBurn = new Date();
    } else if (
      this.fuel < this.MAX_FUEL_RECHARGE
      && this.lastBurn
      && new Date().getTime() - this.lastBurn.getTime() > this.fuelRechargeDelay
    ) {
      this.fuel = bound(this.fuel + this.fuelRechargeRate, this.MIN_FUEL, this.MAX_FUEL);
    }
  }
}
