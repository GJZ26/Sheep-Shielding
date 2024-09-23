import { RenderEngineSettings } from "../../core/interfaces/RenderEngineInterface";
import PerformanceMonitor from "../../core/utils/PerformanceMonitor";

import playerSprite from '../../assets/entity/player.png'
import sheepSprite from '../../assets/entity/sheep.png'
import wolfSprite from '../../assets/entity/wolf.png'
import cowSprite from '../../assets/entity/cow.png'
import rabidWolfSprite from '../../assets/entity/rabidWolf.png'
import rockSprite from '../../assets/entity/rock.png'

import grassTile from '../../assets/terrain/grass.png'
import wallTile from '../../assets/terrain/rocks.jpg'
import sandTile from '../../assets/terrain/sand.png'
import mapSource from '../../assets/level/map.svg'

export const MapSVG = mapSource

export const GameSetUp: RenderEngineSettings = {
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
      source: playerSprite,
    },
    generic: undefined,
    bubble: undefined,
    sheep: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: sheepSprite,
    },
    wolf: {
      adjustSize: "both",
      flipable: true,
      repeat: false,
      source: wolfSprite,
    },
    bullet: {
      adjustSize: "both",
      flipable: false,
      repeat: false,
      source: rockSprite,
    },
    wall: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: wallTile,
    },
    backgroundActive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: grassTile,
    },
    backgroundInactive: {
      adjustSize: "none",
      flipable: false,
      repeat: true,
      source: sandTile,
    },
    cow: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: cowSprite,
    },
    rabidWolf: {
      adjustSize: "none",
      flipable: true,
      repeat: false,
      source: rabidWolfSprite,
    },
  },
};