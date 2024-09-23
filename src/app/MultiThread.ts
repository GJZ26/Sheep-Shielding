import { EntityManager } from "../core/manager/EntityManager";
import RenderEngine from "../core/render/RenderEngine";
import FloatScreen from "../core/ui/FloatScreen";
import GameSetUp from "./.config/GameSetUp";

export default function multiThreadRun(target: HTMLElement) {
  const renderEngine = new RenderEngine(GameSetUp);
  renderEngine.loop();

  const workers = {
    camera: new Worker(new URL("./.worker/CameraWorker.ts", import.meta.url), { type: "module", name: "Camera" }),
    entityManager: new Worker(new URL("./.worker/EntityManagerWorker.ts", import.meta.url), { type: "module", name: "Entity Manager" }),
    gameManager: new Worker(new URL("./.worker/GameManagerWorker.ts", import.meta.url), { type: "module", name: "Game Manager" })
  };

  const initializeCameraWorker = () => {
    const dimensions = { width: window.innerWidth - 1, height: window.innerHeight - 1 };
    workers.camera.postMessage({ type: "resize", dimension: dimensions });
  };
  
  initializeCameraWorker();

  EntityManager.readMapFromSVG("/map.svg").then((map) => {
    workers.entityManager.postMessage({ type: "loadmap", params: [map] });
    workers.gameManager.postMessage({ type: "invoke", params: [true] });
  });

  workers.gameManager.onmessage = (event) => {
    const { type, params } = event.data;

    if (type === "round") {
      FloatScreen.Notification(target, `Round ${params[1]}`, "A new round has started!", 1500, true);
      workers.entityManager.postMessage({ type: "bulkInvoke", params: [params[0]] });
    }

    if (type === "lost") {
      workers.entityManager.postMessage({ type: "clear", params: [] });
      FloatScreen.StatisticsScreen(target, params[0]);
    }
  };

  workers.entityManager.onmessage = (event) => {
    const { type, params } = event.data;

    if (type === "tick") {
      workers.camera.postMessage({ type: "renderFrame", params: [params[0], params[1]] });
      workers.gameManager.postMessage({ type: "update", params: [params[2]] });
    }

    if (type === "invoked") {
      workers.gameManager.postMessage({ type: "ready", params: [] });
    }
  };

  workers.camera.onmessage = (event) => {
    if (event.data.type === "render") {
      renderEngine.render(event.data.params[0], event.data.params[1]);
    }
  };

  
  const onResize = () => {
    const dimensions = { width: window.innerWidth - 1, height: window.innerHeight - 1 };
    renderEngine.resize(dimensions.width, dimensions.height);
    workers.camera.postMessage({ type: "resize", dimension: dimensions });
  };

  const onMouseMove = (e: MouseEvent) => {
    workers.entityManager.postMessage({
      type: "mousemove",
      params: [
        { x: e.clientX, y: e.clientY },
        { height: window.innerHeight, width: window.innerWidth, x: 0, y: 0 }
      ]
    });
  };

  const onKeyChange = (e: KeyboardEvent, state: string) => {
    workers.entityManager.postMessage({ type: "key", params: [e.code, state] });
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("keydown", (e) => onKeyChange(e, "down"));
  window.addEventListener("keyup", (e) => onKeyChange(e, "up"));
  window.addEventListener("click", () => workers.entityManager.postMessage({ type: "click", params: undefined }));
}