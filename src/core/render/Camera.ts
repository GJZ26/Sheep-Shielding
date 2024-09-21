import { EntityData, EntityType } from "../interfaces/Entity";

/**
 * Calcula las coordenadas para renderizar respecto al objetivo a seguir, sin modificar la coordenada real del mundo
 */
export class Camera {
  private _width: number;
  private _height: number;
  private _followingType: EntityType;

  constructor(width: number, height: number, following: EntityType) {
    this._width = width;
    this._height = height;
    this._followingType = following;
  }
  /**
   *
   * @returns Entidades dentro del rango de renderizado y sus coordenadas corregidas respecto al target
   */
  public capture(entities: EntityData[]): EntityData[] {
    const mainEntity = this._findFollowingEntity(entities);
    const xDiference = mainEntity.x - this._width / 2 + mainEntity.width / 2;
    const yDiference = mainEntity.y - this._height / 2 + mainEntity.height / 2;

    return entities.map((entity) => {
      entity.x -= xDiference;
      entity.y -= yDiference;

      return entity;
    });
  }

  public resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
  }

  private _findFollowingEntity(entities: EntityData[]): EntityData {
    for (let entity of entities) {
      if (entity.type === this._followingType) {
        return entity;
      }
    }
    return entities[entities.length - 1];
  }
}
