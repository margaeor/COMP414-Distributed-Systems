import Chess, { ChessInstance, Square } from "chess.js";
import Chessboard from "chessboardjsx";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { makeMove } from "../../store/actions";
import { selectGameData } from "../../store/selectors";
import { State } from "../../store/types";
import {
  DROP_SQUARE_STYLE,
  highlightPossibleMoves,
  styleActiveSquares,
  LIGHT_SQUARE_STYLE,
  DARK_SQUARE_STYLE,
} from "./ChessboardStyle";

interface IProps {
  game: ChessInstance;
  color: "b" | "w";
  makeMove: (board: string) => void;
}

const ValidatedChessboard = ({ game, color, makeMove }: IProps) => {
  const NO_PROMOTION = {
    has: false,
    from: "e1" as Square,
    to: "e1" as Square,
  };
  const [promotion, setPromotion] = useState(NO_PROMOTION);

  const [pieceSquare, setPieceSquare] = useState("" as Square | "");
  const [hoverSquare, setHoverSquare] = useState("" as Square | "");

  const [position, setPosition] = useState("");
  const [serverPosition, setServerPosition] = useState("");

  const movePiece = (sourceSquare: Square, targetSquare: Square) => {
    // see if the move is legal
    // @ts-ignore ts(2351)
    const newGame: ChessInstance = new Chess(game.fen());
    let move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    // illegal move or wrong color
    if (move === null || move.color !== color || promotion.has) return false;
    else if (move.flags.includes("p")) {
      setPromotion({
        has: true,
        from: sourceSquare,
        to: targetSquare,
      });

      // Move pawn manually
      newGame.remove(sourceSquare);
      newGame.put({ color, type: "p" }, targetSquare);
      setPosition(newGame.fen());
    } else {
      setPosition(newGame.fen());
      makeMove(move.san);
    }
    return true;
  };

  const onSquareClick = (square: Square) => {
    if (pieceSquare && movePiece(pieceSquare, square)) {
      setPieceSquare("");
    } else {
      setPieceSquare(square);
    }
  };

  const onPromotion = (p: string) => {
    if (!promotion.has) return;

    // @ts-ignore ts(2351)
    const newGame = new Chess(game.fen());
    let move = newGame.move({
      from: promotion.from,
      to: promotion.to,
      promotion: p,
    });

    setPosition(newGame.fen());
    setPromotion(NO_PROMOTION);

    makeMove(move.san);
  };

  // Memoize squares
  const squareStyles = useMemo(
    () => ({
      ...(pieceSquare &&
        highlightPossibleMoves(game, pieceSquare, color, false)),
      ...(hoverSquare &&
        highlightPossibleMoves(game, hoverSquare, color, true)),
      ...styleActiveSquares(game, pieceSquare),
    }),
    [pieceSquare, hoverSquare, game]
  );

  // Update position when receiving new board
  if (serverPosition !== game.fen()) {
    setServerPosition(game.fen());
    setPosition(game.fen());
    setPromotion(NO_PROMOTION);
  }

  return (
    <div className="chess">
      <Chessboard
        width={600}
        transitionDuration={300}
        position={position}
        orientation={color === "w" ? "white" : "black"}
        onDrop={({ sourceSquare, targetSquare }) =>
          movePiece(sourceSquare, targetSquare)
        }
        onDragOverSquare={(s) => setHoverSquare("")}
        onMouseOverSquare={(s) => setHoverSquare(s)}
        lightSquareStyle={LIGHT_SQUARE_STYLE}
        darkSquareStyle={DARK_SQUARE_STYLE}
        squareStyles={squareStyles}
        dropSquareStyle={DROP_SQUARE_STYLE}
        onSquareClick={onSquareClick}
      />
      <div className="promotion-bar form">
        <button
          className="form__button"
          disabled={!promotion.has}
          onClick={(e) => onPromotion("q")}
        >
          Queen
        </button>
        <button
          className="form__button"
          disabled={!promotion.has}
          onClick={(e) => onPromotion("r")}
        >
          Rook
        </button>
        <button
          className="form__button"
          disabled={!promotion.has}
          onClick={(e) => onPromotion("b")}
        >
          Bishop
        </button>
        <button
          className="form__button"
          disabled={!promotion.has}
          onClick={(e) => onPromotion("n")}
        >
          Knight
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const dataString = selectGameData(state);
  const data = dataString.split(";");

  const board = data[0];
  const move = data[1];
  const color = data[2] as "b" | "w";

  // Recreate board from received data
  // @ts-ignore ts(2351)
  const game = new Chess(board);
  if (move != "") game.move(move);

  return {
    game,
    color,
  };
};

const mapDispatchToProps = { makeMove };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ValidatedChessboard);
