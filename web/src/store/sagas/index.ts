import { createBrowserHistory } from "history";
import { Dispatch } from "redux";
import { call, cancel, race } from "redux-saga/effects";
import { ScreenState } from "../types";
import administration from "./administration";
import { AccessTokenError } from "./api/errors";
import game from "./game";
import lobby from "./lobby";
import { getAccessToken, logout } from "./login";
import { decodeUrl, navHandler, updateUrlHandler, urlListener } from "./urls";

function* mainSaga(token: string, screen: ScreenState, id?: string) {
  switch (screen) {
    case ScreenState.ADMINISTRATION:
      yield* administration(token);
      return { screen: ScreenState.LOBBY };
    case ScreenState.GAME:
      if (id) {
        yield* game(token, id);
        return { screen: ScreenState.LOBBY };
      } // drop without id
    // fallthrough
    case ScreenState.LOGIN:
    // fallthrough
    case ScreenState.LOBBY:
    // fallthrough
    default:
      return yield* lobby(token);
  }
}

function* setupUrls(dispatch: Dispatch) {
  const history = createBrowserHistory();
  const listener = urlListener(history, dispatch);
  const handler = yield* updateUrlHandler(history);
  const { screen, id } = decodeUrl(history.location);

  return { screen, id, handler, listener };
}

export default function* rootSaga(dispatch: Dispatch) {
  let { listener, handler, screen, id } = yield* setupUrls(dispatch);
  let token = yield* getAccessToken();

  while (1) {
    try {
      const { loop, nav } = yield race({
        loop: call(mainSaga, token, screen, id),
        nav: call(navHandler, screen === ScreenState.GAME),
      });

      if (loop) {
        screen = loop.screen;
        if (screen === ScreenState.GAME) id = loop.id;
      } else if (nav) {
        screen = nav.screen;
        if (screen === ScreenState.GAME) id = nav.id;
      }

      if (screen == ScreenState.LOGOUT) {
        yield* logout();
        screen = ScreenState.LOGIN;
        throw new AccessTokenError("User logged out");
      }
    } catch (e) {
      if (e instanceof AccessTokenError) {
        token = yield* getAccessToken();
      }
    }
  }

  listener();
  yield cancel(handler);
}
