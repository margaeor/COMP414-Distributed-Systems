import { combineReducers } from "redux";
import { State, ScreenState, LoaderStep } from "../types";
import { ChangeScreenAction, CHANGE_SCREEN } from "../actions";
import game from "./game";
import lobby from "./lobby";
import login from "./login";

function screen(
  state = ScreenState.INITIAL,
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

export default combineReducers<State>({
  screen,
  loader,
  game,
  lobby,
  login,
});
