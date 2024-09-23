import { Camera } from "../../core/render/Camera";
console.info("⚙️ Camera Worker Up");

const camera = new Camera(0, 0, "player");

self.onmessage = (event) => {
  if (event.data.type === "resize") {
    const { width, height } = event.data.dimension;
    camera.resize(width, height);
  }
  if (event.data.type === "renderFrame") {
    self.postMessage({
      type: "render",
      params: [camera.capture(event.data.params[0]), event.data.params[1]],
    });
  }
};
