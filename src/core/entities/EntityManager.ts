import {
  Entity,
  EntityData,
  EntityType,
  KeyEventType,
} from "../interfaces/Entity";
import { DisplayInfo } from "../interfaces/RenderEngine";
import { Location, Player } from "./Player";
import { Sheep } from "./Sheep";
import { Wolf } from "./Wolf";

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private _entitiesList: Entity[] = [];
  private _player: Player;

  constructor() {
    this._player = new Player();
  }

  public invoke(type: EntityType): string {
    if (type == "sheep") {
      const sheep = new Sheep();
      this._entitiesList.push(sheep);
      return sheep.id;
    }

    if (type == "wolf") {
      const wolf = new Wolf();
      this._entitiesList.push(wolf);
      return wolf.id;
    }

    console.warn(
      `It was not possible to invoke an entity of the type ${type}.`
    );
    return "[Entity not created]";
  }

  public get data(): EntityData[] {
    return [
      ...this._entitiesList.map((entity) => entity.data),
      this._player.data,
    ];
  }

  public followCursorPlayer(cursor: Location, display: DisplayInfo): number {
    return this._player.calculateAngle(cursor, display);
  }

  public captureKey(key: string, type: KeyEventType): void {
    this._player.captureKey(key, type);
  }

  public step() {
    this._player.move();
    this._entitiesList.forEach((_) => {
      // entity.move();
    });
  }
}
