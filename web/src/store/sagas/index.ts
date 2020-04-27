import { createBrowserHistory } from "history";
import { Dispatch } from "redux";
import { takeLatest, race, call } from "redux-saga/effects";
import { ChangeScreenAction, CHANGE_SCREEN } from "../actions";
import { ScreenState } from "../types";
import joinFakeGame from "./api/fake/fake";
import game from "./game";
import lobby from "./lobby";
import getAccessToken from "./login";
import { decodeUrl, updateUrl, urlListener, navHandler } from "./urls";
import { AccessTokenError } from "./api/errors";

function* mainSaga(token: string, screen: ScreenState, id?: string) {
  yield* joinFakeGame();
  let act;

  switch (screen) {
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
  yield takeLatest(CHANGE_SCREEN, (a) =>
    updateUrl(history, a as ChangeScreenAction)
  );
  const { screen, id } = decodeUrl(history.location);
  return { screen, id, listener };
}

export default function* rootSaga(dispatch: Dispatch) {
  let { listener, screen, id } = yield* setupUrls(dispatch);
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
    } catch (e) {
      if (e instanceof AccessTokenError) {
        token = yield* getAccessToken();
      }
    }
  }

  listener();
}
