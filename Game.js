import { Crater } from "./Crater.js";
import {
  getPlanetCanvasLayout,
  getRandomSpherePosition,
  lerp,
} from "./utlis.js";

const VELOCITY_SMOOTHING = 10;

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
    this.smoothedVelocity = [0, 0];

    this.craters = Array.from({ length: 50 }, () => {
      return new Crater(
        getRandomSpherePosition(),
        0.1 + Math.random() * 0.9,
        0.1 + Math.random() * 0.9,
      );
    });

    this.stars = Array.from({ length: 300 }, () => {
      return new Crater(
        getRandomSpherePosition(),
        0.1 + Math.random() * 0.9,
        0.1 + Math.random() * 0.9,
      );
    });
  }

  update(deltaTime) {
    this.time += deltaTime;
    const targetVelocity = this.inputHandler.getVelocityVector();
    const t = 1 - Math.exp(-VELOCITY_SMOOTHING * deltaTime);
    this.smoothedVelocity[0] = lerp(
      this.smoothedVelocity[0],
      targetVelocity[0],
      t,
    );
    this.smoothedVelocity[1] = lerp(
      this.smoothedVelocity[1],
      targetVelocity[1],
      t,
    );
    this.craters.forEach((object) =>
      object.update(deltaTime, this.smoothedVelocity),
    );
    this.stars.forEach((object) =>
      object.update(deltaTime, this.smoothedVelocity),
    );
  }

  draw() {
    const layout = getPlanetCanvasLayout(this.canvas);
    this._drawStars(layout);
    this._drawPlanet(layout);
    this._drawCraters(layout);
    this._drawPlayer(layout);
  }

  _drawPlanet(layout) {
    const { centerX, centerY, planetRadius: radius } = layout;

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

  _drawStars(layout) {
    const { width, height, centerX, centerY, skyRadius } = layout;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, width, height);

    this.stars.forEach((star) => {
      if (star.position.z > 0) return;

      const positionX = star.position.x * skyRadius;
      const positionY = star.position.y * skyRadius;
      const distFromCenter = Math.hypot(positionX, positionY);
      const starRadius =
        skyRadius * star.size * 0.005 * Math.abs(star.position.z);
      const maxRadius = skyRadius - distFromCenter;
      const radius = Math.min(starRadius, Math.max(0, maxRadius));

      this.ctx.beginPath();
      this.ctx.arc(
        centerX + positionX,
        centerY + positionY,
        radius,
        0,
        2 * Math.PI,
      );

      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.fill();
    });
  }

  _drawPlayer(layout) {
    const { centerX, centerY, planetRadius } = layout;
    const scale = planetRadius * 0.05;

    const torsoWidth = scale * 2;
    const torsoHeight = scale * 0.4;
    const headY = centerY - scale * 1.1;
    const legWidth = scale * 0.4;
    const legHeight = scale * 2.2;
    const footSpread = (22 * Math.PI) / 180;
    const hipY = centerY - scale * 0.3;
    const legOffsetX = scale * 0.42;

    const drawLeg = (hipX, angle) => {
      this.ctx.save();
      this.ctx.translate(hipX, hipY);
      this.ctx.rotate(angle);
      this.ctx.fillRect(-legWidth / 2, 0, legWidth, legHeight);
      this.ctx.restore();
    };

    this.ctx.fillStyle = "cornflowerblue";
    this.ctx.beginPath();
    this.ctx.arc(centerX, headY, scale, 0, 2 * Math.PI);
    this.ctx.rect(
      centerX - torsoWidth / 2,
      centerY - torsoHeight / 2,
      torsoWidth,
      torsoHeight,
    );
    this.ctx.fill();

    drawLeg(centerX - legOffsetX, -footSpread);
    drawLeg(centerX + legOffsetX, footSpread);

    this.ctx.beginPath();
    this.ctx.fillStyle = "lightblue";
    this.ctx.arc(centerX, headY, scale * 0.8, 0, 2 * Math.PI);
    this.ctx.fill();

    const lightX = centerX - scale * 0.2;
    const lightY = headY - scale * 0.2;
    const lightRadius = scale * 0.4;
    const gradient = this.ctx.createRadialGradient(
      lightX,
      lightY,
      0,
      lightX,
      lightY,
      lightRadius,
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "lightblue");
    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(lightX, lightY, lightRadius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
