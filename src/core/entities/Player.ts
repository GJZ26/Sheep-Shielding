import {
  availableStatuses,
  Entity,
  EntityType,
  KeyEventType,
  Position,
} from "../interfaces/Entity";
import { DisplayInfo } from "../interfaces/RenderEngine";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Player extends Entity {
  protected _debugColor: string = "#49ff00";
  protected readonly _type: EntityType = "player";
  protected _x: number = 700;
  protected _y: number = 200;
  protected _status: availableStatuses = "freeze";

  constructor() {
    super();
  }

  public captureKey(key: string, type: KeyEventType) {
    if (type == "down" && key == "KeyW") {
      console.log("a");
      this._status = "playing";
    }

    if (type == "up" && key == "KeyW") {
      console.log("b");
      this._status = "freeze";
    }

    if (key === "ShiftLeft" && type == "down" && this._status === "playing") {
      console.log("c");
      this._status = "running";
    }

    if (key === "ShiftLeft" && type == "up" && this._status === "running") {
      console.log("d");
      this._status = "playing";
    }
  }

  public calculateAngle(target: Position, display: DisplayInfo): void {
    this._angle =
      Math.atan2(
        target.y - (display.y + display.height / 2),
        target.x - (display.x + display.width / 2)
      ) + 1.5708; // + 90 deg
  }

  public move() {
    this._move();
  }
}
