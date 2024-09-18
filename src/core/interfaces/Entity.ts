export type NoInvokableEntity = "player"  | "generic";
export type InvokableEntity = "sheep"  | "wolf"
export type EntityType = NoInvokableEntity | InvokableEntity
export type KeyEventType = "up" | "down";

export interface EntityData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: EntityType;
  canonical_position: {
    x: number;
    y: number;
  };
  angle:number
}
/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export abstract class Entity {
  protected _id: string = "dump";
  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 80;
  protected _height: number = 80;
  protected _speed: number = 5;
  protected _debugColor: string = "yellow";
  protected readonly _type: EntityType = "generic";
  protected _angle: number = 0;
  protected _isMoving = false;

  constructor() {
    this._id = Entity.generateID();
  }

  // source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  public static generateID(): string {
    return "10000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  public get id(): string {
    return this._id;
  }

  public get data(): EntityData {
    return {
      id: this._id,
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      color: this._debugColor,
      type: this._type,
      canonical_position: {
        x: this._x + this._width / 2,
        y: this._y + this._height / 2,
      },
      angle: this._angle
    };
  }

  public get type(): EntityType {
    return this._type;
  }

  protected _move(): void {
    if (!this._isMoving) return;
    this._y =
      this._y +
      this._speed * Math.cos(this._angle - 2 * ((90 * Math.PI) / 180)); // No recuerdo el porqué de esta parte alch
    // source: https://github.com/GJZ26/HideNSeek/blob/main/src/script/Entities/Player.js#L261
    this._x = this._x + this._speed * Math.sin(this._angle);
  }
}
