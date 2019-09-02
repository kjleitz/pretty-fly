import Mass from "./Mass";
import mouse from "./mouse";

export default class Player extends Mass {
  public jetpackForceX = 0.4; // (kg * px) / fr^2
  public jetpackForceY = 1.2; // (kg * px) / fr^2

  get burning(): boolean {
    return mouse.latest.buttons === 1;
  }

  get jetpackAccelerationX(): number {
    if (!this.burning) return 0;

    const mouseDistance = mouse.latest.x - this.x;
    if (mouseDistance === 0) return 0;

    const jetpackAcceleration = this.jetpackForceX / this.mass;
    return mouseDistance > 0 ? jetpackAcceleration : -1 * jetpackAcceleration;
  }

  get jetpackAccelerationY(): number {
    if (!this.burning) return 0;

    const mouseDistance = mouse.latest.y - this.y;
    if (mouseDistance >= 0) return 0;

    const jetpackAcceleration = this.jetpackForceY / this.mass;
    return -1 * jetpackAcceleration;
  }

  get ax(): number {
    return super.ax + this.jetpackAccelerationX;
  }

  get ay(): number {
    return super.ay + this.jetpackAccelerationY;
  }

  get burnerXSide(): 'left'|'none'|'right' {
    if (this.jetpackAccelerationX === 0) return 'none';
    return this.jetpackAccelerationX > 0 ? 'left' : 'right';
  }
  
  get burnerYSide(): 'bottom'|'none'|'top' {
    if (this.jetpackAccelerationY === 0) return 'none';
    return this.jetpackAccelerationY > 0 ? 'top' : 'bottom';
  }
}
