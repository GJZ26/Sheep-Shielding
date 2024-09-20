import { availableStatuses, Entity, EntityType } from "./Entity";

export abstract class Bot extends Entity {
  protected readonly _targetEntity: EntityType = "player";
  protected _x: number = Bot.randomIntFromInterval(10, 1500);
  protected _y: number = Bot.randomIntFromInterval(10, 500);
  protected _x_center: number = this._x + this._width / 2;
  protected _y_center: number = this._y + this._height / 2;
  protected _entityDetectDistance = 300;
  protected _entityDistanceStop = 10;

  protected _status: availableStatuses = "freeze";
  private _targetRotation: number = 0;

  constructor() {
    super();
  }

  public think(entity: Entity[]): void {
    if (this._status === "dead") return;
    const { distance, nearestEntity } = this._positionOfNearestEntity(entity);
    const isColliding = this._isColliding(nearestEntity)
    if (
      distance < this._entityDetectDistance &&
      !isColliding
    ) {
      this._status = "running";
      this._turn({ x: nearestEntity?.x || 0, y: nearestEntity?.y || 0 }, false);
    } else if (isColliding) {
      this._attack(nearestEntity!);
      this._status = "freeze";
    } else {
      this._status = "iddle";
    }

    this.iddle();
    this._move();
    this._x_center = this._x + this._width / 2;
    this._y_center = this._y + this._height / 2;
  }

  protected iddle(): void {
    if (this._status != "iddle") return;

    if (Math.abs(this._angle - this._targetRotation) < 0.009) {
      this._targetRotation =
        Bot.randomIntFromInterval(-90, 90) * (Math.PI / 180) + this._angle;
    }

    this._smoothRotation();
  }

  private _smoothRotation(): void {
    this._angle += (this._targetRotation - this._angle) * 0.1;
  }

  // source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  protected static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
