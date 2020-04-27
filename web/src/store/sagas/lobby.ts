import { call, fork, put, cancel, take } from "redux-saga/effects";
import { updateLobby, changeScreen, startLoading } from "../actions";
import { LobbyState, ScreenState, LoaderStep, Game } from "../types";
import {
  fetchLobbyData,
  joinPlay,
  joinTournament,
  joinQuickGame,
  checkQuickGame,
} from "./api/lobby";
import { sleep, callApi } from "./utils";
import { JOIN_GAME, JOIN_QUICK_PLAY, JOIN_TOURNAMENT } from "../actions";

function* fetchLobby(token: string) {
  const data: LobbyState = yield call(fetchLobbyData, token);
  yield put(updateLobby(data));
}

function* periodicFetch(token: string) {
  while (1) {
    try {
      yield* fetchLobby(token);
    } catch (e) {
      console.log("fetching failed: " + e.toString());
    }
    yield* sleep(5000);
  }
}

function* quickPlay(token: string, game: Game) {
  yield* callApi("Joining Queue...", call(joinQuickGame, token, game));
  for (let i = 0; i < 10; i++) {
    try {
      return yield* callApi("Finding Opponent...", call(checkQuickGame, token));
    } catch (e) {
      console.log("opponent not found...");
    }
    yield* sleep(5000);
  }
}

export default function* lobby(token: string) {
  yield put(changeScreen(ScreenState.LOBBY));
  const fetchHandler = yield fork(periodicFetch, token);

  while (1) {
    const act = yield take([JOIN_GAME, JOIN_TOURNAMENT, JOIN_QUICK_PLAY]);
    let id;

    switch (act.type) {
      case JOIN_GAME:
        // Exit to join game
        yield cancel(fetchHandler);
        return { screen: ScreenState.GAME, id: act.id };
      case JOIN_TOURNAMENT:
        yield call(joinTournament, token, act.id);
        yield* fetchLobby(token);
        break;
      case JOIN_QUICK_PLAY:
        yield cancel(fetchHandler);
        id = yield* quickPlay(token, act.game);
        if (id) {
          return { screen: ScreenState.GAME, id };
        } else {
          return { screen: ScreenState.LOBBY };
        }
    }
  }
  return { screen: ScreenState.LOBBY };
}
