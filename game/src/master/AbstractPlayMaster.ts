import { Play, PlaySession, Result } from "../api/types";

export default abstract class AbstractPlayMaster {
  socketMap: Record<string, PlaySession> = {};
  sessions: Record<string, PlaySession> = {};

  protected abstract checkToken(token: string): string | null;
  protected abstract retrievePlay(id: string): Play | null;
  protected abstract restoreProgress(id: string): string | null;
  protected abstract backupProgress(id: string, progress: string): void;
  protected abstract startingPosition(game: string): string;
  protected abstract processMove(
    game: string,
    user: number,
    data: string,
    move: string
  ): string | null;
  protected abstract processResults(game: string, data: string): Result;

  public registerUser(sockId: string, token: string, playId: string) {
    // Check user
    const user = this.checkToken(token);
    if (!user) throw new Error("Invalid Token");

    // Check play
    let play: Play | null;
    if (playId in this.sessions) {
      play = this.sessions[playId].play;
    } else {
      play = this.retrievePlay(playId);
    }
    if (!play) throw new Error("Play not found");

    // Check user in play
    const isOpponent1 = play.opponent1 === user;
    const isOpponent2 = play.opponent2 === user;
    if (!isOpponent1 && !isOpponent2) throw new Error("Play not in play");

    let session;
    if (!(playId in this.sessions)) {
      // Create play session
      const progress = this.restoreProgress(playId);
      session = {
        play,
        user1: isOpponent1 ? sockId : null,
        user2: isOpponent2 ? sockId : null,
        progress: progress ? progress : this.startingPosition(play.game),
      };
      this.sessions[playId] = session;
    } else {
      // Add user to session
      session = this.sessions[playId];
      if ((isOpponent1 && session.user1) || (isOpponent2 && session.user2))
        throw new Error("User is already connected");

      if (isOpponent1) session.user1 = sockId;
      if (isOpponent2) session.user2 = sockId;
    }
    // Map socket id to session;
    this.socketMap[sockId] = session;
  }

  public unregisterUser(sockId: string) {
    if (!(sockId in this.socketMap)) return;

    // Remove user;
    const session = this.socketMap[sockId];
    if (session.user1 === sockId) session.user1 = null;
    if (session.user2 === sockId) session.user2 = null;

    // Remove data
    if (!session.user1 && !session.user2) delete this.sessions[session.play.id];
    delete this.socketMap[sockId];
  }

  public makeMove(sockId: string, data: string, move: string) {
    const session = this.socketMap[sockId];
    const currData = session.progress;
    // Move came with stale data
    if (currData !== data) return false;

    const newData = this.processMove(
      session.play.game,
      session.user1 === sockId ? 1 : 2,
      data,
      move
    );
    if (newData) {
      session.progress = newData;
      this.backupProgress(session.play.id, newData);
      return true;
    }
    return false;
  }

  public getData(sockId: string) {
    return this.socketMap[sockId].progress;
  }

  public getResult(sockId: string) {
    const session = this.socketMap[sockId];
    if (!session.progress) return "ongoing";
    return this.processResults(session.play.game, session.progress);
  }
}
