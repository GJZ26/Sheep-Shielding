import { Entity, EntityData, EntityType } from "../interfaces/Entity";
import { Player } from "./Player";
import { Sheep } from "./Sheep";

/**
 * Representa todas las entidades creadas en el mundo
 */
export class EntityManager {
  private entitiesList: Entity[] = [];

  public invoke(type: EntityType): string {
    let id: string = "";
    switch (type) {
      case "player":
        id = this._addPlayer();
        break;
      case "sheep":
        const sheep = new Sheep();
        id = sheep.id;
        this.entitiesList.push(sheep);
        break;
      default:
        console.warn(
          `It was not possible to invoke an entity of the type ${type}.`
        );
        break;
    }
    return id || "[Entity not created]";
  }

  public get data(): EntityData[] {
    return this.entitiesList.map((entity) => entity.data);
  }

  private _playerExists(): boolean {
    return (
      this.entitiesList.reduce((accumulator, entity) => {
        return accumulator + (entity.type == "player" ? 1 : 0);
      }, 0) >= 1
    );
  }

  private _addPlayer(): string {
    if (this._playerExists()) {
      console.warn(
        "A player type entity already exists. There cannot be more than one player in the world (for now)."
      );
      return "";
    }
    const entity = new Player();
    this.entitiesList.push(entity);
    return entity.id;
  }
}
