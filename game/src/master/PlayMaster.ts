import AbstractPlayMaster from "./AbstractPlayMaster";
import { checkToken as apiCheckToken } from "../api/authenticate";
import { 
  retrievePlay as apiRetrievePlay,
  restoreProgress as apiRestoreProgress,
  backupProgress as apiBackupProgress
} from "../api/source";
import {
  startingChessPosition as cStartingChessPosition,
  processChessMove as cProcessChessMove,
  processChessResults as cProcessChessResults,
} from "./ChessMaster";

import {
  startingChessPosition as tStartingChessPosition,
  processChessMove as tProcessChessMove,
  processChessResults as tProcessChessResults,
} from "./TicTacToeMaster";

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
    if (game === "chess") return cStartingChessPosition();
    else if(game === "tictactoe") return tStartingChessPosition();
    else throw new Error(`game ${game} is not implemented`);
  }

  protected processMove(
    game: string,
    user: number,
    data: string,
    move: string
  ): string | null {
    if (game === "chess") return cProcessChessMove(user, data, move);
    else if(game === "tictactoe") return tProcessChessMove(user, data, move);
    else throw new Error(`game ${game} is not implemented`);
    
  }

  protected processResults(game: string, data: string): Result {

    if (game === "chess") return cProcessChessResults(data);
    else if(game === "tictactoe") return tProcessChessResults(data);
    else throw new Error(`game ${game} is not implemented`);
  }
}
