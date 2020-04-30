import Chess from "chess.js";
import { put, take } from "redux-saga/effects";
import { MakeMoveAction, MAKE_MOVE, updatePlayData } from "../../../actions";
import { PlayStep, Game, Play, TournamentPlay } from "../../../types";
import { sleep } from "../../utils";

export const PLAY_LIST: (Play | TournamentPlay)[] = [
  {
    id: "5eab10ae431a3c00240d9063",
    game: Game.CHESS,
    isPlayer1: true,
    opponent: "vetIO",
    started: false,
  },
  {
    id: "1234",
    game: Game.CHESS,
    isPlayer1: true,
    opponent: "vetIO",
    started: true,
  },
  {
    id: "aaaa",
    game: Game.CHESS,
    isPlayer1: true,
    opponent: "bomboclaat",
    started: false,
  },
  {
    id: "2345",
    game: Game.CHESS,
    isPlayer1: true,
    name: "NFC: Recruitment Rounds IV",
    opponent: "juicy",
    started: true,
  },
  {
    id: "3456",
    game: Game.CHESS,
    isPlayer1: true,
    opponent: "juicy",
    started: false,
  },
];

export function* generateFens() {
  const color = Math.random() > 0.5 ? "w" : "b";
  const gen_fen = (fen: string, move: string = "") =>
    put(updatePlayData(PlayStep.ONGOING, fen + ";" + move + ";" + color));

  // @ts-ignore ts(2351)
  const game = new Chess();
  // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  // "rnb1k2r/ppppQppp/3P4/8/8/8/PPPPP1PP/RNB1KBNR b KQkq - 0 1"

  if (color != game.turn()) {
    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
  }

  yield gen_fen(game.fen());
  if (game.game_over()) return;

  while (1) {
    const { move }: MakeMoveAction = yield take(MAKE_MOVE);
    yield* sleep(100);
    yield gen_fen(game.fen(), move);
    game.move(move);

    yield* sleep(300);
    if (game.game_over()) break;

    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    yield gen_fen(game.fen(), randomMove);
    game.move(randomMove);

    if (game.game_over()) break;
  }
}
