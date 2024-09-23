import { EntityManager } from "../core/manager/EntityManager";
import { GameManager } from "../core/manager/GameManager";
import { Camera } from "../core/render/Camera";
import RenderEngine from "../core/render/RenderEngine";
import FloatScreen from "../core/ui/FloatScreen";
import PerformanceMonitor from "../core/utils/PerformanceMonitor";

export default function main(target: HTMLElement) {
  const renderEngine = new RenderEngine({
    appTitle: "Sheep Shielding",
    backgroundColor: "black",
    target: target,
    performance: new PerformanceMonitor({
      fixedTo: 2,
    }),
    debug: false,
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
  const camera = new Camera(
    window.innerWidth - 1,
    window.innerHeight - 1,
    "player"
  );

  const entityManager = new EntityManager();
  const gameManager = new GameManager();

  EntityManager.readMapFromSVG("/map.svg").then((result) => {
    entityManager.loadMap(result);
    entityManager.bulkInvoke(gameManager.invokeCurrentEnemies(true));
    FloatScreen.Notification(target,`Round 1`, "A new round has started!",1500, true)
    requestAnimationFrame(loop);
  });

  renderEngine.loop();
  function loop() {
    const resume = entityManager.step();
    renderEngine.render(camera.capture(entityManager.data), entityManager.size);
    const needUpdate = gameManager.updateMatchStatus(resume);
    if (needUpdate) {
      if (!gameManager.isLost) {
        entityManager.bulkInvoke(gameManager.invokeCurrentEnemies(false));
        FloatScreen.Notification(target,`Round ${gameManager.resume.rounds}`, "A new round has started!",1500, true)
      } else {
        entityManager.clearAllEntities();
        FloatScreen.StatisticsScreen(target, gameManager.resume);
      }
    }
    requestAnimationFrame(loop);
  }

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
}
