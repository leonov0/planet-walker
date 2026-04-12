import { InputHandler } from "./InputHandler.js";
import { Game } from "./Game.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) {
  throw new Error('Canvas with id "gameCanvas" not found');
}

const inputHandler = new InputHandler();
const game = new Game(canvas, inputHandler);

const hudScore = document.getElementById("hudScore");
const hudBest = document.getElementById("hudBest");
const hudTime = document.getElementById("hudTime");

if (!hudScore || !hudBest || !hudTime) {
  throw new Error("HUD elements not found");
}

function formatTimeLeft(seconds) {
  if (seconds <= 0) return "00:00";
  const totalMs = Math.floor(seconds * 100);
  const ss = Math.floor(totalMs / 100);
  const ms = totalMs % 100;
  return `${String(ss).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
}

function updateHud() {
  hudScore.textContent = String(game.points);
  hudBest.textContent = String(game.highScore);
  hudTime.textContent = formatTimeLeft(game.lifespan);
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
updateHud();

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

  game.update(deltaTime);
  game.draw();
  updateHud();
}

requestAnimationFrame(loop);
