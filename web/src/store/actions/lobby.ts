import {
  LobbyState,
  Game,
  FinishedPracticePlay,
  FinishedTournament,
  TournamentPlay,
  Play,
  Tournament,
} from "../types";

export const UPDATE_LOBBY_DATA = "UPDATE_LOBBY_DATA";
export const UPDATE_TOURNAMENTS = "UPDATE_TOURNAMENTS";
export const UPDATE_ONGOING_PLAYS = "UPDATE_ONGOING_PLAYS";
export const UPDATE_SCORES = "UPDATE_SCORES";

export const JOIN_GAME = "JOIN_GAME";
export const START_TOURNAMENT = "START_TOURNAMENT";
export const JOIN_TOURNAMENT = "JOIN_TOURNAMENT";
export const JOIN_QUICK_PLAY = "JOIN_QUICK_PLAY";

export interface UpdateLobbyAction {
  type: typeof UPDATE_LOBBY_DATA;
  newState: LobbyState;
}

export interface UpdateScoresAction {
  type: typeof UPDATE_SCORES;
  scores: (FinishedTournament | FinishedPracticePlay)[];
}

export interface UpdateOngoingAction {
  type: typeof UPDATE_ONGOING_PLAYS;
  ongoingPlays: (Play | TournamentPlay)[];
}

export interface UpdateTournamentsAction {
  type: typeof UPDATE_TOURNAMENTS;
  tournaments: Tournament[];
}

export interface JoinGameAction {
  type: typeof JOIN_GAME;
  id: string;
}

export interface StartTournamentAction {
  type: typeof START_TOURNAMENT;
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

export function updateTournaments(
  tournaments: Tournament[]
): UpdateTournamentsAction {
  return {
    type: UPDATE_TOURNAMENTS,
    tournaments,
  };
}

export function updateOngoingPlays(
  ongoingPlays: (Play | TournamentPlay)[]
): UpdateOngoingAction {
  return {
    type: UPDATE_ONGOING_PLAYS,
    ongoingPlays,
  };
}

export function updateScores(
  scores: (FinishedTournament | FinishedPracticePlay)[]
): UpdateScoresAction {
  return {
    type: UPDATE_SCORES,
    scores,
  };
}

export function joinGame(id: string): JoinGameAction {
  return {
    type: JOIN_GAME,
    id,
  };
}

export function startTournament(id: string): StartTournamentAction {
  return {
    type: START_TOURNAMENT,
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
