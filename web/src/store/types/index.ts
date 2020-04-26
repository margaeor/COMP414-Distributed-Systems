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
  INACTIVE = 1,
  LOADING = 2,
  FAILED = 3,
}

export interface User {
  username: string;
  officer: boolean;
  admin: boolean;
  email: string;
}

export const NULL_USER = {
  username: "",
  officer: false,
  admin: false,
  email: "",
};

export interface State {
  screen: ScreenState;
  loader: LoaderStep;
  message: string;
  error: string;
  user: User;
  lobby: LobbyState;
  game: PlayState;
}
