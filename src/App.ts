import { EntityManager } from "./core/entities/EntityManager";
import { Camera } from "./core/render/Camera";
import RenderEngine from "./core/render/RenderEngine";
import PerformanceMonitor from "./core/utils/PerformanceMonitor";

const renderEngine = new RenderEngine({
  appTitle: "Sheep Shielding",
  backgroundColor: "black",
  target: document.body,
  performance: new PerformanceMonitor({
    fixedTo: 2,
  }),
  debug: true,
});

const entityManager = new EntityManager();
const camera = new Camera(
  window.innerWidth - 1,
  window.innerHeight - 1,
  "player"
);

// console.log(entityManager.invoke("wall"));
console.log(entityManager.invoke("sheep"));
console.log(entityManager.invoke("sheep"));
console.log(entityManager.invoke("sheep"));
console.log(entityManager.invoke("wolf"));
console.log(entityManager.invoke("wolf"));

console.log(entityManager.data);

renderEngine.loop();

function loop() {
  entityManager.step();
  renderEngine.render(camera.capture(entityManager.data), entityManager.size);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

window.addEventListener("resize", () => {
  renderEngine.resize(window.innerWidth - 1, window.innerHeight - 1);
  camera.resize(window.innerWidth - 1, window.innerHeight - 1);
});

window.addEventListener("mousemove", (e) => {
  // console.log(
  entityManager.followCursorPlayer(
    {
      x: e.clientX,
      y: e.clientY,
    },
    {
      height: window.innerHeight,
      width: window.innerWidth,
      x: 0,
      y: 0,
    }
  );
  // );
});

window.addEventListener("keydown", (e) => {
  entityManager.captureKey(e.code, "down");
});

window.addEventListener("keyup", (e) => {
  entityManager.captureKey(e.code, "up");
});

window.addEventListener("click", () => {
  entityManager.spawnBullet();
});
