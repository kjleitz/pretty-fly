const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.width = window.innerHeight;

const c = canvas.getContext('2d');
console.log(c);
