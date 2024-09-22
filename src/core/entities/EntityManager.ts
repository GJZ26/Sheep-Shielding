import {
  EntityData,
  InvokableEntity,
  KeyEventType,
  Position,
} from "../interfaces/Entity";
import { DisplayInfo } from "../interfaces/RenderEngineInterface";
import { Player } from "./Player";
import { Sheep } from "./Sheep";
import { Wall } from "./Wall";
import { Wolf } from "./Wolf";

interface MapData {
  obstacles: Dimension[];
  spawner: {
    player?: Dimension;
    animals?: Dimension;
    enemies?: Dimension;
  };
}

interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private _sheepList: Sheep[] = [];
  private _wolves: Wolf[] = [];
  private _obstacules: Wall[] = [];
  private _player: Player;

  private _initialAnimalCount = 3;
  private _initialEnemyCount = 3;

  constructor() {
    this._player = new Player();
  }

  public loadMap(source: MapData): boolean {
    if (
      source.obstacles.length <= 0 ||
      !source.spawner.animals ||
      !source.spawner.enemies ||
      !source.spawner.player
    ) {
      console.warn(
        "Apparently your map is not valid.\nPlease check that you have declared an spawn point for animals, enemies and players and at least one obstacle."
      );
      return false;
    }

    source.obstacles.forEach((wall) => {
      this._obstacules.push(new Wall(wall.x, wall.y, wall.width, wall.height));
    });

    this._player.relocate(
      EntityManager.randomIntFromInterval(
        source.spawner.player.x,
        source.spawner.player.x +
          source.spawner.player.width -
          this._player.width
      ),
      EntityManager.randomIntFromInterval(
        source.spawner.player.y,
        source.spawner.player.y +
          source.spawner.player.height -
          this._player.height
      )
    );

    for (let i = 0; i < this._initialAnimalCount; i++) {
      const sheep = new Sheep();
      sheep.relocate(
        EntityManager.randomIntFromInterval(
          source.spawner.animals.x,
          source.spawner.animals.x + source.spawner.animals.width - sheep.width
        ),
        EntityManager.randomIntFromInterval(
          source.spawner.animals.y,
          source.spawner.animals.y +
            source.spawner.animals.height -
            sheep.height
        )
      );
      this._sheepList.push(sheep);
    }

    for (let i = 0; i < this._initialEnemyCount; i++) {
      const wolf = new Wolf();
      wolf.relocate(
        EntityManager.randomIntFromInterval(
          source.spawner.enemies.x,
          source.spawner.enemies.x + source.spawner.enemies.width - wolf.width
        ),
        EntityManager.randomIntFromInterval(
          source.spawner.enemies.y,
          source.spawner.enemies.y + source.spawner.enemies.height - wolf.height
        )
      );
      this._wolves.push(wolf);
    }

    return true;
  }

  protected static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static async readMapFromSVG(source: string): Promise<MapData> {
    const result: MapData = { obstacles: [], spawner: {} };

    if (typeof Document === "undefined") {
      console.warn(
        "Oops! If you are using this method inside a Web Worker, it will not work :( Please run it from the main thread and send the event response to the instantiated class of your Web Worker :D"
      );
      return result;
    }

    try {
      const response = await fetch(source);
      const svgText = await response.text();

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const layers = svgDoc.querySelectorAll("g");

      for (let layer of layers) {
        const label = layer.getAttribute("inkscape:label");

        if (label === "Walls") {
          const walls = layer.querySelectorAll("rect");
          walls.forEach((wall) => {
            let invertOrientation = false;

            if (wall.transform.baseVal.length > 0) {
              let transformationCount = wall.transform.baseVal.length;
              for (let i = 0; i < transformationCount; i++) {
                const transformation = wall.transform.baseVal.getItem(i);
                if (transformation.type === 4) {
                  // Transformación de rotación
                  console.log(transformation.angle);
                  invertOrientation =
                    (transformation.angle > 45 && transformation.angle < 135) ||
                    (transformation.angle < -45 && transformation.angle > -135);
                }
              }
            }

            result.obstacles.push({
              x: wall.x.baseVal.value,
              y: wall.y.baseVal.value,
              width: !invertOrientation
                ? wall.width.baseVal.value
                : wall.height.baseVal.value,
              height: !invertOrientation
                ? wall.height.baseVal.value
                : wall.width.baseVal.value,
            });
          });
        }

        if (label === "Spawner") {
          const spawners = layer.querySelectorAll("rect");
          spawners.forEach((spawn) => {
            const spawnLabel = spawn.getAttribute("inkscape:label");
            if (spawnLabel === "Player") {
              result.spawner.player = {
                x: spawn.x.baseVal.value,
                y: spawn.y.baseVal.value,
                width: spawn.width.baseVal.value,
                height: spawn.height.baseVal.value,
              };
            }
            if (spawnLabel === "Enemies") {
              result.spawner.enemies = {
                x: spawn.x.baseVal.value,
                y: spawn.y.baseVal.value,
                width: spawn.width.baseVal.value,
                height: spawn.height.baseVal.value,
              };
            }
            if (spawnLabel === "Animals") {
              result.spawner.animals = {
                x: spawn.x.baseVal.value,
                y: spawn.y.baseVal.value,
                width: spawn.width.baseVal.value,
                height: spawn.height.baseVal.value,
              };
            }
          });
        }
      }

      return result;
    } catch (error) {
      console.error("Error al cargar el SVG:", error);
      return result;
    }
  }

  public invoke(type: InvokableEntity): string {
    if (type == "sheep") {
      const sheep = new Sheep();
      this._sheepList.push(sheep);
      return sheep.id;
    }

    if (type == "wolf") {
      const wolf = new Wolf();
      this._wolves.push(wolf);
      return wolf.id;
    }

    if (type == "wall") {
      const wall = new Wall();
      this._obstacules.push(wall);
      return wall.id;
    }

    console.warn(
      `It was not possible to invoke an entity of the type ${type}.`
    );
    return "[Entity not created]";
  }

  public get data(): EntityData[] {
    return [
      ...this._obstacules.map((wall) => wall.data),
      ...this._wolves.map((wolf) => wolf.data),
      ...this._sheepList.map((sheep) => sheep.data),
      ...this._player.bullets,
      this._player.data,
    ];
  }

  public get size(): number {
    return (
      this._sheepList.length +
      this._wolves.length +
      (this._player ? 1 + this._player.bulletsInstanced : 0) +
      this._obstacules.length
    );
  }

  public followCursorPlayer(cursor: Position, display: DisplayInfo): void {
    this._player.calculateAngle(cursor, display);
  }

  public captureKey(key: string, type: KeyEventType): void {
    this._player.captureKey(key, type);
  }

  public step() {
    this._player.move([...this._wolves, ...this._obstacules]);

    this._sheepList = this._sheepList.filter((sheep) => {
      sheep.think([this._player]);
      return sheep.isAlive;
    });

    this._wolves = this._wolves.filter((wolf) => {
      wolf.think(this._sheepList);
      return wolf.isAlive;
    });

    this._obstacules.forEach((wall) =>
      wall.checkCollision([...this._wolves, ...this._sheepList, this._player])
    );
  }

  public spawnBullet() {
    this._player.shoot();
  }
}
