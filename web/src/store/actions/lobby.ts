import { LobbyState, Game } from "../types";

export const UPDATE_LOBBY_DATA = "UPDATE_LOBBY_DATA";
export const JOIN_GAME = "JOIN_GAME";
export const JOIN_TOURNAMENT = "JOIN_TOURNAMENT";
export const JOIN_QUICK_PLAY = "JOIN_QUICK_PLAY";

export interface UpdateLobbyAction {
  type: typeof UPDATE_LOBBY_DATA;
  newState: LobbyState;
}

export interface JoinGameAction {
  type: typeof JOIN_GAME;
  id: string;
}

export interface JoinTournamentAction {
  type: typeof JOIN_TOURNAMENT;
  id: string;
}

export interface JoinQuickPlayAction {
  type: typeof JOIN_QUICK_PLAY;
  game: Game;
}

export function updateLobby(newState: LobbyState): UpdateLobbyAction {
  return {
    type: UPDATE_LOBBY_DATA,
    newState,
  };
}

export function joinGame(id: string): JoinGameAction {
  return {
    type: JOIN_GAME,
    id,
  };
}

export function joinTournament(id: string): JoinTournamentAction {
  return {
    type: JOIN_TOURNAMENT,
    id,
  };
}

export function joinQuickPlay(game: Game): JoinQuickPlayAction {
  return {
    type: JOIN_QUICK_PLAY,
    game,
  };
}
