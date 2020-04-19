import { Play, PlayData, PlayStep } from "../types";

export const SET_PLAY = "SET_PLAY";
export const UPDATE_PLAY_DATA = "UPDATE_PLAY_DATA";
export const START_MOVE = "START_MOVE";
export const MAKE_MOVE = "MAKE_MOVE";

export interface SetPlayAction {
  type: typeof SET_PLAY;
  play: Play;
}

export interface UpdatePlayDataAction {
  type: typeof UPDATE_PLAY_DATA;
  step: PlayStep;
  data: PlayData;
}

export interface StartMoveAction {
  type: typeof START_MOVE;
  move: String;
}

export interface MakeMoveAction {
  type: typeof MAKE_MOVE;
  move: String;
}

export function setPlay(play: Play): SetPlayAction {
  return {
    type: SET_PLAY,
    play,
  };
}

export function updatePlayData(
  step: PlayStep,
  data: PlayData
): UpdatePlayDataAction {
  return {
    type: UPDATE_PLAY_DATA,
    step,
    data,
  };
}

export function startMove(move: String): StartMoveAction {
  return {
    type: START_MOVE,
    move,
  };
}

export function makeMove(move: String): MakeMoveAction {
  return {
    type: MAKE_MOVE,
    move,
  };
}
