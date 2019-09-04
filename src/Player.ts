import Mass from "./Mass";
import mouse from "./mouse";
import { between } from "./utilities";

export default class Player extends Mass {
  public width = 15;
  public height = 20;
  public jetpackForceX = 0.4; // (kg * px) / fr^2
  public jetpackForceY = 1.3; // (kg * px) / fr^2

  get burning(): boolean {
    return mouse.pressed;
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
}
