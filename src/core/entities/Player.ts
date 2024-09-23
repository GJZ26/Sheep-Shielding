import {
  availableStatuses,
  Entity,
  EntityData,
  EntityType,
  KeyEventType,
  Position,
} from "./generic/Entity";
import { DisplayInfo } from "../interfaces/RenderEngineInterface";
import { Bullet } from "./Bullet";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Player extends Entity {
  protected _debugColor: string = "#49ff00";
  protected readonly _type: EntityType = "player";
  protected _x: number = 700;
  protected _y: number = 200;
  protected _speed: number = 6;
  protected _sprintIncrement: number = 1.6;
  protected _status: availableStatuses = "freeze";
  private _maxBullet: number = 10;
  private _bulletsIvoked: Bullet[] = [];
  private _lastStatus: availableStatuses = this._status;

  private readonly _initialLives = 3;

  constructor() {
    super();
    this._lives = this._initialLives;
  }

  public revive(x: number, y: number) {
    this._status = this._lastStatus;
    this._lives = this._initialLives;
    this._x = x;
    this._y = y;
  }

  public captureKey(key: string, type: KeyEventType) {
    if (type == "down" && key == "KeyW") {
      this._lastStatus = "playing";
    }

    if (type == "up" && key == "KeyW") {
      this._lastStatus = "freeze";
    }

    if (
      key === "ShiftLeft" &&
      type == "down" &&
      this._lastStatus === "playing"
    ) {
      this._lastStatus = "running";
    }

    if (key === "ShiftLeft" && type == "up" && this._lastStatus === "running") {
      this._lastStatus = "playing";
    }

    if (!this.isAlive) {
      return;
    }

    if (type == "down" && key == "KeyW") {
      this._status = "playing";
    }

    if (type == "up" && key == "KeyW") {
      this._status = "freeze";
    }

    if (key === "ShiftLeft" && type == "down" && this._status === "playing") {
      this._status = "running";
    }

    if (key === "ShiftLeft" && type == "up" && this._status === "running") {
      this._status = "playing";
    }
  }

  // Ajustar para usar _turn
  public calculateAngle(target: Position, display: DisplayInfo): void {
    this._angle =
      Math.atan2(
        target.y - (display.y + display.height / 2),
        target.x - (display.x + display.width / 2)
      ) + 1.5708; // + 90 deg
  }

  public get bullets(): EntityData[] {
    return this._bulletsIvoked.map((bullet) => {
      return bullet.data;
    });
  }

  public shoot(): void {
    if (this._bulletsIvoked.length < this._maxBullet)
      this._bulletsIvoked.push(
        new Bullet(
          this._x + this._width / 2,
          this._y + this._height / 2,
          this._angle,
          this._status === "freeze"
            ? 0
            : this.status === "playing"
            ? this._speed
            : this._speed * this._sprintIncrement
        )
      );
  }

  public move(enemies: Entity[]) {
    this._bulletsIvoked = this._bulletsIvoked.filter((bullet) => {
      bullet.move(enemies);
      return bullet.isAlive; // Mantiene solo las balas vivas
    });

    this._move();
  }

  public get bulletsInstanced(): number {
    return this._bulletsIvoked.length;
  }
}
