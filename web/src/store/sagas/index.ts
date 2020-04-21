import { Dispatch } from "redux";
import { call, fork, take, cancel } from "redux-saga/effects";
import { Play } from "../types";
import joinFakeGame from "./fake";
import game from "./game";
import lobby from "./lobby";
import getAccessToken from "./login";

function* mainSaga() {
  yield* joinFakeGame();

  const token = yield* getAccessToken();
  const play: Play = yield* lobby(token);
  yield* game(token, play);
}

function* mainSagaLoop() {
  while (1) {
    yield* mainSaga();
  }
}

export default function* rootSaga(dispatch: Dispatch) {
  const loop = yield fork(mainSagaLoop);
}
