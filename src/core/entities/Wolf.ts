import { Entity, EntityType } from "../interfaces/Entity";

export class Wolf extends Entity {
  protected _debugColor: string = "#ff0000";
  protected readonly _type: EntityType = "wolf";
  protected _x: number = 500;
  protected _y: number = 100;

  constructor() {
    super();
  }
}
