export class Game {
  constructor(canvas, inputHandler) {
    this.canvas = canvas;
    this.inputHandler = inputHandler;
    this.time = 0;
  }

  update(deltaTime) {
    this.time += deltaTime;
  }
}
