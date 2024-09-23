export type NoInvokableEntity =
  | "generic"
  | "backgroundActive"
  | "backgroundInactive"
  | "bullet"
  | "wall"
  | "bubble";
export type InvokableEntity = "sheep" | "wolf" | "player" | "cow" | "rabidWolf";
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
  protected _debugColor: string = "white";
  protected readonly _type: EntityType = "generic";
  protected _angle: number = 0;
  protected _status: availableStatuses = "freeze";
  protected _lives: number = 3;
  protected _attackCountDown = 1000;

  protected _initialLives: number = this._lives;
  protected _regenerationCountDown: number = 1000 * 1;
  private _lastAttack = -1;
  private _lastRegeneration: number = -1;

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this._id = Entity.generateID();
    this._x = x ? x : this._x;
    this._y = y ? y : this._y;
    this._width = width ? width : this._width;
    this._height = height ? height : this._height;
  }

  // source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  private static generateID(): string {
    return "10000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  public static radToDegreeFixed(radian: number): number {
    let degree = (radian * 180) / Math.PI;

    degree = degree % 360;
    if (degree < 0) degree += 360;

    return degree;
  }

  protected static calculateAngleFrom(
    me: Position,
    target: Position,
    inverse: boolean = false
  ): number {
    return (
      Math.atan2(me.y - target.y, me.x - target.x) +
      (inverse ? 1.5708 : -1.5708)
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

  public get status(): availableStatuses {
    return this._status;
  }

  public get height(): number {
    return this._height;
  }

  public get width(): number {
    return this._width;
  }

  public get isAlive(): boolean {
    return this._status !== "dead";
  }

  /**
   * @param _origin variable para uso de subclases de entidad :D
   */
  public hurt(_origin?: Position): void {
    if (this._lives > 0) this._lives--;
    if (this._lives <= 0) this._status = "dead";
  }

  public relocate(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  protected _move(): void {
    if (this._status === "freeze" || this._status === "dead") return;

    this._x = this._x + this._speed * (this._status === "running" ? this._sprintIncrement : 1) * Math.sin(this._angle);
    this._y = this._y + this._speed * (this._status === "running" ? this._sprintIncrement : 1) * Math.cos(this._angle
                       - 2 * ((90 * Math.PI) / 180)); // No recuerdo el porqué de esta parte alch
                                                      // source: https://github.com/GJZ26/HideNSeek/blob/main/src/script/Entities/Player.js#L261
  }

  // Ajustar para usarlo en Bots y Jugador
  // TODO: Que use el método estático calculateAngleFrom
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

    return { distance: shortestDistance, nearestEntity };
  }

  protected _attack(target: Entity) {
    const now = Date.now();
    if (now - this._lastAttack > this._attackCountDown) {
      target.hurt({ x: this.x, y: this.y });
      this._lastAttack = now;
    }
  }

  protected _isColliding(target?: Entity): boolean {
    if (!target) return false;

    const isNotColliding =
      this._x + this._width < target._x || // La entidad 1 está a la izquierda de la entidad 2
      this._x > target._x + target._width || // La entidad 1 está a la derecha de la entidad 2
      this._y + this._height < target._y || // La entidad 1 está arriba de la entidad 2
      this._y > target._y + target._height; // La entidad 1 está abajo de la entidad 2

    return !isNotColliding;
  }

  protected _regenerate(){
    const now = Date.now()
    if(now - this._lastRegeneration > this._regenerationCountDown && this._lives < this._initialLives){
      this._lives++
      this._lastRegeneration = now
    }
  }
}
