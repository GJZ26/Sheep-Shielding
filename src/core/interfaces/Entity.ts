export type NoInvokableEntity = "player" | "generic";
export type InvokableEntity = "sheep" | "wolf" | "bullet";
export type EntityType = NoInvokableEntity | InvokableEntity;
export type KeyEventType = "up" | "down";
export type availableStatuses =
  | "iddle"
  | "freeze"
  | "running"
  | "playing"
  | "dead";

export interface Position {
  x: number;
  y: number;
}

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
  angle: number;
  status: availableStatuses;
  bullets?: EntityData[];
  lives: number;
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
  protected _sprintIncrement: number = 1.4;
  protected _debugColor: string = "yellow";
  protected readonly _type: EntityType = "generic";
  protected _angle: number = 0;
  protected _status: availableStatuses = "freeze";
  protected _lives: number = 3;
  protected _attackCountDown = 1000;
  private _lastAttack = -1;

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

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get center_x(): number {
    return this._x + this._width / 2;
  }

  public get center_y(): number {
    return this._y + this._height / 2;
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
        x: this.center_x,
        y: this.center_y,
      },
      angle: this._angle,
      status: this._status,
      lives: this._lives,
    };
  }

  public get type(): EntityType {
    return this._type;
  }

  protected _move(): void {
    if (this._status === "freeze" || this._status === "dead") return;

    this._y = this._y + this._speed * (this._status === "running" ? this._sprintIncrement : 1) * Math.cos(this._angle 
                    - 2 * ((90 * Math.PI) / 180)); // No recuerdo el porqué de esta parte alch
                                                  // source: https://github.com/GJZ26/HideNSeek/blob/main/src/script/Entities/Player.js#L261

    this._x = this._x + this._speed * (this._status === "running" ? this._sprintIncrement : 1) * Math.sin(this._angle);
  }

  // Ajustar para usarlo en Bots y Jugador
  protected _turn(target: Position, inverse: boolean = true): void {
    this._angle =
      Math.atan2(this._y - target.y, this._x - target.x) +
      (inverse ? 1.5708 : -1.5708);
  }

  protected _positionOfNearestEntity(entities: Entity[]): {
    distance: number;
    nearestEntity: Entity | undefined;
  } {
    let shortestDistance = Number.POSITIVE_INFINITY;
    let nearestEntity = entities.reduce(
      (closest: Entity | undefined, entity) => {
        const distance = Math.sqrt(
          Math.pow(this._x + this._width / 2 - entity.center_x, 2) +
            Math.pow(this._y + this._height / 2 - entity.center_y, 2)
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
        }

        return distance <
          (closest
            ? Math.sqrt(
                Math.pow(this._x + this._width / 2 - closest.center_x, 2) +
                  Math.pow(this._y + this._height / 2 - closest.center_y, 2)
              )
            : Infinity)
          ? entity
          : closest;
      },
      undefined
    );

    if (!nearestEntity)
      return { distance: shortestDistance, nearestEntity: undefined };

    return { distance: shortestDistance, nearestEntity }; // Retorna la distancia más corta
  }

  public hurt(): void {
    this._lives--;
    if (this._lives <= 0) this._status = "dead";
  }

  public get isAlive(): boolean {
    return this._status !== "dead";
  }

  protected attack(target: Entity) {
    const now = Date.now();
    if (now - this._lastAttack > this._attackCountDown) {
      target.hurt();
      this._lastAttack = now
    }
  }
}
