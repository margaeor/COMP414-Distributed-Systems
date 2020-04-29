import { combineReducers } from "redux";
import { State, ScreenState, LoaderStep, NULL_USER } from "../types";
import {
  ChangeScreenAction,
  CHANGE_SCREEN,
  UpdateErrorAction,
  UPDATE_ERROR,
  SetUserAction,
  SET_USER,
  UpdateMessageAction,
  UPDATE_MESSAGE,
} from "../actions";
import game from "./game";
import lobby from "./lobby";
import {
  LOADING_FAILED,
  START_LOADING,
  STOP_LOADING,
  LoadingFailedAction,
  LoadingStartAction,
  LoadingStopAction,
} from "../actions/loader";

function screen(
  state = ScreenState.LOBBY,
  action: ChangeScreenAction
): ScreenState {
  if (action.type == CHANGE_SCREEN) {
    return action.screen;
  }
  return state;
}

function loader(
  state = LoaderStep.LOADING,
  action:
    | ChangeScreenAction
    | LoadingFailedAction
    | LoadingStartAction
    | LoadingStopAction
): LoaderStep {
  if (action.type === CHANGE_SCREEN) {
    return action.loader ? action.loader : LoaderStep.INACTIVE;
  } else if (action.type === START_LOADING) {
    return LoaderStep.LOADING;
  } else if (action.type === STOP_LOADING) {
    return LoaderStep.INACTIVE;
  } else if (action.type === LOADING_FAILED) {
    return action.canRetry
      ? action.canExit
        ? LoaderStep.FAILED_CAN_EXIT
        : LoaderStep.FAILED
      : LoaderStep.FAILED_ONLY_EXIT;
  }
  return state;
}

function error(state = "", action: UpdateErrorAction | LoadingFailedAction) {
  if (action.type === UPDATE_ERROR) {
    return action.error;
  } else if (action.type === LOADING_FAILED) {
    return action.error;
  }
  return state;
}

function message(
  state = "",
  action:
    | UpdateMessageAction
    | LoadingStartAction
    | LoadingFailedAction
    | ChangeScreenAction
) {
  if (action.type === UPDATE_MESSAGE) {
    return action.message;
  } else if (action.type === START_LOADING) {
    return action.message;
  } else if (action.type === LOADING_FAILED) {
    return action.message ? action.message : state;
  } else if (action.type === CHANGE_SCREEN) {
    return "";
  }
  return state;
}

function user(state = NULL_USER, action: SetUserAction) {
  return action.type == SET_USER ? action.user : state;
}

export default combineReducers<State>({
  screen,
  loader,
  message,
  error,
  user,
  game,
  lobby,
});
