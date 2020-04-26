import { Play, PlayStep } from "../types";

export const SET_PLAY = "SET_PLAY";
export const UPDATE_PLAY_DATA = "UPDATE_PLAY_DATA";
export const MAKE_MOVE = "MAKE_MOVE";
export const UPDATE_HISTORY = "UPDATE_HISTORY";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const EXIT_GAME = "EXIT_GAME";

export interface SetPlayAction {
  type: typeof SET_PLAY;
  play: Play;
}

export interface UpdatePlayDataAction {
  type: typeof UPDATE_PLAY_DATA;
  step: PlayStep;
  data: string;
}

export interface MakeMoveAction {
  type: typeof MAKE_MOVE;
  move: string;
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  message: string;
}

export interface UpdateHistoryAction {
  type: typeof UPDATE_HISTORY;
  history: string;
}

export function setPlay(play: Play): SetPlayAction {
  return {
    type: SET_PLAY,
    play,
  };
}

export function updatePlayData(
  step: PlayStep,
  data: string
): UpdatePlayDataAction {
  return {
    type: UPDATE_PLAY_DATA,
    step,
    data,
  };
}

export function makeMove(move: string): MakeMoveAction {
  return {
    type: MAKE_MOVE,
    move,
  };
}

export function updateHistory(history: string): UpdateHistoryAction {
  return {
    type: UPDATE_HISTORY,
    history,
  };
}

export function sendMessage(message: string) {
  return {
    type: SEND_MESSAGE,
    message: message,
  };
}

export function exitGame() {
  return {
    type: EXIT_GAME,
  };
}
