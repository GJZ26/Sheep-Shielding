import { EntityType } from "../interfaces/Entity";
import { Bot } from "../interfaces/Bot";

export class Wolf extends Bot {
  protected _debugColor: string = "#ff0000";
  protected readonly _type: EntityType = "wolf";
  protected _speed: number = 4;

  constructor() {
    super();
  }
}
