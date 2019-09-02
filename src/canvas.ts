const canvas = document.createElement('canvas');

const stretchCanvas = (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

stretchCanvas();
window.addEventListener('resize', stretchCanvas);
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d')!;
if (!ctx) console.error("Canvas '2d' context is not supported.");

export { ctx };
export default canvas;
