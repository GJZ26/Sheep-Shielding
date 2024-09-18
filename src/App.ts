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
});

renderEngine.loop();
