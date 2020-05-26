import { Result } from "../api/types";
import { Chess, ChessInstance } from "chess.js";

function deStringify(data: string): ChessInstance {
  const [fen, move] = data.split(";");
  const chess = new Chess(fen);
  chess.move(move);
  return chess;
}

export function startingChessPosition() {
  return Chess().fen();
}

export function processChessMove(
  user: number,
  data: string,
  move: string
): string | null {
  const chess = deStringify(data);
  //@TODO figure out why those conditions don't work
  //if (chess.turn() === "w" && user !== 1) {console.log('error1');return null;}
  //if (chess.turn() === "b" && user !== 2) {console.log('error2s');return null;}
  const currFen = chess.fen();
  const newMove = chess.move(move);
  return newMove ? `${currFen};${newMove.san}` : null;
}

export function processChessResults(data: string): Result {
  const chess = deStringify(data);

  if (!chess.game_over()) return "ongoing";
  if (chess.in_checkmate()) return chess.turn() === "w" ? "lost" : "won";
  return "draw";
}
