import { EntityManager } from "./core/entities/EntityManager";
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

const entityManager = new EntityManager();

console.log(entityManager.invoke("player"));
console.log(entityManager.invoke("sheep"));
console.log(entityManager.data);

renderEngine.loop();
