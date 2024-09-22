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
  frames: {
    player: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: "/player.png",
    },
    generic: undefined,
    bubble: undefined,
    sheep: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: "/sheep.png",
    },
    wolf: {
      adjustSize: "both",
      flipable: true,
      repeat: false,
      source: "/wolf.png",
    },
    bullet: {
      adjustSize: "both",
      flipable: false,
      repeat: false,
      source: "/rock.png",
    },
    wall: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/rocks.jpg",
    },
    backgroundActive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/grass.png",
    },
    backgroundInactive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/sand.png",
    },
  },
});

const entityManager = new EntityManager();
const camera = new Camera(
  window.innerWidth - 1,
  window.innerHeight - 1,
  "player"
);

EntityManager.readMapFromSVG("/map.svg").then((result) => {
  entityManager.loadMap(result);
});

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
