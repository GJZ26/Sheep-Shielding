import { EntityManager } from "../../core/manager/EntityManager";
import Looper from "./utils/looper";
console.info("⚙️ Entity Manager Worker Up");

const entityManager = new EntityManager();

self.onmessage = (event) => {
  if (event.data.type === "mousemove") {
    entityManager.followCursorPlayer(
      event.data.params[0],
      event.data.params[1]
    );
  }
  if (event.data.type === "key") {
    entityManager.captureKey(event.data.params[0], event.data.params[1]);
  }

  if (event.data.type === "click") {
    entityManager.spawnBullet();
  }

  if (event.data.type === "loadmap") {
    entityManager.loadMap(event.data.params[0]);
  }

  if (event.data.type === "bulkInvoke") {
    entityManager.bulkInvoke(event.data.params[0]);
    self.postMessage({ type: "invoked", params: [] });
  }

  if (event.data.type === "clear") {
    entityManager.clearAllEntities();
  }
};

function tick() {
  const resume = entityManager.step();

  self.postMessage({
    type: "tick",
    params: [entityManager.data, entityManager.size, resume],
  });
}

Looper(tick, 60);
