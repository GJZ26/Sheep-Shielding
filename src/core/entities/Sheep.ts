import { Entity, EntityType } from "../interfaces/Entity";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Sheep extends Entity {
  protected _debugColor: string = "#fbff00";
  protected readonly _type: EntityType = "sheep";
  protected _x: number = 100;
  protected _y: number = 100;

  constructor() {
    super();
  }
}
