import { Play, PlayData, PlayStep } from "../types";

export const SET_PLAY = "SET_PLAY";
export const UPDATE_PLAY_DATA = "UPDATE_PLAY_DATA";

export interface SetPlayAction {
  type: typeof SET_PLAY;
  play: Play;
}

export interface UpdatePlayDataAction {
  type: typeof UPDATE_PLAY_DATA;
  step: PlayStep;
  data: PlayData;
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
