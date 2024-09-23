import { EntityManager } from "../core/manager/EntityManager";
import RenderEngine from "../core/render/RenderEngine";
import FloatScreen from "../core/ui/FloatScreen";
import GameSetUp from "./.config/GameSetUp";

export default function multiThreadRun(target: HTMLElement) {
  const renderEngine = new RenderEngine(GameSetUp);
  renderEngine.loop();

  // Worker initializer

  const cameraWorker = new Worker(
    new URL("./.worker/CameraWorker.ts", import.meta.url),
    { type: "module", name: "Camera" }
  );

  const entityManagerWorker = new Worker(
    new URL("./.worker/EntityManagerWorker.ts", import.meta.url),
    { type: "module", name: "Entity Manager" }
  );
  const gameManagerWorker = new Worker(
    new URL("./.worker/GameManagerWorker.ts", import.meta.url),
    { type: "module", name: "Game Manager" }
  );

  // Worker Initial Listener

  cameraWorker.postMessage({
    type: "resize",
    dimension: { width: window.innerWidth - 1, height: window.innerHeight - 1 },
  });

  // More ?

  EntityManager.readMapFromSVG("/map.svg").then((result) => {
    entityManagerWorker.postMessage({ type: "loadmap", params: [result] });
    gameManagerWorker.postMessage({ type: "invoke", params: [true] });
  });

  gameManagerWorker.onmessage = (event) => {
    if (event.data.type === "round") {
      FloatScreen.Notification(
        target,
        `Round ${event.data.params[1]}`,
        "A new round has started!",
        1500,
        true
      );
      entityManagerWorker.postMessage({
        type: "bulkInvoke",
        params: [event.data.params[0]],
      });
    }
    if (event.data.type === "lost") {
      entityManagerWorker.postMessage({ type: "clear", params: [] });
      FloatScreen.StatisticsScreen(target, event.data.params[0]);
    }
  };

  entityManagerWorker.onmessage = (event) => {
    if (event.data.type === "tick") {
      cameraWorker.postMessage({
        type: "renderFrame",
        params: [event.data.params[0], event.data.params[1]],
      });
      gameManagerWorker.postMessage({
        type: "update",
        params: [event.data.params[2]],
      });
    }
    if (event.data.type === "invoked") {
      gameManagerWorker.postMessage({ type: "ready", params: [] });
    }
  };

  cameraWorker.onmessage = (event) => {
    if (event.data.type === "render") {
      renderEngine.render(event.data.params[0], event.data.params[1]);
    }
  };

  // Event Listeners
  window.addEventListener("resize", () => {
    renderEngine.resize(window.innerWidth - 1, window.innerHeight - 1);
    cameraWorker.postMessage({
      type: "resize",
      dimension: {
        width: window.innerWidth - 1,
        height: window.innerHeight - 1,
      },
    });
  });

  window.addEventListener("mousemove", (e) => {
    entityManagerWorker.postMessage({
      type: "mousemove",
      params: [
        {
          x: e.clientX,
          y: e.clientY,
        },
        {
          height: window.innerHeight,
          width: window.innerWidth,
          x: 0,
          y: 0,
        },
      ],
    });
  });

  window.addEventListener("keydown", (e) => {
    entityManagerWorker.postMessage({ type: "key", params: [e.code, "down"] });
  });

  window.addEventListener("keyup", (e) => {
    entityManagerWorker.postMessage({ type: "key", params: [e.code, "up"] });
  });

  window.addEventListener("click", () => {
    entityManagerWorker.postMessage({ type: "click", params: undefined });
  });
}
