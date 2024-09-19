import { RenderEngineSettings } from "../interfaces/RenderEngine";
import PerformanceMonitor from "../utils/PerformanceMonitor";
import { version } from "../../../package.json";
import { EntityData } from "../interfaces/Entity";

/**
 * TODO: Cambiar a patrón Singleton
 * Clase encargada de renderizar todos los elementos y entidades en el elemeto Canvas generado.
 */
export default class RenderEngine {
  private _canvasElement: HTMLCanvasElement;
  private _performancer?: PerformanceMonitor;
  private _context: CanvasRenderingContext2D;
  private _debug: boolean = false;
  private _version: string = version;
  private _appName: string;
  private _entities: EntityData[] = [];

  public constructor(options: RenderEngineSettings) {
    console.log("Initializing Render Engine");

    this._canvasElement = document.createElement("canvas");
    this._performancer = options.performance;
    this._debug = options.debug || this._debug;
    this._context = this._canvasElement.getContext("2d")!;
    this._appName = options.appTitle;

    this.resize(window.innerWidth - 1, window.innerHeight - 1);
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
    console.log("Starting render loop");
    window.requestAnimationFrame(this._renderFrame.bind(this));
  }

  public render(entities: EntityData[]) {
    this._entities = entities;
  }

  public resize(width: number, heigh: number): void {
    this._canvasElement.width = width;
    this._canvasElement.height = heigh;
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

    this._entities.forEach((entity) => {
      this._renderEntityDebugData(entity);
    });

    this._renderDebugData();
    window.requestAnimationFrame(this._renderFrame.bind(this));
  }

  private _renderDebugData(): void {
    if (!this._debug) return;
    if (this._performancer) {
      this._drawText(
        `${new Date().toLocaleString("es")}\n\n${
          this._appName
        }\n${this._performancer.getFPS()} FPS\n v.${this._version}`
      );
    }
  }

  private _renderEntityDebugData(entity: EntityData): void {
    this._context.save();
    if (this._debug) {
      this._context.strokeStyle = entity.color;

      this._renderGenericEntity(entity);
      if (entity.type !== "bullet") {
      } else {
        this._renderBulletDebug(entity);
      }

      this._addDebugInfo(entity);
      this._displayOrientation(entity);
    }
    this._context.restore();
  }

  private _displayOrientation(entity: EntityData) {
    this._context.beginPath();
    this._context.moveTo(
      entity.x + entity.width / 2,
      entity.y + entity.height / 2
    );
    this._context.lineTo(
      entity.x + entity.width / 2 + 20 * Math.sin(entity.angle),
      entity.y +
        entity.height / 2 +
        20 * Math.cos(entity.angle - 2 * ((90 * Math.PI) / 180))
    );
    this._context.stroke();
    this._context.closePath();
  }

  private _renderBulletDebug(entity: EntityData): void {
    this._context.beginPath();
    this._context.arc(
      entity.x + entity.width / 2,
      entity.y + entity.height / 2,
      entity.width / 2,
      0,
      2 * Math.PI
    );
    this._context.stroke();
    this._context.closePath();
  }

  private _renderGenericEntity(entity: EntityData): void {
    this._context.strokeRect(entity.x, entity.y, entity.width, entity.height);
  }

  private _addDebugInfo(entity: EntityData): void {
    if (entity.type == "bullet") return;
    this._drawText(
      `[${entity.id}]:[${entity.type}]`,
      entity.x - 8,
      entity.y + entity.height - 5,
      undefined,
      entity.color,
      10,
      false
    );

    this._drawText(
      `[Canonical Pos]\nx: ${entity.canonical_position.x.toFixed(
        2
      )}, y:${entity.canonical_position.y.toFixed(
        2
      )}\n[Render Pos]\nx: ${entity.x.toFixed(2)}, y:${entity.y.toFixed(
        2
      )}\nStatus: ${entity.status}\nAngle: ${entity.angle.toFixed(2)}`,
      entity.x + entity.width + 3,
      entity.y - 10,
      undefined,
      entity.color,
      10,
      false
    );
  }

  private _drawText(
    text: string,
    x: number = 10,
    y: number = 0,
    maxWidth: number = 600,
    color: string = "white",
    fontSize: number = 12,
    bold: boolean = true
  ): void {
    this._context.save();
    this._context.fillStyle = color;
    this._context.font = `${bold ? "bold " : ""}${fontSize}px monospace`;
    text.split("\n").map((line, index) => {
      this._context.fillText(
        line.trim(),
        x,
        y + (12 * (index + 1) + 5),
        maxWidth
      );
    });
    this._context.restore();
  }

  private _clearScreen(): void {
    this._context.save();
    this._context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this._context.restore();
  }
}
