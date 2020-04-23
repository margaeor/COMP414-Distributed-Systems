import { call, fork, put, cancel, take } from "redux-saga/effects";
import { updateLobby, changeScreen } from "../actions";
import { LobbyState, ScreenState, LoaderStep } from "../types";
import {
  fetchLobbyData,
  joinPlay,
  joinTournament,
  joinQuickGame,
} from "./api/lobby";
import { sleep } from "./utils";
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

export default function* lobby(token: string) {
  yield put(changeScreen(ScreenState.LOBBY, LoaderStep.INACTIVE));
  const fetchHandler = yield fork(periodicFetch, token);

  while (1) {
    const act = yield take([JOIN_GAME, JOIN_TOURNAMENT, JOIN_QUICK_PLAY]);

    switch (act.type) {
      case JOIN_GAME:
        // Exit to join game
        yield put(changeScreen(ScreenState.LOGIN, LoaderStep.LOADING));
        yield cancel(fetchHandler);
        return yield call(joinPlay, token, act.id);
      case JOIN_TOURNAMENT:
        yield call(joinTournament, token, act.id);
        yield* fetchLobby(token);
        break;
      case JOIN_QUICK_PLAY:
        yield call(joinQuickGame, token, act.id);
        yield* fetchLobby(token);
        break;
    }
  }
}
