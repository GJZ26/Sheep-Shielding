import { availableStatuses, Entity, EntityData, EntityType } from "./Entity";

export class Bot extends Entity {
  protected readonly _targetEntity: EntityType = "player";
  protected _x: number = Bot.randomIntFromInterval(10, 1500);
  protected _y: number = Bot.randomIntFromInterval(10, 500);
  protected _x_center: number = this._x + this._width / 2;
  protected _y_center: number = this._y + this._height / 2;
  protected _entityDetectDistance = 300;
  protected _entityDistanceStop = 100;

  protected _status: availableStatuses = "iddle";
  private _targetRotation: number = 0;

  constructor() {
    super();
  }

  protected _turnToNearestEntity(entities: EntityData[]): {
    distance: number;
    nearestEntity: EntityData | undefined;
  } {
    let shortestDistance = Infinity;
    let nearestEntity = entities.reduce(
      (closest: EntityData | undefined, entity) => {
        const distance = Math.sqrt(
          Math.pow(this._x_center - entity.canonical_position.x, 2) +
            Math.pow(this._y_center - entity.canonical_position.y, 2)
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
        }

        return distance <
          (closest
            ? Math.sqrt(
                Math.pow(this._x_center - closest.canonical_position.x, 2) +
                  Math.pow(this._y_center - closest.canonical_position.y, 2)
              )
            : Infinity)
          ? entity
          : closest;
      },
      undefined
    );

    if (!nearestEntity) return { distance: -1, nearestEntity: undefined };

    return { distance: shortestDistance, nearestEntity }; // Retorna la distancia más corta
  }

  public think(entity: EntityData[]): void {
    const { distance, nearestEntity } = this._turnToNearestEntity(entity);

    if (
      distance > this._entityDistanceStop &&
      distance < this._entityDetectDistance
    ) {
      if (this._status !== "running") {
        this._status = "running";
      }
      this._turn({ x: nearestEntity?.x || 0, y: nearestEntity?.y || 0 }, false);
    } else if (distance < this._entityDistanceStop) {
      this._status = "freeze";
    } else {
      if (this._status !== "iddle") {
        this._status = "iddle";
      }
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
