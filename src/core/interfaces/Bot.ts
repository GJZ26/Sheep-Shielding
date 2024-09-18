import { Entity, EntityData, EntityType } from "./Entity";

export class Bot extends Entity {
  protected readonly _targetEntity: EntityType = "player";
  protected _x_center: number = this._x + this._width / 2;
  protected _y_center: number = this._y + this._height / 2;
  protected _entityDetectDistance = 300;
  protected _entityDistanceStop = 100;

  constructor() {
    super();
  }

  protected _turnToNearestEntity(entities: EntityData[]): number {
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

    if (!nearestEntity) return -1;

    this._angle =
      Math.atan2(
        this._y - nearestEntity.canonical_position.y,
        this._x - nearestEntity.canonical_position.x
      ) - 1.5708; // - 90 degrees

    return shortestDistance; // Retorna la distancia más corta
  }

  public think(entity: EntityData[]): void {
    const distance = this._turnToNearestEntity(entity);

    if (
      distance > this._entityDistanceStop &&
      distance < this._entityDetectDistance
    ) {
      this._isMoving = true;
    } else {
      this._isMoving = false;
    }

    this._move();
    this._x_center = this._x + this._width / 2;
    this._y_center = this._y + this._height / 2;
  }
}
