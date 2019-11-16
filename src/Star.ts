import { rand, bound } from "./utilities";

export default class Star {
  public x: number;
  public y: number;
  public size: number;
  public brightness: number;
  public vector: readonly [number, number];

  constructor(x: number, y: number, { size, brightness, vector }: Partial<Star> = {}) {
    this.x = x;
    this.y = y;
    this.size = size || rand(1, 5);
    const baseBrightness = (typeof brightness === 'undefined' ? Math.random() : brightness);
    this.brightness = bound(baseBrightness, 0, 1);
    this.vector = vector || [-1, 1];
  }
}
