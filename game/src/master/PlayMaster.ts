import AbstractPlayMaster from "./AbstractPlayMaster";
import { checkToken as apiCheckToken } from "../api/authenticate";
import {
  retrievePlay as apiRetrievePlay,
  restoreProgress as apiRestoreProgress,
  backupProgress as apiBackupProgress,
} from "../api/source";
import {
  startingChessPosition,
  processChessMove,
  processChessResults,
} from "./ChessMaster";

import {
  startingTicPosition,
  processTicMove,
  processTicResults,
} from "./TicTacToeMaster";

import { Result } from "../api/types";

export default class PlayMaster extends AbstractPlayMaster {
  protected checkToken(token: string) {
    return apiCheckToken(token);
  }
  protected async retrievePlay(game_id: string, id: string) {
    return await apiRetrievePlay(game_id, id);
  }

  protected async restoreProgress(id: string): Promise<string | null> {
    return await apiRestoreProgress(id);
  }

  protected async backupProgress(id: string, progress: string): Promise<any> {
    return await apiBackupProgress(id, progress);
  }

  protected startingPosition(game: string): string {
    if (game === "chess") return startingChessPosition();
    else if (game === "tic-tac-toe") return startingTicPosition();
    else throw new Error(`game ${game} is not implemented`);
  }

  protected processMove(
    game: string,
    user: number,
    data: string,
    move: string
  ): string | null {
    if (game === "chess") return processChessMove(user, data, move);
    else if (game === "tic-tac-toe") return processTicMove(user, data, move);
    else throw new Error(`game ${game} is not implemented`);
  }

  protected processResults(game: string, data: string): Result {
    if (game === "chess") return processChessResults(data);
    else if (game === "tic-tac-toe") return processTicResults(data);
    else throw new Error(`game ${game} is not implemented`);
  }
}
