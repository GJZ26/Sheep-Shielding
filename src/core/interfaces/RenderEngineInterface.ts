import PerformanceMonitor from "../utils/PerformanceMonitor";
import { InvokableEntity, NoInvokableEntity } from "../entities/generic/Entity";

export interface DisplayInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderEngineSettings {
  backgroundColor: string;
  appTitle: string;
  target: HTMLElement;
  performance?: PerformanceMonitor;
  debug?: boolean;
  frames: Record<NoInvokableEntity | InvokableEntity | "backgroundActive" | "backgroundInactive", spriteAttribute | undefined>;
}

export interface spriteAttribute {
  adjustSize: "width" | "height" | "both" | "none";
  source: string;
  repeat: boolean;
  flipable: boolean;
  image?: HTMLImageElement
}
