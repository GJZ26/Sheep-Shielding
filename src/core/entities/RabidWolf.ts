import { EntityType } from "./generic/Entity";
import { Bot } from "./generic/Bot";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class RabidWolf extends Bot {
  protected _debugColor: string = "#ff0000";
  protected readonly _type: EntityType = "rabidWolf";
  protected _entityDetectDistance: number = 500;
  protected _speed: number = 6;
  protected _width: number = 106;
  protected _lives: number = 4;
}
