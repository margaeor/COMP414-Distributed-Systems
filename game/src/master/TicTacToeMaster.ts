import { Result } from "../api/types";

import { TicTacToe } from "./tic_tac_toe.js";

function deStringify(data: string) {
  const [fen, move] = data.split(";");
  const tic_tac_toe = new TicTacToe(fen);
  tic_tac_toe.move(move);
  return tic_tac_toe;
}

export function startingTicPosition() {
  return TicTacToe().fen();
}

export function processTicMove(
  user: number,
  data: string,
  move: string
): string | null {
  const tic_tac_toe = deStringify(data);
  const currFen = tic_tac_toe.fen();
  const newMove = tic_tac_toe.move(move);
  return newMove ? `${currFen};${newMove}` : null;
}

export function processTicResults(data: string): Result {
  const tic_tac_toe = deStringify(data);

  var is_over = tic_tac_toe.hasGameEnded();
  if (is_over == 0) return "ongoing";
  else if(is_over == 1) return "won";
  else return is_over == 2 ? "lost" : "draw";
}
