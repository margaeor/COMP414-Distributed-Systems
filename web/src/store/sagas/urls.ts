import { History, Location } from "history";
import { select } from "redux-saga/effects";
import { ChangeScreenAction, notifyUrlChange } from "../actions";
import { selectPlay } from "../selectors";
import { LoaderStep, ScreenState } from "../types";
import { Dispatch } from "redux";

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
  location: Location
): { screen: ScreenState; id?: string } {
  let search, id;
  switch (location.pathname) {
    case "/login":
      return { screen: ScreenState.LOGIN };
    case "/game":
      search = location.search;
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

export function* urlListener(history: History, dispatch: Dispatch) {
  history.listen((location, action) => {
    const { screen, id } = decodeUrl(location);
    dispatch(notifyUrlChange(screen, id));
  });
}
