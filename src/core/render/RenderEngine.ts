import { RenderEngineSettings } from "../types/RenderEngine";
import PerformanceMonitor from "../utils/PerformanceMonitor";
import { version } from "../../../package.json";

/**
 * Clase encargada de renderizar todos los elementos y entidades en el elemeto Canvas generado.
 */
export default class RenderEngine {
  private _canvasElement: HTMLCanvasElement;
  private _performancer?: PerformanceMonitor;
  private _context: CanvasRenderingContext2D;
  private _debug: boolean = false;
  private _version: string = version;
  private _appName: string;

  public constructor(options: RenderEngineSettings) {
    console.log("Initializing Render Engine");

    this._canvasElement = document.createElement("canvas");
    this._performancer = options.performance;
    this._debug = options.debug || this._debug;
    this._context = this._canvasElement.getContext("2d")!;
    this._appName = options.appTitle;

    this._autoResizer();
    this._inject(options.target, options.backgroundColor);
    this._changePageTitle(options.appTitle);

    RenderEngine.stylize(this._canvasElement, options.backgroundColor);
  }
  public static stylize(element: HTMLElement, backgroundColor: string): void {
    element.style.margin = "0";
    element.style.padding = "0";
    element.style.border = "none";
    element.style.outline = "0";
    element.style.display = "block";
    element.style.backgroundColor = backgroundColor;
  }

  /**
   * Arranca el bucle de renderizado. Ejecutar dentro del hilo principal ya que necesita acceso al DOM
   */
  public loop(): void {
    console.log("Starting render loop!");
    window.requestAnimationFrame(this._renderFrame.bind(this));
  }

  private _resize(width: number, heigh: number): void {
    this._canvasElement.width = width;
    this._canvasElement.height = heigh;
  }

  private _autoResizer(): void {
    this._resize(window.innerWidth - 1, window.innerHeight - 1);

    window.addEventListener("resize", () => {
      this._resize(window.innerWidth - 1, window.innerHeight - 1);
    });
  }

  private _changePageTitle(title: string): void {
    document.title = title;
  }

  private _inject(target: HTMLElement, color: string): void {
    RenderEngine.stylize(target, color);
    target.appendChild(this._canvasElement);
    target.style.backgroundColor = color;
  }

  private _renderFrame(): void {
    this._clearScreen();
    if (this._debug) {
      if (this._performancer) {
        this._drawText(
          `${new Date().toLocaleString("es")}\n\n${
            this._appName
          }\n${this._performancer.getFPS()} FPS\n v.${this._version}`
        );
      }
    }
    window.requestAnimationFrame(this._renderFrame.bind(this));
  }

  private _drawText(text: string): void {
    this._context.save();
    this._context.fillStyle = "white";
    this._context.font = "bold 12px monospace";
    text.split("\n").map((line, index) => {
      this._context.fillText(line.trim(), 10, 12 * (index + 1) + 5, 600);
    });
    this._context.restore();
  }

  private _clearScreen() {
    this._context.save();
    this._context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this._context.restore();
  }
}
