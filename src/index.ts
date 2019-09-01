/* eslint-disable max-classes-per-file */

import mouse from './mouse';
import canvas from './canvas';
import onNewFrame from './onNewFrame';

const c = canvas.getContext('2d')!;

const GRAVITY_X = 0; // px/fr^2
const GRAVITY_Y = 1; // px/fr^2

const updateDimension = (position: number, velocity: number, acceleration: number, min: number, max: number): { position: number; velocity: number } => {
  let newPosition = position + velocity;
  let newVelocity = velocity + acceleration;
  if (newPosition > max) {
    newPosition = max;
    newVelocity = 0;
  } else if (newPosition < min) {
    newPosition = min;
    newVelocity = 0;
  }

  return { position: newPosition, velocity: newVelocity };
};

class Mass {
  public mass = 1; // kg
  public x = 0; // px
  public y = 0; // px
  public dx = 0; // px/fr
  public dy = 0; // px/fr
  public width = 25;
  public height = 25;

  get ax(): number { return GRAVITY_X; }
  get ay(): number { return GRAVITY_Y; }

  update(): void {
    const newXDimension = updateDimension(this.x, this.dx, this.ax, this.width, window.innerWidth - this.width);
    this.x = newXDimension.position;
    this.dx = newXDimension.velocity;

    const newYDimension = updateDimension(this.y, this.dy, this.ay, this.height, window.innerHeight - this.height);
    this.y = newYDimension.position;
    this.dy = newYDimension.velocity;
  }
}

class Player extends Mass {
  public jetpackForce = 1; // (kg * px) / fr^2

  get jetpackAcceleration(): number { // px/fr^2
    return this.jetpackForce / this.mass;
  }

  get ax(): number {
    if (mouse.latest.buttons !== 1) return GRAVITY_X; // only add jetpack if the mouse is being clicked

    const diffX = mouse.latest.x - this.x;
    const magnitudeX = Math.abs(diffX / window.innerWidth) + 1;
    if (diffX < 0) return (-1 * magnitudeX * this.jetpackAcceleration) + GRAVITY_X; // mouse is left of player
    if (diffX > 0) return (magnitudeX * this.jetpackAcceleration) + GRAVITY_X; // mouse is right of player
    return GRAVITY_X; // mouse is in line with player (diffX is zero)
  }

  get ay(): number {
    if (mouse.latest.buttons !== 1) return GRAVITY_Y; // only add jetpack if the mouse is being clicked

    const diffY = mouse.latest.y - this.y;
    const magnitudeY = Math.abs(diffY / window.innerHeight) + 1;
    if (diffY < 0) return (-1 * magnitudeY * this.jetpackAcceleration) + GRAVITY_Y; // mouse is above player
    if (diffY > 0) return (magnitudeY * this.jetpackAcceleration) + GRAVITY_Y; // mouse is below player
    return GRAVITY_Y; // mouse is in line with player (diffY is zero)
  }
}

const player = new Player();

onNewFrame(c, () => {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)';
  c.fillRect(200, 200, 50, 50);
  c.fillRect(275, 125, 50, 50);
  c.fillRect(100, 250, 50, 50);
  c.fillRect(300, 300, 50, 50);
  c.fillRect(150, 300, 50, 50);
  c.fillRect(250, 100, 50, 50);

  // const color = (new Date().getTime() % 4096).toString(16);
  // c.fillStyle = `#${color.padStart(6 - color.length, '0')}${color}`;
  // c.globalAlpha = 0.9;
  // c.fillRect(mouse.latest.x - 25, mouse.latest.y - 25, 50, 50);
  c.fillRect(player.x, player.y, player.width, player.height);
  player.update();
});
