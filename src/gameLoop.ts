const gameLoop = (c: CanvasRenderingContext2D, draw: () => void): void => {
  requestAnimationFrame(() => gameLoop(c, draw));
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  draw();
};

export default gameLoop;
