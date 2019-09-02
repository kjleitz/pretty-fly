export class Mouse {
  public x = 0;
  public y = 0;
  public pressed = false;

  constructor() {
    window.addEventListener('mousedown', (event) => {
      this.populateFromMouseEvent(event);
    });
    window.addEventListener('mousemove', (event) => {
      this.populateFromMouseEvent(event);
    });
    window.addEventListener('mouseup', (event) => {
      this.populateFromMouseEvent(event);
    });

    window.addEventListener('touchstart', (event) => {
      this.populateFromTouchEvent(event);
    });
    window.addEventListener('touchmove', (event) => {
      this.populateFromTouchEvent(event);
    });
    window.addEventListener('touchend', (event) => {
      this.populateFromTouchEvent(event);
    });
  }

  populateFromMouseEvent(event: MouseEvent): void {
    this.x = event.x;
    this.y = event.y;
    this.pressed = event.buttons === 1;
  }

  populateFromTouchEvent(event: TouchEvent): void {
    const { touches } = event;
    if (touches.length === 0) {
      this.pressed = false;
    } else {
      const touch = touches[0];
      this.x = touch.clientX;
      this.y = touch.clientY;
      this.pressed = true;
    }
  }
}

const mouse = new Mouse();

export default mouse;
