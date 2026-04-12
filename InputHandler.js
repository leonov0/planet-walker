export class InputHandler {
  constructor() {
    this.keys = {};
    this._onKeyDown = (event) => {
      this.keys[event.key] = true;
    };
    this._onKeyUp = (event) => {
      this.keys[event.key] = false;
    };
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }

  getVelocityVector() {
    const input = [0, 0];

    if (this.keys.ArrowLeft || this.keys.a) input[0] -= 1;
    if (this.keys.ArrowRight || this.keys.d) input[0] += 1;
    if (this.keys.ArrowUp || this.keys.w) input[1] -= 1;
    if (this.keys.ArrowDown || this.keys.s) input[1] += 1;

    return input;
  }
}
