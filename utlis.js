export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function getPlanetCanvasLayout(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const planetRadius = Math.min(width, height) * 0.4;
  const skyRadius = Math.max(width, height);
  return { width, height, centerX, centerY, planetRadius, skyRadius };
}

export function rotateSpherePoint(point, rotationVelocity, deltaTime) {
  if (rotationVelocity[0] === 0 && rotationVelocity[1] === 0) return point;

  const newPoint = { x: point.x, y: point.y, z: point.z };

  if (rotationVelocity[0] !== 0) {
    const angle = -rotationVelocity[0] * deltaTime;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    newPoint.x = point.x * cos + newPoint.z * sin;
    newPoint.z = -point.x * sin + newPoint.z * cos;
  }

  if (rotationVelocity[1] !== 0) {
    const angle = rotationVelocity[1] * deltaTime;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    newPoint.y = point.y * cos - newPoint.z * sin;
    newPoint.z = point.y * sin + newPoint.z * cos;
  }

  const dist = Math.sqrt(
    newPoint.x * newPoint.x + newPoint.y * newPoint.y + newPoint.z * newPoint.z,
  );
  newPoint.x /= dist;
  newPoint.y /= dist;
  newPoint.z /= dist;

  return newPoint;
}

export function getRandomSpherePosition() {
  const z = Math.random() * 2 - 1;
  const phi = Math.random() * 2 * Math.PI;
  const theta = Math.acos(z);
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}
