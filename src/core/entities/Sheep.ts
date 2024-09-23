import { Entity, EntityType } from "./generic/Entity";
import { Bot } from "./generic/Bot";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Sheep extends Bot {
  protected _debugColor: string = "#fbff00";
  protected readonly _type: EntityType = "sheep";
  protected _width: number = 96;

  protected _attack(_target: Entity): void {
    // Sheeps are love!
    this._regenerate()
  }
}
