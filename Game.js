import { Crater } from "./Crater.js";
import { getPlanetCanvasLayout, getRandomSpherePosition } from "./utlis.js";

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

    this.craters = Array.from({ length: 50 }, () => {
      return new Crater(
        getRandomSpherePosition(),
        0.1 + Math.random() * 0.9,
        0.1 + Math.random() * 0.9,
      );
    });
  }

  update(deltaTime) {
    this.time += deltaTime;
    const rotationVelocity = this.inputHandler.getVelocityVector();
    this.craters.forEach((object) =>
      object.update(deltaTime, rotationVelocity),
    );
  }

  draw() {
    const layout = getPlanetCanvasLayout(this.canvas);
    this._drawPlanet(layout);
    this._drawCraters(layout);
  }

  _drawPlanet(layout) {
    const { width, height, centerX, centerY, planetRadius: radius } = layout;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius + 20, 0, 2 * Math.PI);
    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      radius,
      centerX,
      centerY,
      radius + 20,
    );
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.1, "lightgreen");
    gradient.addColorStop(0.2, "black");
    gradient.addColorStop(0.25, "darkblue");
    gradient.addColorStop(1, "black");
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

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

  _drawCraters(layout) {
    const { centerX, centerY, planetRadius } = layout;

    this.craters.forEach((crater) => {
      if (crater.position.z < 0) return;

      const positionX = crater.position.x * planetRadius;
      const positionY = crater.position.y * planetRadius;
      const distFromCenter = Math.hypot(positionX, positionY);
      const craterRadius = planetRadius * crater.size * 0.2 * crater.position.z;
      const maxRadius = planetRadius - distFromCenter;
      const radius = Math.min(craterRadius, Math.max(0, maxRadius));

      this.ctx.beginPath();
      this.ctx.arc(
        centerX + positionX,
        centerY + positionY,
        radius,
        0,
        2 * Math.PI,
      );

      this.ctx.fillStyle = `rgba(0, 100, 0, ${crater.brightness})`;
      this.ctx.fill();
    });
  }
}
