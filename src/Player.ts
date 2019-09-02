import Mass from "./Mass";
import mouse from "./mouse";

export default class Player extends Mass {
  public jetpackForce = 1; // (kg * px) / fr^2

  get jetpackAcceleration(): number { // px/fr^2
    return this.jetpackForce / this.mass;
  }

  get ax(): number {
    if (!this.burning) return super.ax; // only add jetpack if the mouse is being clicked

    const diffX = mouse.latest.x - this.x;
    const magnitudeX = Math.abs(diffX / window.innerWidth) + 1;
    if (diffX < 0) return (-1 * magnitudeX * this.jetpackAcceleration) + super.ax; // mouse is left of player
    if (diffX > 0) return (magnitudeX * this.jetpackAcceleration) + super.ax; // mouse is right of player
    return super.ax; // mouse is in line with player (diffX is zero)
  }

  get ay(): number {
    if (!this.burning) return super.ay; // only add jetpack if the mouse is being clicked

    const diffY = mouse.latest.y - this.y;
    const magnitudeY = Math.abs(diffY / window.innerHeight) + 1;
    if (diffY < 0) return (-1 * magnitudeY * this.jetpackAcceleration) + super.ay; // mouse is above player
    if (diffY > 0) return (magnitudeY * this.jetpackAcceleration) + super.ay; // mouse is below player
    return super.ay; // mouse is in line with player (diffY is zero)
  }

  get burning(): boolean {
    return mouse.latest.buttons === 1;
  }

  get burnerXDirection(): 'left'|'none'|'right' {
    if (!this.burning || this.ax === 0) return 'none';
    return this.ax < 0 ? 'right' : 'left';
  }
  
  get burnerYDirection(): 'down'|'none'|'up' {
    if (!this.burning || this.ay === 0) return 'none';
    return this.ay < 0 ? 'up' : this.ay > 0 ? 'down' : 'none'; // eslint-disable-line no-nested-ternary
  }
}
