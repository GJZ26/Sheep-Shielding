import { EntityType, Position } from "../interfaces/Entity";
import { Bot } from "../interfaces/Bot";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Wolf extends Bot {
  protected _debugColor: string = "#ff0000";
  protected readonly _type: EntityType = "wolf";

  protected _runAway(_: Position): void {
    // Los lobos son valientes
  }
}
