import { combineReducers } from "redux";
import { State, ScreenState, LoaderStep, NULL_USER } from "../types";
import {
  ChangeScreenAction,
  CHANGE_SCREEN,
  UpdateLoginErrorAction as UpdateErrorAction,
  UPDATE_ERROR,
  SetUserAction,
  SET_USER,
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

function error(state = "", action: UpdateErrorAction) {
  return action.type == UPDATE_ERROR ? action.error : state;
}

function user(state = NULL_USER, action: SetUserAction) {
  return action.type == SET_USER ? action.user : state;
}

export default combineReducers<State>({
  screen,
  loader,
  error,
  user,
  game,
  lobby,
});
