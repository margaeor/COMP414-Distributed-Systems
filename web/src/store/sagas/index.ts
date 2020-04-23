import { Dispatch } from "redux";
import {
  call,
  fork,
  take,
  cancel,
  select,
  takeEvery,
} from "redux-saga/effects";
import { Play, LoaderStep, ScreenState } from "../types";
import joinFakeGame from "./fake";
import game from "./game";
import lobby from "./lobby";
import getAccessToken from "./login";
import { createBrowserHistory, History } from "history";
import { ChangeScreenAction, CHANGE_SCREEN } from "../actions";
import { selectPlay } from "../selectors";

/**
 * Small task that updates the url as we move around the app
 */
function* updateUrl(history: History, { screen, loader }: ChangeScreenAction) {
  if (loader != LoaderStep.INACTIVE) {
    history.push("/loading");
  } else {
    switch (screen) {
      case ScreenState.LOGIN:
        history.push("/login");
        break;
      case ScreenState.GAME:
        const { id }: Play = yield select(selectPlay);
        history.push("/game?id=" + id);
        break;
      default:
        history.push("/");
        break;
    }
  }
}

function* mainSaga(history: History) {
  yield* joinFakeGame();
  const token = yield* getAccessToken();

  switch (history.location) {
    default:
      const play: Play = yield* lobby(token);
      yield* game(token, play);
  }
}

export default function* rootSaga(dispatch: Dispatch) {
  const history = createBrowserHistory();
  yield takeEvery(CHANGE_SCREEN, (a) =>
    updateUrl(history, a as ChangeScreenAction)
  );

  while (1) {
    yield* mainSaga(history);
  }
}
