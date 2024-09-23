import { EntityData, EntityType } from "../entities/generic/Entity";

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

    const xDiference = mainEntity.x + mainEntity.width / 2 - this._width / 2;
    const yDiference = mainEntity.y + mainEntity.height / 2 - this._height / 2;

    const cameraBounds = {
      left: mainEntity.x + mainEntity.width / 2 - this._width / 2,
      right: mainEntity.x + mainEntity.width / 2 + this._width / 2,
      top: mainEntity.y + mainEntity.height / 2 - this._height / 2,
      bottom: mainEntity.y + mainEntity.height / 2 + this._height / 2,
    };

    return entities
      .map((entity) => {
        const isNotColliding =
          cameraBounds.right < entity.x || // fuera a la derecha
          cameraBounds.left > entity.x + entity.width || // fuera a la izquierda
          cameraBounds.bottom < entity.y || // fuera por abajo
          cameraBounds.top > entity.y + entity.height; // fuera por arriba

        if (!isNotColliding) {
          return {
            ...entity,
            x: entity.x - xDiference,
            y: entity.y - yDiference,
          };
        }

        if (
          entity.type === "wall" ||
          entity.type === "bullet" ||
          entity.type === "backgroundActive" ||
          entity.type === "backgroundInactive" ||
          entity.type === "generic"
        ) {
          return null;
        }
        // Crear una entidad representativa en el borde de la cámara.
        const bubbleSize = 25;
        const padding = 5
        const bubble: EntityData = {
          id: entity.id,
          x:
            entity.x > cameraBounds.right
              ? cameraBounds.right - bubbleSize - xDiference - padding
              : entity.x < cameraBounds.left - bubbleSize
              ? cameraBounds.left - xDiference + padding
              : entity.x + entity.width / 2 - xDiference,
          y:
            entity.y > cameraBounds.bottom
              ? cameraBounds.bottom - bubbleSize - yDiference - padding
              : entity.y < cameraBounds.top - bubbleSize
              ? cameraBounds.top - yDiference + padding
              : entity.y + entity.height / 2 - yDiference,
          width: bubbleSize,
          height: bubbleSize,
          color: entity.color,
          type: "bubble",
          canonical_position: {
            x: 0,
            y: 0,
          },
          angle: 0,
          status: "freeze",
          lives: 0,
        };

        return bubble;
      })
      .filter((entity) => entity !== null) as EntityData[];
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
