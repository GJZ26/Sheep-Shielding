import { GameManager } from "../../core/manager/GameManager";

console.info("⚙️ Game Manager Up");

const gameManager = new GameManager();

self.onmessage = (event) => {
  const { type, params } = event.data;

  if (type === "invoke") {
    self.postMessage({
      type: "round",
      params: [gameManager.invokeCurrentEnemies(params[0]), gameManager.round],
    });
  }

  if (type === "update") {
    const needUpdate = gameManager.updateMatchStatus(params[0]);

    if (needUpdate) {
      if (!gameManager.isLost) {
        self.postMessage({
          type: "round",
          params: [gameManager.invokeCurrentEnemies(false), gameManager.round],
        });
      } else {
        self.postMessage({ type: "lost", params: [gameManager.resume] });
      }
    }
  }

  if (type === "ready") {
    gameManager.ready = true;
  }
  
};
