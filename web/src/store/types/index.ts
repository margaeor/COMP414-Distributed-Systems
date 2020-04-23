export * from "./lobby";
export * from "./game";

import { PlayState } from "./game";
import { LobbyState } from "./lobby";

export enum ScreenState {
  LOGIN = 1,
  LOBBY = 2,
  GAME = 3,
  LEADERBOARDS = 4,
  ADMINISTRATION = 5,
}

export enum LoaderStep {
  INACTIVE = 0,
  LOADING = 1,
  FAILED = 2,
}

export interface State {
  screen: ScreenState;
  loader: LoaderStep;
  loginError: string;
  lobby: LobbyState;
  game: PlayState;
}
