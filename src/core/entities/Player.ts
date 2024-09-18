import { Entity, EntityType, KeyEventType } from "../interfaces/Entity";
import { DisplayInfo } from "../interfaces/RenderEngine";

export interface Location {
  x: number;
  y: number;
}

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Player extends Entity {
  protected _debugColor: string = "#49ff00";
  protected readonly _type: EntityType = "player";
  protected _x: number = 200;
  protected _y: number = 200;

  constructor() {
    super();
  }

  public captureKey(key: string, type: KeyEventType) {
    
    if (!this._isMoving && type == "down" && key == "w") {
      this._isMoving = true;
    }

    if (this._isMoving && type == "up" && key == "w") {
      this._isMoving = false;
    }
  }

  public calculateAngle(target: Location, display: DisplayInfo): number {
    this._angle =
      Math.atan2(
        target.y - (display.y + display.height / 2),
        target.x - (display.x + display.width / 2)
      ) + 1.5708; // + 90 deg
    return this._angle;
  }
}
