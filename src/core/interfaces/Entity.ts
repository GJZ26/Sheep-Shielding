export type EntityType = "player" | "generic" | "sheep";
export interface EntityData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: EntityType;
}

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export abstract class Entity {
  protected _id: string = "dump";
  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 10;
  protected _height: number = 10;
  protected _speed: number = 1;
  protected _debugColor: string = "yellow";
  protected readonly _type: EntityType = "generic";

  constructor() {
    this._id = Entity.generateID();
  }

  // source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  public static generateID(): string {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
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
    };
  }

  public get type(): EntityType {
    return this._type;
  }
}
