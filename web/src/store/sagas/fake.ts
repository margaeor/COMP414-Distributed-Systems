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
    })
  );
}

export function* generateFens() {
  const gen_fen = (fen: string, move: string = "") =>
    put(updatePlayData(PlayStep.ONGOING, fen + ";" + move + ";w"));

  // @ts-ignore ts(2351)
  const game = new Chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  yield gen_fen(game.fen());

  while (1) {
    const { move }: MakeMoveAction = yield take(MAKE_MOVE);
    yield* sleep(100);
    yield gen_fen(game.fen(), move);
    game.move(move);

    yield* sleep(300);

    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    yield gen_fen(game.fen(), randomMove);
    game.move(randomMove);
  }
}
