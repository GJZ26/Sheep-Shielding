import PerformanceMonitor from "../utils/PerformanceMonitor";

export interface RenderEngineSettings {
  backgroundColor: string;
  appTitle: string;
  target: HTMLElement;
  performance?: PerformanceMonitor;
  debug?: boolean;
}
