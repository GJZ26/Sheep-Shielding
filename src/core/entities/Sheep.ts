import { Entity, EntityType } from "../interfaces/Entity";
import { Bot } from "../interfaces/Bot";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Sheep extends Bot {
  protected _debugColor: string = "#fbff00";
  protected readonly _type: EntityType = "sheep";
  protected _speed: number = 1;

  constructor() {
    super();
  }

  protected attack(_target: Entity): void {
      // Sheeps are love!
  }
}
