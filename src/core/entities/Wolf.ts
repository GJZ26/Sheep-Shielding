import { EntityType } from "../interfaces/Entity";
import { Bot } from "./Bot";

export class Wolf extends Bot {
  protected _debugColor: string = "#ff0000";
  protected readonly _type: EntityType = "wolf";
  protected _x: number = 500;
  protected _y: number = 100;

  constructor() {
    super();
  }
}
