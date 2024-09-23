import { availableStatuses, Entity, EntityType, Position } from "./Entity";

export abstract class Bot extends Entity {
  protected readonly _targetEntity: EntityType = "player";
  protected _x_center: number = this._x + this._width / 2;
  protected _y_center: number = this._y + this._height / 2;
  protected _entityDetectDistance = 300;
  protected _entityDistanceStop = 100;

  protected _status: availableStatuses = "freeze";
  private _targetRotation: number = 0;
  private _lastTimePanicked: number = -1;
  private _calmCountDown: number = 1000 * 5;
  private _isPanicked: boolean = false;

  public think(entity: Entity[]): void {
    if (this._status === "dead") return;

    this._isPanicked =
      Date.now() - this._lastTimePanicked < this._calmCountDown;

    const { distance, nearestEntity } = this._positionOfNearestEntity(entity);
    const isColliding = this._isColliding(nearestEntity);
    if (this._isPanicked) {
      this._status = "running";
    } else if (distance < this._entityDetectDistance && !isColliding) {
      this._status = "running";
      this._turn({ x: nearestEntity?.x || 0, y: nearestEntity?.y || 0 }, false);
    } else if (isColliding) {
      this._attack(nearestEntity!);
      this._status = "freeze";
    } else if (distance <= this._entityDistanceStop) {
      this._status = "freeze";
    } else {
      this._status = "iddle";
    }

    this.iddle();
    this._move();
  }

  protected iddle(): void {
    if (this._status !== "iddle") return;

    if (Math.abs(this._angle - this._targetRotation) < 0.009) {
      this._targetRotation =
        Bot.randomIntFromInterval(-90, 90) * (Math.PI / 180) + this._angle;
    }

    this._smoothRotation();
  }

  protected _move(): void {
    if (this._isPanicked) {
      this._smoothRotation();
      const originalSpeedIncrement = this._sprintIncrement;
      this._sprintIncrement += this._isPanicked ? 1 : 0;
      super._move();
      this._sprintIncrement = originalSpeedIncrement;

      if (Math.abs(this._angle - this._targetRotation) < 0.009) {
        this._targetRotation =
          Bot.randomIntFromInterval(-90, 90) * (Math.PI / 180) + this._angle;
      }
    } else {
      super._move();
    }
  }

  private _smoothRotation(): void {
    this._angle += (this._targetRotation - this._angle) * 0.1;
  }

  // source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  protected static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public hurt(origin?: Position): void {
    super.hurt();
    if (origin && this.status !== "dead") {
      this._runAway(origin);
    }
  }

  protected _runAway(from: Position): void {
    this._lastTimePanicked = Date.now();
    this._targetRotation = Entity.calculateAngleFrom(
      {
        x: this.x,
        y: this.y,
      },
      from,
      true
    );
    this._status = "running";
  }
}
