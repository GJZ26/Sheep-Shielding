import { GameManager } from "../../core/manager/GameManager";

console.info("⚙️ Game Manager Up");

const gameManager = new GameManager();

self.onmessage = (event) => {
  if (event.data.type === "invoke") {
    self.postMessage({
      type: "round",
      params: [
        gameManager.invokeCurrentEnemies(event.data.params[0]),
        gameManager.round,
      ],
    });
  }

  if (event.data.type === "update") {
    const needUpdate = gameManager.updateMatchStatus(event.data.params[0]);

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

  if (event.data.type === "ready") {
    gameManager.ready = true;
  }
};
