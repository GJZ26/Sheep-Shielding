import { Entity, EntityType } from "../interfaces/Entity";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Wall extends Entity {
  protected _type: EntityType = "wall";
  protected _lives: number = 0;
  protected _debugColor: string = "#3200ff";
  protected _speed: number = 0;
  protected _sprintIncrement: number = 1;

  private angleToUpperRightCorner: number;
  private angleToUpperLeftCorner: number;
  private angleToLowerRightCorner: number;
  private angleToLowerLeftCorner: number;

  constructor(x?: number, y?: number, width?: number, height?: number) {
    super(x, y, width, height);
    const me = {
      x: this.center_x,
      y: this.center_y,
    };
    const upperLeftCorner = Entity.radToDegreeFixed(
      Entity.calculateAngleFrom(me, {
        x: this._x + this.width,
        y: this._y,
      })
    );

    this.angleToUpperRightCorner = upperLeftCorner;
    this.angleToUpperLeftCorner = 360 - upperLeftCorner;
    this.angleToLowerRightCorner = 180 - upperLeftCorner;
    this.angleToLowerLeftCorner = 180 + upperLeftCorner;
  }

  public hurt(): void {
    // Did you just try to punch a wall?
  }

  public checkCollision(entities: Entity[]): void {
    entities.forEach((entity) => {
      if (
        this._isColliding(entity) &&
        entity.status !== "freeze" &&
        entity.status !== "dead"
      ) {
        const collisionDirection = Entity.radToDegreeFixed(
          Entity.calculateAngleFrom(
            { x: this.center_x, y: this.center_y },
            { x: entity.center_x, y: entity.center_y }
          )
        );

        const isFromTop =
          collisionDirection < this.angleToUpperRightCorner ||
          collisionDirection > this.angleToUpperLeftCorner;
        const isFromRight =
          collisionDirection > this.angleToUpperRightCorner &&
          collisionDirection < this.angleToLowerRightCorner;
        const isFromBottom =
          collisionDirection > this.angleToLowerRightCorner &&
          collisionDirection < this.angleToLowerLeftCorner;
        const isFromLeft =
          collisionDirection > this.angleToLowerLeftCorner &&
          collisionDirection < this.angleToUpperLeftCorner;

        if (isFromRight && entity.x < this.x + this.width) {
          entity.relocate(this.x + this.width, entity.y);
        }

        if (isFromLeft && entity.x + entity.width > this.x) {
          entity.relocate(this.x - entity.width, entity.y);
        }

        if (isFromTop && entity.y + entity.height > this.y) {
          entity.relocate(entity.x, this.y - entity.height);
        }

        if (isFromBottom && entity.y < this.y + this.height) {
          entity.relocate(entity.x, this.y + this.height);
        }
      }
    });
  }
  // method
} // class
