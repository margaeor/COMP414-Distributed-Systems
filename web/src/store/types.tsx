export interface LoginState {
  username: String;
  password: String;

  checkedToken: boolean;
  loggedIn: boolean;
}

export enum Game {
  CHESS,
  TICTACTOE,
}

export interface Tournament {
  id: string;
  name: String;
  game: Game;
  players: number;
  maxPlayers: number;
}

export interface TournamentState {
  fetched: boolean;
  tournaments: Tournament[];
}

export interface Play {
  id: string;
  opponent: string;
  game: Game;
  won?: boolean;
  started?: boolean;
}

export interface TournamentPlay extends Play {
  name: string;
}

export interface OngoingPlayState {
  fetched: boolean;
  plays: Play[];
}

export interface LobbyState {
  loadingGame: boolean;
  tournament: TournamentState;
  ongoingPlays: OngoingPlayState;
}

export interface State {
  login: LoginState;
  lobby: LobbyState;
}
