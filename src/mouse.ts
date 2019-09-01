export class Mouse {
  public latest: MouseEvent;

  constructor() {
    this.latest = new MouseEvent('mousemove');
    window.addEventListener('mousemove', (event) => {
      this.latest = event;
    });
    window.addEventListener('mousedown', (event) => {
      this.latest = event;
    });
    window.addEventListener('mouseup', (event) => {
      this.latest = event;
    });
  }
}

const mouse = new Mouse();

export default mouse;
