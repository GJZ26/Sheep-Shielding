import { PerformanceAttributes } from "../interfaces/PerformanceMonitorInterface";

export default class PerformanceMonitor {
  private _frame: number = 0;
  private _lastRender: number = performance.now();
  private _fps: number = this._frame;
  private _fixedTo: number = 0;

  constructor(opt: PerformanceAttributes) {
    this._fixedTo = opt.fixedTo;
  }

  public getFPS(): string {
    this._frame++;

    if (performance.now() - this._lastRender > 1000) {
      this._fps = this._frame / ((performance.now() - this._lastRender) / 1000);
      this._frame = 0;
      this._lastRender = performance.now();
    }

    return this._fps.toFixed(this._fixedTo);
  }
}
