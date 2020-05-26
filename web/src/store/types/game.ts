export enum Game {
  CHESS,
  TICTACTOE,
}

export enum PlayStep {
  ONGOING = 0,
  FINISHED = 1,
}

export interface Play {
  id: string;
  isPlayer1: boolean;
  opponent: string;
  game: Game;
  started: boolean;
  date: Date;
}

export interface TournamentPlay extends Play {
  name: string;
  round: number;
}

export interface PlayState {
  play: Play;
  step: PlayStep;
  data: string;
  history: string;
}

// Guards
export function isTournamentPlay(play: Play): play is TournamentPlay {
  return "name" in play;
}

export const NULL_PLAY_STATE: PlayState = {
  play: {
    id: "",
    isPlayer1: true,
    opponent: "",
    game: Game.CHESS,
    started: false,
  },
  step: PlayStep.ONGOING,
  data: "start;;w",
  history: "",
};
