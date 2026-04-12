import { rotateSpherePoint } from "./utlis.js";

export class Crystal {
  MAX_LIFESPAN = 8;

  constructor(position) {
    this.position = position;
    this.lifespan = this.MAX_LIFESPAN;
    this.pulsePhase = 0;
  }

  update(deltaTime, rotationVelocity) {
    this.position = rotateSpherePoint(
      this.position,
      rotationVelocity,
      deltaTime,
    );

    this.lifespan -= deltaTime;

    if (this.lifespan < this.MAX_LIFESPAN * 0.15) {
      this.pulsePhase += deltaTime * 10;
    }
  }
}
