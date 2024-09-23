import { InvokableEntity } from "../entities/generic/Entity";
import { EntityStatusResume } from "./EntityManager";

export interface InvokeEntityData {
  type: InvokableEntity;
  amount: number;
  clearQueue: boolean;
}

export interface MatchResume {
  timesDeath: number;
  rounds: number;
  sheepSaved: number;
  sheepKilled: number;
  wolfKilled: number;
  timePlayingInSecond: number;
  score: number;
}

export class GameManager {
  private _initialAnimalCount = 5;
  private _initialEnemyCount = 1;

  private _currentAnimalAlive = 0;
  private _incrementEnemyByRound = 1;

  private _timesDeath = 0;
  private _roundCount = 1;
  private _sheepSaved = 0;
  private _sheepKilled = 0;
  private _wolfKilled = 0;
  private _startPlayAt: number = Date.now();

  private _status: "lost" | "in-progress" = "in-progress";

  constructor() {
    console.info("🕹️ Creating a new game");
  }

  public invokeCurrentEnemies(clearQueue: boolean): InvokeEntityData[] {
    const result: InvokeEntityData[] = [];

    result.push({
      type: "sheep",
      amount: this._initialAnimalCount - this._currentAnimalAlive,
      clearQueue: clearQueue,
    });

    result.push({
      type: "wolf",
      amount: Math.round(this._initialEnemyCount),
      clearQueue: clearQueue,
    });

    return result;
  }

  /**
   *
   * @param status Retorna true si necesita actualizar los niveles
   */
  public updateMatchStatus(status: EntityStatusResume): boolean {
    if (this._status === "lost") return false;
    if (!status.isPlayerAlive) this._timesDeath++;

    if (status.animalsAlive <= 0) {
      this._status = "lost";
      this._sheepKilled += this._initialAnimalCount - this._currentAnimalAlive;
      this._wolfKilled +=
        Math.round(this._initialEnemyCount) - status.enemiesAlive;
      return true;
    }

    if (status.enemiesAlive <= 0) {
      this._roundCount++;

      this._sheepKilled += this._initialAnimalCount - this._currentAnimalAlive;
      this._sheepSaved += status.animalsAlive;
      this._wolfKilled += Math.round(this._initialEnemyCount);

      this._currentAnimalAlive = status.animalsAlive;
      this._initialEnemyCount += this._incrementEnemyByRound;
      return true;
    }

    return false;
  }

  public get isLost(): boolean {
    return this._status === "lost";
  }

  public get resume(): MatchResume {
    const now = (Date.now() - this._startPlayAt) / 1000;
    return {
      rounds: this._roundCount,
      timesDeath: this._timesDeath,
      sheepKilled: this._sheepKilled,
      sheepSaved: this._sheepSaved,
      wolfKilled: this._wolfKilled,
      timePlayingInSecond: now,
      score:
        this._roundCount * 1000 +
        this._sheepSaved * 200 +
        this._wolfKilled * 100 +
        Math.round(now),
    };
  }
}
