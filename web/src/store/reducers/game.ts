import {
  SetPlayAction,
  SET_PLAY,
  UpdatePlayDataAction,
  UPDATE_PLAY_DATA,
} from "../actions/game";
import { NULL_PLAY_STATE, PlayState } from "../types";

export default function game(
  state = NULL_PLAY_STATE,
  action: SetPlayAction | UpdatePlayDataAction
): PlayState {
  switch (action.type) {
    case SET_PLAY:
      return {
        ...state,
        play: action.play,
      };
    case UPDATE_PLAY_DATA:
      return {
        ...state,
        step: action.step,
        data: action.data,
      };
    default:
      return state;
  }
}
