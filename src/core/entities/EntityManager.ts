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

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private _sheepList: Sheep[] = [];
  private _wolves: Wolf[] = [];
  private _obstacules: Wall[] = [];
  private _player: Player;

  constructor() {
    this._player = new Player();
    this._obstacules.push(new Wall(500,250, 100, 100))
    this._obstacules.push(new Wall(500,400,50,100))
    this._obstacules.push(new Wall(500,500, 200))
    this._obstacules.push(new Wall(790,400))
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
      wall.checkCollision([
        ...this._wolves, 
        ...this._sheepList, 
        this._player
      ])
    );
  }

  public spawnBullet() {
    this._player.shoot();
  }
}
