import { Play, ExtendedPlay } from "./api/source";

export class PlayMaster {
  registerUser(sockId: string, user: string, id: string) {}

  registerPlay(play: Play, progress?: string) {}

  unregisterSocket(sockId: string) {}

  getPlay(id: string): Play | undefined {
    return undefined;
  }
}
