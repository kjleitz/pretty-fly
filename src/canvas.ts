const canvas = document.createElement('canvas');

const stretchCanvas = (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

stretchCanvas();
window.addEventListener('resize', stretchCanvas);
document.body.appendChild(canvas);

export default canvas;
