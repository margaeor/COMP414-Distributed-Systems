import { Game, Play } from "./game";

export interface Tournament {
  id: string;
  name: string;
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

export const NULL_LOBBY_STATE: LobbyState = {
  tournament: {
    fetched: false,
    tournaments: [],
  },
  ongoingPlays: {
    fetched: false,
    plays: [],
  },
};
