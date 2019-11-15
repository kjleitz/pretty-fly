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
  public stationary = false; // doesn't move
  public darkMatter = false; // doesn't interact
  public solid = true; // can't pass through it
  public collectOnTouch = false;
  public touchedAt = null as null|number;

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
    const newXData = updateDimension(this.x, this.dx, this.ax, this.width, window.innerWidth - this.width);
    const newYData = updateDimension(this.y, this.dy, this.ay, this.height, window.innerHeight - this.height);

    let newX = newXData.position;
    let newY = newYData.position;
    let newDx = newXData.velocity;
    let newDy = newYData.velocity;

    const overlaps = universe.overlapForMove(this, { x: newX, y: newY });
    const solidOverlap = overlaps.solid;

    if (solidOverlap.right > 0) {
      newX -= solidOverlap.right;
      newDx = 0;
    } else if (solidOverlap.left > 0) {
      newX += solidOverlap.left;
      newDx = 0;
    }

    if (solidOverlap.bottom > 0) {
      newY -= solidOverlap.bottom;
      newDy = 0;
    } else if (solidOverlap.top > 0) {
      newY += solidOverlap.top;
      newDy = 0;
    }

    this.x = newX;
    this.y = newY;

    if (this.isAgainstTopWall || this.isAgainstBottomWall || solidOverlap.top || solidOverlap.bottom) {
      newDx = dampen(newDx, FRICTION);
    }
    if (this.isAgainstLeftWall || this.isAgainstRightWall || solidOverlap.left || solidOverlap.right) {
      newDy = dampen(newDy, FRICTION);
    }

    this.dx = bound(newDx, -1 * this.terminalVelocity, this.terminalVelocity);
    this.dy = bound(newDy, -1 * this.terminalVelocity, this.terminalVelocity);
  }

  isHitting(mass: Mass): boolean {
    return (
      this.right >= mass.left
      && this.left <= mass.right
      && this.bottom >= mass.top
      && this.top <= mass.bottom
    );
  }
}
