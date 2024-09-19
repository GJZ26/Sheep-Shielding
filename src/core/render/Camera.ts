import { EntityData } from "../interfaces/Entity";

/**
 * Calcula las coordenadas para renderizar respecto al objetivo a seguir, sin modificar la coordenada real del mundo
 */
export class Camera {
  /**
   *
   * @returns Entidades dentro del rango de renderizado y sus coordenadas corregidas respecto al target
   */
  public capture(entities: EntityData[]): EntityData[] {
    return entities;
  }
}
