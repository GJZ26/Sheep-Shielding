import { EntityManager } from "../core/manager/EntityManager";
import { GameManager } from "../core/manager/GameManager";
import { Camera } from "../core/render/Camera";
import RenderEngine from "../core/render/RenderEngine";
import FloatScreen from "../core/ui/FloatScreen";
import GameSetUp from "./.config/GameSetUp";

export default function singleThreadRun(target: HTMLElement) {
  const renderEngine = new RenderEngine(GameSetUp);
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
    gameManager.ready = true;
    FloatScreen.Notification(
      target,
      `Round 1`,
      "A new round has started!",
      1500,
      true
    );
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
        FloatScreen.Notification(
          target,
          `Round ${gameManager.resume.rounds}`,
          "A new round has started!",
          1500,
          true
        );
        
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
