import { availableStatuses, Entity, EntityType } from "../interfaces/Entity";
import { Wolf } from "./Wolf";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Bullet extends Entity {
  protected _type: EntityType = "bullet";
  protected _width: number = 24;
  protected _height: number = this._width;
  protected _debugColor: string = "#ff00e8";
  protected _status: availableStatuses = "running";
  private readonly _initial_x: number;
  private readonly _initial_y: number;
  private _lifeDistance: number = 400;
  protected _speed: number = 10;

  constructor(x: number, y: number, angle: number) {
    super();
    this._x = x - this._width / 2;
    this._y = y - this._height / 2;

    this._initial_x = this._x;
    this._initial_y = this._y;

    this._angle = angle;
  }

  public move(enemies: Wolf[]) {
    const selfDistance = Math.sqrt(
      Math.pow(this._x + this._width / 2 - this._initial_x, 2) +
        Math.pow(this._y + this._height / 2 - this._initial_y, 2)
    );
    if (selfDistance >= this._lifeDistance) {
      this._status = "dead";
    }
    const { distance, nearestEntity } = this._positionOfNearestEntity(enemies);

    if (distance < 70) {
      this._status = "dead";
      nearestEntity?.hurt();
    }

    this._move();
  }
}
