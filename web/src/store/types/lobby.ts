import { Game, Play } from "./game";

export interface Tournament {
  id: string;
  name: string;
  game: Game;
  players: number;
  maxPlayers: number;
}

export interface LobbyState {
  fetched: boolean;
  tournaments: Tournament[];
  ongoingPlays: Play[];
}

export const NULL_LOBBY_STATE: LobbyState = {
  fetched: false,
  tournaments: [],
  ongoingPlays: [],
};
