import { EntityManager } from "../../core/manager/EntityManager";
import Looper from "./utils/looper";
console.info("⚙️ Entity Manager Worker Up");

const entityManager = new EntityManager();

self.onmessage = (event) => {
  const { type, params } = event.data;

  if (type === "mousemove") {
    entityManager.followCursorPlayer(params[0], params[1]);
  }

  if (type === "key") {
    entityManager.captureKey(params[0], params[1]);
  }

  if (type === "click") {
    entityManager.spawnBullet();
  }

  if (type === "loadmap") {
    entityManager.loadMap(params[0]);
  }

  if (type === "bulkInvoke") {
    entityManager.bulkInvoke(params[0]);
    self.postMessage({ type: "invoked", params: [] });
  }

  if (type === "clear") {
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
