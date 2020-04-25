import { Game, Play } from "./game";

export enum ResultType {
  DRAW = 0,
  LOST = 1,
  WON = 2,
}

export interface Tournament {
  id: string;
  name: string;
  game: Game;
  players: number;
  maxPlayers: number;
}

export interface FinishedTournament extends Tournament {
  ranking: number;
}

export interface FinishedPracticePlay extends Play {
  result: ResultType;
}

// Guards
export function isTournament(
  obj: FinishedTournament | FinishedPracticePlay
): obj is FinishedTournament {
  return "ranking" in obj;
}

export function isPlay(
  obj: FinishedTournament | FinishedPracticePlay
): obj is FinishedPracticePlay {
  return "result" in obj;
}

export interface LobbyState {
  tournaments: Tournament[];
  ongoingPlays: Play[];
  scores: (FinishedTournament | FinishedPracticePlay)[];
}

export const NULL_LOBBY_STATE: LobbyState = {
  tournaments: [],
  ongoingPlays: [],
  scores: [],
};
