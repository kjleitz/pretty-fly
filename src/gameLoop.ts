let loopCount = 0;

const gameLoop = (c: CanvasRenderingContext2D, draw: (loopCount: number) => void): void => {
  requestAnimationFrame(() => gameLoop(c, draw));
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  draw(loopCount);
  loopCount += 1;
};

export default gameLoop;
