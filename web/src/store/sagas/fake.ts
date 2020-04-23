import { call, put } from "redux-saga/effects";
import { setPlay, updatePlayData } from "../actions";
import { Game, PlayStep } from "../types";
import { sleep } from "./utils";

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
}

export function* generateFens() {
  const gen_fen = (fen: string) =>
    put(updatePlayData(PlayStep.ONGOING, fen + ";;w"));

  yield gen_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  yield call(sleep, 10000);
  yield gen_fen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
  yield call(sleep, 2000);
  yield gen_fen(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
  );
  yield call(sleep, 2000);
  yield gen_fen(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
  );
  yield call(sleep, 2000);
}
