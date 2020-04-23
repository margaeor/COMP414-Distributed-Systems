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
  opponent: string;
  game: Game;
  won: boolean;
  started: boolean;
}

export interface TournamentPlay extends Play {
  name: string;
}

export interface PlayState {
  play: Play;
  step: PlayStep;
  data: string;
  history: string;
  message: string;
}

// Guards
export function isTournamentPlay(play: Play): play is TournamentPlay {
  return "name" in play;
}

export const NULL_PLAY_STATE: PlayState = {
  play: {
    id: "",
    opponent: "",
    game: Game.CHESS,
    won: false,
    started: false,
  },
  step: PlayStep.ONGOING,
  data: "start;;w",
  history: "",
  message: "",
};
