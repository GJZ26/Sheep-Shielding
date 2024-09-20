import PerformanceMonitor from "../utils/PerformanceMonitor";

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
}