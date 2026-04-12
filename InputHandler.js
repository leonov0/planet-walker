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
}
