import { availableStatuses, Entity, EntityType } from "../interfaces/Entity";

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

  public get isAlive(): boolean {
    return this._status !== "freeze";
  }

  public move() {
    const distance = Math.sqrt(
      Math.pow(this._x + this._width / 2 - this._initial_x, 2) +
        Math.pow(this._y + this._height / 2 - this._initial_y, 2)
    );
    if (distance >= this._lifeDistance) {
      this._status = "freeze";
    }
    this._move();
  }
}
