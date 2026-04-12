import { Crater } from "./Crater.js";
import { Crystal } from "./Crystal.js";
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

    this.crystals = Array.from({ length: 3 }, () => {
      return new Crystal(getRandomSpherePosition());
    });
    this.crystalCooldown = 2.5;
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

    const toUpdate = [...this.craters, ...this.stars, ...this.crystals];
    toUpdate.forEach((object) =>
      object.update(deltaTime, this.smoothedVelocity),
    );

    this.crystalCooldown -= deltaTime;
    if (this.crystalCooldown <= 0 && this.crystals.length < 6) {
      this.crystals.push(new Crystal(getRandomSpherePosition()));
      this.crystalCooldown += 2.5;
    }

    this.crystals = this.crystals.filter((crystal) => crystal.lifespan > 0);
  }

  draw() {
    const layout = getPlanetCanvasLayout(this.canvas);
    this._drawStars(layout);
    this._drawPlanet(layout);
    this._drawCraters(layout);
    this._drawPlayer(layout);
    this._drawCrystals(layout);
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

  _drawCrystals(layout) {
    const { centerX, centerY, planetRadius } = layout;

    this.crystals.forEach((crystal) => {
      if (crystal.position.z < 0) return;

      const positionX = crystal.position.x * planetRadius;
      const positionY = crystal.position.y * planetRadius;
      const scale = planetRadius * 0.05 * crystal.position.z;
      const warnPulse =
        crystal.lifespan < crystal.MAX_LIFESPAN * 0.15
          ? 0.15 * (1 + Math.sin(crystal.pulsePhase))
          : 0;
      let opacity =
        warnPulse +
        Math.min(1, Math.max(0, crystal.lifespan / (8 * 0.4))) *
          crystal.position.z *
          0.7;

      this.ctx.beginPath();
      const gradient = this.ctx.createRadialGradient(
        centerX + positionX,
        centerY + positionY,
        0,
        centerX + positionX,
        centerY + positionY,
        scale * 3,
      );
      if (crystal.lifespan / (8 * 0.4) > 1) {
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      }
      this.ctx.beginPath();
      this.ctx.fillStyle = gradient;
      this.ctx.arc(
        centerX + positionX,
        centerY + positionY,
        scale * 3,
        0,
        2 * Math.PI,
      );
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX + positionX, centerY + positionY - 2 * scale);
      this.ctx.lineTo(centerX + positionX + 1 * scale, centerY + positionY);
      this.ctx.lineTo(centerX + positionX, centerY + positionY + 2 * scale);
      this.ctx.lineTo(centerX + positionX - 1 * scale, centerY + positionY);
      this.ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX + positionX, centerY + positionY - 2 * scale);
      this.ctx.lineTo(centerX + positionX + 1 * scale, centerY + positionY);
      this.ctx.lineTo(centerX + positionX, centerY + positionY + 2 * scale);
      this.ctx.lineTo(centerX + positionX - 1 * scale, centerY + positionY);
      this.ctx.lineTo(centerX + positionX, centerY + positionY - 2 * scale);
      this.ctx.closePath();
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }
}
