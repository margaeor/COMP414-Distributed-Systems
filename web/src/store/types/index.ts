export * from "./login";
export * from "./lobby";
export * from "./game";

import { PlayState } from "./game";
import { LobbyState } from "./lobby";
import { LoginState } from "./login";

export enum ScreenState {
  INITIAL_LOADING,
  LOGIN,
  LOGIN_FORGOT,
  LOGIN_LOADING,
  LOBBY_LOADING,
  LOBBY_WAITING,
  GAME_LOADING,
  GAME_ONGOING,
  GAME_FINISHED,
}

export interface State {
  screen: ScreenState;
  login: LoginState;
  lobby: LobbyState;
  play: PlayState;
}
