import { EntityType } from "../interfaces/Entity";
import { Bot } from "../interfaces/Bot";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Sheep extends Bot {
  protected _debugColor: string = "#fbff00";
  protected readonly _type: EntityType = "sheep";
  protected _x: number = 200;
  protected _y: number = 300;
  protected _speed: number = 3;

  constructor() {
    super();
  }

}
