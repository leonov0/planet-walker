export class Game {
  constructor(canvas, inputHandler) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D rendering context is not available");
    }
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;

    this.inputHandler = inputHandler;
    this.time = 0;
  }

  update(deltaTime) {
    this.time += deltaTime;
  }

  draw() {
    this._drawPlanet();
  }

  _drawPlanet() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const radius = Math.min(width, height) * 0.4;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const innerGradient = this.ctx.createRadialGradient(
      centerX - radius * 0.5,
      centerY - radius * 0.5,
      0,
      centerX,
      centerY,
      radius,
    );
    innerGradient.addColorStop(0, "lightgreen");
    innerGradient.addColorStop(1, "green");
    this.ctx.fillStyle = innerGradient;
    this.ctx.fill();
  }
}
