import AbstractPlayMaster from "./AbstractPlayMaster";
import { checkToken as apiCheckToken } from "../api/authenticate";
import { 
  retrievePlay as apiRetrievePlay,
  restoreProgress as apiRestoreProgress,
  backupProgress as apiBackupProgress
} from "../api/source";
import {
  startingChessPosition,
  processChessMove,
  processChessResults,
} from "./ChessMaster";
import { Result } from "../api/types";

export default class PlayMaster extends AbstractPlayMaster {
  protected checkToken(token: string) {
    return apiCheckToken(token);
  }
  protected async retrievePlay(game_id:string, id: string) {
    return await apiRetrievePlay(game_id, id);
  }

  protected async restoreProgress(id: string): Promise<string> {
    return await apiRestoreProgress(id);
  }

  protected async backupProgress(id: string, progress: string): Promise<any> {
    return await apiBackupProgress(id,progress);
  }

  protected startingPosition(game: string): string {
    if (game !== "chess") throw new Error(`game ${game} is not implemented`);
    return startingChessPosition();
  }

  protected processMove(
    game: string,
    user: number,
    data: string,
    move: string
  ): string | null {
    if (game !== "chess") throw new Error(`game ${game} is not implemented`);
    return processChessMove(user, data, move);
  }

  protected processResults(game: string, data: string): Result {
    return processChessResults(data);
  }
}
