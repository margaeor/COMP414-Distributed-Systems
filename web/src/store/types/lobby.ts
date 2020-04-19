import { Game, Play } from "./game";

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

export interface OngoingPlayState {
  fetched: boolean;
  plays: Play[];
}

export interface LobbyState {
  tournament: TournamentState;
  ongoingPlays: OngoingPlayState;
}
