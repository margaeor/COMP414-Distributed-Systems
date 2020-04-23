import Chess from "chess.js";
import { put, take, call } from "redux-saga/effects";
import { MakeMoveAction, MAKE_MOVE, setPlay, updatePlayData } from "../actions";
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

  // @ts-ignore ts(2351)
  const game = new Chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  while (1) {
    yield gen_fen(game.fen());
    const { move }: MakeMoveAction = yield take(MAKE_MOVE);
    game.move(move);
    yield gen_fen(game.fen());

    // yield call(sleep, 200);

    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    yield gen_fen(game.fen());
  }
}
