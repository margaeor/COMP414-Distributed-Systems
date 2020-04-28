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
  if (chess.turn() === "w" && user !== 1) return null;
  if (chess.turn() === "b" && user !== 2) return null;
  const newMove = chess.move(move);
  return newMove ? chess.fen() : null;
}

export function processChessResults(data: string): Result {
  const chess = deStringify(data);

  if (!chess.game_over()) return "ongoing";
  if (chess.in_checkmate()) return chess.turn() === "w" ? "lost" : "won";
  return "draw";
}
