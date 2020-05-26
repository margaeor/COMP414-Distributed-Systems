import { History, Location } from "history";
import { Dispatch } from "redux";
import { select, take, takeLatest } from "redux-saga/effects";
import {
  CHANGE_SCREEN,
  LOADING_FAILED,
  notifyUrlChange,
  NOTIFY_URL_CHANGE,
  START_LOADING,
  STOP_LOADING,
} from "../actions";
import { GO_ADMIN, GO_HOME, GO_LEADERBOARD, LOGOUT } from "../actions/header";
import { selectPlay, selectScreen } from "../selectors";
import { ScreenState } from "../types";

/**
 * Small task that updates the url as we move around the app
 */
export function* updateUrl(history: History) {
  // Run a check on if the URL is already correct (the user pressed back)
  // to prevent overwriting it.
  const { screen: currScreen } = decodeUrl(history.location);
  const screen = yield select(selectScreen);
  if (screen === currScreen) return;

  let id;
  switch (screen) {
    case ScreenState.LOGIN:
      history.push("/login");
      break;
    case ScreenState.GAME:
      id = (yield select(selectPlay)).id;
      history.push("/game?id=" + id);
      break;
    case ScreenState.ADMINISTRATION:
      history.push("/administration");
      break;
    case ScreenState.LEADERBOARDS:
      history.push("/leaderboards");
      break;
    case ScreenState.LOGOUT:
      history.push("/logout");
      break;
    default:
      history.push("/");
      break;
  }
}

export function* updateUrlHandler(history: History) {
  return yield takeLatest(CHANGE_SCREEN, updateUrl, history);
}

/**
 * Simple function that returns the previous state from the url
 */
export function decodeUrl(
  location: Location
): { screen: ScreenState; id?: string } {
  let search, id;
  switch (location.pathname) {
    case "/login":
      return { screen: ScreenState.LOGIN };
    case "/game":
      search = location.search;
      if (search.length < 4) return { screen: ScreenState.LOBBY };
      id = search.substr(4);
      console.log(id);
      return { screen: ScreenState.GAME, id };
    case "/administration":
      return { screen: ScreenState.ADMINISTRATION };
    case "/leaderboards":
      return { screen: ScreenState.LEADERBOARDS };
    case "/logout":
      return { screen: ScreenState.LOGOUT };
    default:
      return { screen: ScreenState.LOBBY };
  }
}

export function urlListener(history: History, dispatch: Dispatch) {
  return history.listen((location, action) => {
    if (action === "PUSH") return;
    const { screen, id } = decodeUrl(location);
    dispatch(notifyUrlChange(screen, id));
  });
}

export function* navHandler(inGame: boolean) {
  let act, c;
  do {
    act = yield take([
      GO_HOME,
      GO_ADMIN,
      GO_LEADERBOARD,
      LOGOUT,
      NOTIFY_URL_CHANGE,
    ]);

    if (inGame) {
      c = confirm("You are currently in game, are you sure?");
    } else {
      c = true;
    }
  } while (!c);

  switch (act.type) {
    case GO_HOME:
      return { screen: ScreenState.LOBBY };
    case GO_ADMIN:
      return { screen: ScreenState.ADMINISTRATION };
    case GO_LEADERBOARD:
      return { screen: ScreenState.LEADERBOARDS };
    case LOGOUT:
      return { screen: ScreenState.LOGOUT };
    case NOTIFY_URL_CHANGE:
      return { screen: act.screen, id: act.id };
  }
}
