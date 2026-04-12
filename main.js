const canvas = document.getElementById("gameCanvas");
if (!canvas) {
  throw new Error('Canvas with id "gameCanvas" not found');
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("2D rendering context is not available");
}

/**
 * Resize window
 */

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

resize();

/**
 * Game loop
 */

const MIN_FRAME_MS = 1000 / 120; // 120 FPS

let lastTime = performance.now();

function loop(now) {
  requestAnimationFrame(loop);

  if (now - lastTime < MIN_FRAME_MS) return;

  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;
}

requestAnimationFrame(loop);
