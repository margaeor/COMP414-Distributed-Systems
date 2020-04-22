import { put } from "redux-saga/effects";
import {
  changeScreen,
  setPlay,
  updateLobby,
  updateLoginData,
  updateLoginStep,
  updatePlayData,
} from "../actions";
import { Game, LoaderStep, LoginStep, PlayStep, ScreenState } from "../types";
import login from "./login";

export default function* joinFakeGame() {
  document.cookie = "refresh=; SameSite=Strict";

  yield put(
    setPlay({
      id: "1234",
      game: Game.CHESS,
      opponent: "john",
      started: false,
      won: false,
    })
  );
  yield put(
    updatePlayData(PlayStep.ONGOING, {
      board: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2;;w",
    })
  );
}
