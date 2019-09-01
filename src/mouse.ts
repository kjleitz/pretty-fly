export class Mouse {
  public latest: MouseEvent;

  constructor() {
    this.latest = new MouseEvent('mousemove');
    window.addEventListener('mousemove', (event) => {
      this.latest = event;
    });
  }
}

const mouse = new Mouse();

export default mouse;
