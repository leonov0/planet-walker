import { rotateSpherePoint } from "./utlis.js";

export class Crater {
  constructor(position, brightness, size) {
    this.position = position;
    this.brightness = brightness;
    this.size = size;
  }

  update(deltaTime, rotationVelocity) {
    this.position = rotateSpherePoint(
      this.position,
      rotationVelocity,
      deltaTime,
    );
  }
}
