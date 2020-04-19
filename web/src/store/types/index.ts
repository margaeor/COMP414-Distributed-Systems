export * from "./login";
export * from "./lobby";
export * from "./game";

import { PlayState } from "./game";
import { LobbyState } from "./lobby";
import { LoginState } from "./login";

export enum ScreenState {
  INITIAL_LOADING,
  LOGIN,
  LOGIN_LOADING,
  LOBBY,
  LOBBY_LOADING,
  GAME,
  GAME_LOADING,
}

export enum LoaderStep {
  LOADING,
  FAILED,
}

export interface State {
  screen: ScreenState;
  loader: LoaderStep;
  login: LoginState;
  lobby: LobbyState;
  play: PlayState;
}
