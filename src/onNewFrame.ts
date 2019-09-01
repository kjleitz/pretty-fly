const onNewFrame = (c: CanvasRenderingContext2D, draw: () => void): void => {
  requestAnimationFrame(() => onNewFrame(c, draw));
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  draw();
};

export default onNewFrame;
