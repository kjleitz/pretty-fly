import { GRAVITY_X, GRAVITY_Y } from "./universe";

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
  public width = 25;
  public height = 25;

  constructor(options?: Partial<Mass>) {
    Object.assign(this, options);
  }

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
