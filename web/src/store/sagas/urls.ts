import { History } from "history";
import { select } from "redux-saga/effects";
import { ChangeScreenAction } from "../actions";
import { selectPlay } from "../selectors";
import { LoaderStep, ScreenState } from "../types";

/**
 * Small task that updates the url as we move around the app
 */
export function* updateUrl(
  history: History,
  { screen, loader }: ChangeScreenAction
) {
  if (loader != LoaderStep.INACTIVE) {
    history.push("/loading");
  } else {
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
      default:
        history.push("/");
        break;
    }
  }
}

/**
 * Simple function that returns the previous state from the url
 */
export function decodeUrl(
  history: History
): { screen: ScreenState; id?: string } {
  let search, id;
  switch (history.location.pathname) {
    case "/login":
      return { screen: ScreenState.LOGIN };
    case "/game":
      search = history.location.search;
      if (search.length < 4) return { screen: ScreenState.LOBBY };
      id = search.substr(3);
      return { screen: ScreenState.GAME, id };
    case "/administration":
      return { screen: ScreenState.ADMINISTRATION };
    case "/leaderboards":
      return { screen: ScreenState.LEADERBOARDS };
    default:
      return { screen: ScreenState.LOBBY };
  }
}
