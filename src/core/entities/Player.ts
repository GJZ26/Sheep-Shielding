import { Entity, EntityType } from "../interfaces/Entity";

/**
 * PLEASE DO NOT INSTANTIATE THIS CLASS DIRECTLY. USE EntityManager INSTEAD.
 */
export class Player extends Entity {
  protected _debugColor: string = "green";
  protected readonly _type: EntityType = "player";
  protected _x: number = 200;
  protected _y: number = 200;

  constructor() {
    super();
  }
}
