import { EntityData, KeyEventType, Position } from "../entities/generic/Entity";
import { DisplayInfo } from "../interfaces/RenderEngineInterface";
import { Player } from "../entities/Player";
import { Sheep } from "../entities/Sheep";
import { Wall } from "../entities/Wall";
import { Wolf } from "../entities/Wolf";
import { InvokeEntityData } from "./GameManager";

interface MapData {
  backgroundActive: Dimension[];
  backgroundInactive: Dimension[];
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

export interface EntityStatusResume {
  animalsAlive: number;
  enemiesAlive: number;
  isPlayerAlive: boolean;
}

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private _sheepList: Sheep[] = [];
  private _wolves: Wolf[] = [];
  private _obstacules: Wall[] = [];
  private _player: Player;

  private _activeBackground: EntityData[] = [];
  private _inactiveBackground: EntityData[] = [];

  private _playerSpawner: Dimension = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  private _enemySpawner: Dimension = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  private _animalSpawner: Dimension = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

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

    for (let backs of source.backgroundActive) {
      this._activeBackground.push({
        id: "",
        x: backs.x,
        y: backs.y,
        width: backs.width,
        height: backs.height,
        color: "purple",
        type: "backgroundActive",
        canonical_position: {
          x: backs.x + backs.width / 2,
          y: backs.y + backs.height / 2,
        },
        angle: 0,
        status: "freeze",
        bullets: undefined,
        lives: 0,
      });
    }

    for (let backs of source.backgroundInactive) {
      this._inactiveBackground.push({
        id: "",
        x: backs.x,
        y: backs.y,
        width: backs.width,
        height: backs.height,
        color: "purple",
        type: "backgroundInactive",
        canonical_position: {
          x: backs.x + backs.width / 2,
          y: backs.y + backs.height / 2,
        },
        angle: 0,
        status: "freeze",
        bullets: undefined,
        lives: 0,
      });
    }

    source.obstacles.forEach((wall) => {
      this._obstacules.push(new Wall(wall.x, wall.y, wall.width, wall.height));
    });

    this._playerSpawner = {
      x: source.spawner.player.x,
      y: source.spawner.player.y,
      width: source.spawner.player.width,
      height: source.spawner.player.height,
    };

    this._animalSpawner = {
      x: source.spawner.animals.x,
      y: source.spawner.animals.y,
      width: source.spawner.animals.width,
      height: source.spawner.animals.height,
    };

    this._enemySpawner = {
      x: source.spawner.enemies.x,
      y: source.spawner.enemies.y,
      width: source.spawner.enemies.width,
      height: source.spawner.enemies.height,
    };

    this._player.relocate(
      EntityManager.randomIntFromInterval(
        this._playerSpawner.x,
        this._playerSpawner.x + this._playerSpawner.width - this._player.width
      ),
      EntityManager.randomIntFromInterval(
        this._playerSpawner.y,
        this._playerSpawner.y + this._playerSpawner.height - this._player.height
      )
    );

    return true;
  }

  protected static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static async readMapFromSVG(source: string): Promise<MapData> {
    const result: MapData = {
      obstacles: [],
      spawner: {},
      backgroundActive: [],
      backgroundInactive: [],
    };

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

        if (label === "Background") {
          const back = layer.querySelectorAll("rect");
          back.forEach((rec) => {
            if (rec.getAttribute("inkscape:label") === "Active") {
              result.backgroundActive.push({
                x: rec.x.baseVal.value,
                y: rec.y.baseVal.value,
                width: rec.width.baseVal.value,
                height: rec.height.baseVal.value,
              });
            } else if (rec.getAttribute("inkscape:label") === "Inactive") {
              result.backgroundInactive.push({
                x: rec.x.baseVal.value,
                y: rec.y.baseVal.value,
                width: rec.width.baseVal.value,
                height: rec.height.baseVal.value,
              });
            }
          });
        }

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

  public bulkInvoke(data: InvokeEntityData[]): boolean {
    let result = true;
    for (let i = 0; i < data.length; i++) {
      let success = this._invoke(data[i]);
      result = result && success;
    }
    return result;
  }

  public clearAllEntities(): void {
    this._sheepList = [];
    this._wolves = [];
  }

  private _invoke(data: InvokeEntityData): boolean {
    if (data.amount <= 0) {
      return false;
    }
    if (data.type == "sheep") {
      if (data.clearQueue) {
        this._sheepList = [];
      }
      for (let i = 0; i < data.amount; i++) {
        const sheep = new Sheep();
        sheep.relocate(
          EntityManager.randomIntFromInterval(
            this._animalSpawner.x,
            this._animalSpawner.x + this._animalSpawner.width - sheep.width
          ),
          EntityManager.randomIntFromInterval(
            this._animalSpawner.y,
            this._animalSpawner.y + this._animalSpawner.height - sheep.height
          )
        );
        this._sheepList.push(sheep);
      }
      return true;
    }

    if (data.type == "wolf") {
      if (data.clearQueue) {
        this._wolves = [];
      }
      for (let i = 0; i < data.amount; i++) {
        const wolf = new Wolf();
        wolf.relocate(
          EntityManager.randomIntFromInterval(
            this._enemySpawner.x,
            this._enemySpawner.x + this._enemySpawner.width - wolf.width
          ),
          EntityManager.randomIntFromInterval(
            this._enemySpawner.y,
            this._enemySpawner.y + this._enemySpawner.height - wolf.height
          )
        );
        this._wolves.push(wolf);
      }
      return true;
    }

    console.warn(
      `It was not possible to invoke an entity of the type ${data.type}.`
    );
    return false;
  }

  public get data(): EntityData[] {
    return [
      ...this._inactiveBackground,
      ...this._activeBackground,
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

  public step(): EntityStatusResume {
    if (!this._player.isAlive) {
      this._player.revive(
        EntityManager.randomIntFromInterval(
          this._playerSpawner.x,
          this._playerSpawner.x + this._playerSpawner.width - this._player.width
        ),
        EntityManager.randomIntFromInterval(
          this._playerSpawner.y,
          this._playerSpawner.y +
            this._playerSpawner.height -
            this._player.height
        )
      );
    }
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

    return {
      animalsAlive: this._sheepList.length,
      enemiesAlive: this._wolves.length,
      isPlayerAlive: this._player.isAlive,
    };
  }

  public spawnBullet() {
    this._player.shoot();
  }
}
