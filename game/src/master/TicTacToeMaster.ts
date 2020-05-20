import { Result } from "../api/types";

import { TicTacToe } from "./tic_tac_toe.js";

function deStringify(data: string) {
  const [fen, move] = data.split(";");
  const tic_tac_toe = new TicTacToe(fen);
  tic_tac_toe.move(move);
  return tic_tac_toe;
}

export function startingChessPosition() {
  return TicTacToe().fen();
}

export function processChessMove(
  user: number,
  data: string,
  move: string
): string | null {
  const tic_tac_toe = deStringify(data);
  //@TODO figure out why those conditions don't work
  //if (chess.turn() === "w" && user !== 1) {console.log('error1');return null;} 
  //if (chess.turn() === "b" && user !== 2) {console.log('error2s');return null;}
  const newMove = tic_tac_toe.move(move);
  return newMove ? tic_tac_toe.fen() : null;
}

export function processChessResults(data: string): Result {
  const tic_tac_toe = deStringify(data);
  
  var is_over = tic_tac_toe.hasGameEnded();
  if (is_over == 0) return "ongoing";
  return is_over == 1 ? "won" : "lost";
}
