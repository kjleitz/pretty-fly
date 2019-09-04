import universe, { GRAVITY_X, GRAVITY_Y, FRICTION, NORMAL_DRAG } from "./universe";
import { dampen, bound } from "./utilities";

const updateDimension = (
  position: number,
  velocity: number,
  acceleration: number,
  min: number,
  max: number,
): { position: number; velocity: number } => {
  let newPosition = position + velocity;
  let newVelocity = velocity + acceleration;
  if (newPosition > max) {
    newPosition = max;
    newVelocity = 0;
  } else if (newPosition < min) {
    newPosition = min;
    newVelocity = 0;
  }

  return {
    position: newPosition,
    velocity: newVelocity,
  };
};

export default class Mass {
  public mass = 1; // kg
  public x = 0; // px
  public y = 0; // px
  public dx = 0; // px/fr
  public dy = 0; // px/fr
  public width = 25; // px
  public height = 25; // px
  public stationary = false;
  private darkMatter = false;

  constructor(options?: Partial<Mass>) {
    Object.assign(this, options);
    if (!this.darkMatter) universe.masses.push(this);
  }

  get dragCoefficient(): number {
    const surfaceArea = (2 * this.width) + (2 * this.height);
    return (surfaceArea / this.mass) / NORMAL_DRAG;
  }

  get ax(): number { return this.stationary ? 0 : GRAVITY_X; }
  get ay(): number { return this.stationary ? 0 : GRAVITY_Y; }

  get isAgainstTopWall(): boolean { return this.y === 0; }
  get isAgainstBottomWall(): boolean { return this.y === window.innerHeight - this.height; }
  get isAgainstLeftWall(): boolean { return this.x === 0; }
  get isAgainstRightWall(): boolean { return this.x === window.innerWidth - this.width; }

  get terminalVelocity(): number {
    return 20; // TODO: should be based on drag
  }

  get top(): number { return this.y; }
  get right(): number { return this.x + this.width; }
  get bottom(): number { return this.y + this.height; }
  get left(): number { return this.x; }

  update(): void {
    const newXDimension = updateDimension(this.x, this.dx, this.ax, this.width, window.innerWidth - this.width);
    const xFriction = this.isAgainstTopWall || this.isAgainstBottomWall ? FRICTION : 0;
    const dxWithFriction = dampen(newXDimension.velocity, xFriction);

    const newYDimension = updateDimension(this.y, this.dy, this.ay, this.height, window.innerHeight - this.height);
    const yFriction = this.isAgainstLeftWall || this.isAgainstRightWall ? FRICTION : 0;
    const dyWithFriction = dampen(newYDimension.velocity, yFriction);

    this.x = newXDimension.position;
    this.dx = bound(dxWithFriction, -1 * this.terminalVelocity, this.terminalVelocity);
    this.y = newYDimension.position;
    this.dy = bound(dyWithFriction, -1 * this.terminalVelocity, this.terminalVelocity);

    const overlap = universe.overlap(this);
    if (overlap.bottom > 0) {
      this.y -= overlap.bottom;
      this.dy = 0;
    } else if (overlap.top > 0) {
      this.y += overlap.top;
      this.dy = 0;
    }
    if (overlap.right > 0) {
      this.x -= overlap.right;
      this.dx = 0;
    } else if (overlap.left > 0) {
      this.x += overlap.left;
      this.dx = 0;
    }
  }

  isHitting(mass: Mass): boolean {
    const massLeft = mass.x;
    const massRight = mass.x + mass.width;
    const massTop = mass.y;
    const massBottom = mass.y + mass.height;

    const thisLeft = this.x;
    const thisRight = this.x + this.width;
    const thisTop = this.y;
    const thisBottom = this.y + this.height;

    return (
      thisRight >= massLeft
      && thisLeft <= massRight
      && thisBottom >= massTop
      && thisTop <= massBottom
    );
  }
}
