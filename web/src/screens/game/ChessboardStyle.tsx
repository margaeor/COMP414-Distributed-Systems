import { ShortMove, Square, ChessInstance } from "chess.js";

const ACTIVE_SQUARE_STYLE = { backgroundColor: "rgba(255, 255, 0, 0.4)" };
const POSSIBLE_SQUARE_STYLE = {
  background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
  borderRadius: "50%",
};

export const BOARD_STYLE = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
};

export const styleActiveSquares = (
  chess: ChessInstance,
  pieceSquare: Square | ""
) => {
  const history = chess.history({ verbose: true });
  const move = history && history[history.length - 1];
  const sourceSquare = move && move.from;
  const targetSquare = move && move.to;

  return {
    ...(pieceSquare && { [pieceSquare]: ACTIVE_SQUARE_STYLE }),
    ...(sourceSquare && { [sourceSquare]: ACTIVE_SQUARE_STYLE }),
    ...(targetSquare && { [targetSquare]: ACTIVE_SQUARE_STYLE }),
  };
};

export const styleDropSquare = (square: Square) => {
  return {
    dropSquareStyle:
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" },
  };
};

// show possible moves
export const highlightPossibleMoves = (
  chess: ChessInstance,
  square: Square
) => {
  const possibleSquares = chess
    .moves({
      square: square,
      verbose: true,
    })
    .map((m) => m.to);

  return possibleSquares.reduce((a, c) => {
    return {
      ...a,
      ...{ [c]: POSSIBLE_SQUARE_STYLE },
    };
  }, {});
};
