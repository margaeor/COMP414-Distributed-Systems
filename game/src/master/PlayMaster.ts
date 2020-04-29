import AbstractPlayMaster from "./AbstractPlayMaster";
import { checkToken as apiCheckToken } from "../api/authenticate";
import { retrievePlay as apiRetrievePlay } from "../api/source";
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
  protected retrievePlay(id: string) {
    return apiRetrievePlay(id);
  }

  protected restoreProgress(id: string) {
    return null;
  }

  protected backupProgress(id: string, progress: string): void {
    return;
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
