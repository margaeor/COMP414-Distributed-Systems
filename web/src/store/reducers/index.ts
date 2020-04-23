import { combineReducers } from "redux";
import { State, ScreenState, LoaderStep } from "../types";
import {
  ChangeScreenAction,
  CHANGE_SCREEN,
  UpdateLoginErrorAction,
  UPDATE_LOGIN_ERROR,
} from "../actions";
import game from "./game";
import lobby from "./lobby";

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
  action: ChangeScreenAction
): LoaderStep {
  if (action.type == CHANGE_SCREEN) {
    return action.loader;
  }
  return state;
}

function loginError(state = "", action: UpdateLoginErrorAction) {
  return action.type == UPDATE_LOGIN_ERROR ? action.error : state;
}

export default combineReducers<State>({
  screen,
  loader,
  loginError,
  game,
  lobby,
});
