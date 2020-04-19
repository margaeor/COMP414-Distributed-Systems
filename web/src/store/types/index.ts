export * from "./login";
export * from "./lobby";
export * from "./game";

import { PlayState } from "./game";
import { LobbyState } from "./lobby";
import { LoginState } from "./login";

export enum ScreenState {
  INITIAL,
  LOGIN,
  LOBBY,
  GAME,
}

export enum LoaderStep {
  INACTIVE,
  LOADING,
  FAILED,
}

export interface State {
  screen: ScreenState;
  loader: LoaderStep;
  login: LoginState;
  lobby: LobbyState;
  game: PlayState;
}
