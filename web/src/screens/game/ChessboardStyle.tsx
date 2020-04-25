import { ChessInstance, Square } from "chess.js";
// @ts-ignore
import colors from "./ChessboardStyle.scss";

const ACTIVE_SQUARE_STYLE = { backgroundColor: colors.activeSquare };
export const DROP_SQUARE_STYLE = {
  boxShadow: "inset 0 0 1px 4px" + colors.activeSquare,
};
const POSSIBLE_SQUARE_STYLE = {
  background:
    "radial-gradient(circle, " +
    colors.possibleSquare +
    " 36%, transparent 40%)",
  borderRadius: "50%",
};

const ACTIVE_SQUARE_POSSIBLE_STYLE = {
  background:
    "radial-gradient(circle, " +
    colors.activeSquarePossible +
    " 36%, transparent 40%)",
  borderRadius: "50%",
};

export const DARK_SQUARE_STYLE = { backgroundColor: colors.darkSquare };
export const LIGHT_SQUARE_STYLE = { backgroundColor: colors.lightSquare };

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
  square: Square,
  color: "b" | "w",
  hover: boolean
) => {
  const possibleSquares = chess
    .moves({
      square: square,
      verbose: true,
    })
    .filter((m) => m.color === color)
    .map((m) => m.to);

  return possibleSquares.reduce((a, c) => {
    return {
      ...a,
      ...{ [c]: hover ? POSSIBLE_SQUARE_STYLE : ACTIVE_SQUARE_POSSIBLE_STYLE },
    };
  }, {});
};
