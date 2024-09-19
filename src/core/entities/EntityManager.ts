import {
  EntityData,
  InvokableEntity,
  KeyEventType,
  Position,
} from "../interfaces/Entity";
import { DisplayInfo } from "../interfaces/RenderEngine";
import { Player } from "./Player";
import { Sheep } from "./Sheep";
import { Wolf } from "./Wolf";

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private _sheepList: Sheep[] = [];
  private _wolves: Wolf[] = [];
  private _player: Player;

  constructor() {
    this._player = new Player();
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

    console.warn(
      `It was not possible to invoke an entity of the type ${type}.`
    );
    return "[Entity not created]";
  }

  public get data(): EntityData[] {
    return [
      ...this._wolves.map((wolf) => wolf.data),
      ...this._sheepList.map((sheep) => sheep.data),
      ...this._player.bullets,
      this._player.data,
    ];
  }

  public get size(): number {
    return (
      this._sheepList.length + this._wolves.length + (this._player ? 1 + this._player.bulletsInstanced : 0)
    );
  }

  public followCursorPlayer(cursor: Position, display: DisplayInfo): void {
    this._player.calculateAngle(cursor, display);
  }

  public captureKey(key: string, type: KeyEventType): void {
    this._player.captureKey(key, type);
  }

  public step() {
    this._player.move(this._wolves);

    this._sheepList = this._sheepList.filter((sheep) => {
      sheep.think([this._player]);
      return sheep.isAlive;
    });

    this._wolves = this._wolves.filter((wolf) => {
      wolf.think(this._sheepList);
      return wolf.isAlive;
    });
  }

  public spawnBullet() {
    this._player.shoot();
  }
}
