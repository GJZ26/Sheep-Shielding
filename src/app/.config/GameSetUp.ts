import { RenderEngineSettings } from "../../core/interfaces/RenderEngineInterface";
import PerformanceMonitor from "../../core/utils/PerformanceMonitor";

const GameSetUp: RenderEngineSettings = {
  appTitle: "Sheep Shielding",
  backgroundColor: "black",
  target: document.getElementById("game")!,
  performance: new PerformanceMonitor({
    fixedTo: 2,
  }),
  debug: false,
  frames: {
    player: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: "/player.png",
    },
    generic: undefined,
    bubble: undefined,
    sheep: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: "/sheep.png",
    },
    wolf: {
      adjustSize: "both",
      flipable: true,
      repeat: false,
      source: "/wolf.png",
    },
    bullet: {
      adjustSize: "both",
      flipable: false,
      repeat: false,
      source: "/rock.png",
    },
    wall: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/rocks.jpg",
    },
    backgroundActive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/grass.png",
    },
    backgroundInactive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: "/sand.png",
    },
  },
};

export default GameSetUp