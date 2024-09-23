import { Bot } from "./generic/Bot";
import { Entity, EntityType } from "./generic/Entity";

export class Cow extends Bot {
  protected _debugColor: string = "#fbff00";
  protected readonly _type: EntityType = "cow";
  protected _width: number = 127;
  protected _entityDetectDistance: number = 800;
  protected _speed: number = 4;
  protected _lives: number = 5;
  protected _regenerationCountDown: number = 1500;

  protected _attack(_target: Entity): void {
    // Sheeps are love!
    this._regenerate();
  }
}
