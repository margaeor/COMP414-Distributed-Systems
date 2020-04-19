export enum Game {
  CHESS,
  TICTACTOE,
}

export interface Play {
  id: string;
  opponent: string;
  game: Game;
  won?: boolean;
  started: boolean;
}

export interface TournamentPlay extends Play {
  name: string;
}

export interface PlayState {
  play: Play;
}

// Guards
export function isTournamentPlay(play: Play): play is TournamentPlay {
  return "name" in play;
}
