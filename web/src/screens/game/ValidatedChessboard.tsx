import Chess, { ChessInstance, Square } from "chess.js";
import Chessboard from "chessboardjsx";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { makeMove, exitGame } from "../../store/actions";
import { selectGameData } from "../../store/selectors";
import { State } from "../../store/types";
import {
  DROP_SQUARE_STYLE,
  highlightPossibleMoves,
  styleActiveSquares,
  LIGHT_SQUARE_STYLE,
  DARK_SQUARE_STYLE,
  BOARD_STYLE,
} from "./ChessboardStyle";
import Icon from "@mdi/react";
import {
  mdiChessQueen,
  mdiChessKnight,
  mdiChessBishop,
  mdiChessRook,
} from "@mdi/js";

interface IProps {
  game: ChessInstance;
  color: "b" | "w";
  makeMove: (board: string) => void;
  exitGame: typeof exitGame;
}

const ValidatedChessboard = ({ game, color, makeMove, exitGame }: IProps) => {
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
    const move = newGame.move({
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
    const move = newGame.move({
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
    () =>
      promotion.has
        ? {}
        : {
            ...(pieceSquare &&
              highlightPossibleMoves(game, pieceSquare, color, false)),
            ...(hoverSquare &&
              highlightPossibleMoves(game, hoverSquare, color, true)),
            ...styleActiveSquares(game, pieceSquare),
          },
    [pieceSquare, hoverSquare, game, promotion.has, color]
  );

  // Update position when receiving new board
  if (serverPosition !== game.fen()) {
    setServerPosition(game.fen());
    setPosition(game.fen());
    setPromotion(NO_PROMOTION);
  }

  const showOverlay = promotion.has || game.game_over();

  return (
    <div className="chess">
      <Chessboard
        width={600}
        transitionDuration={300}
        position={position}
        orientation={color === "w" ? "white" : "black"}
        boardStyle={BOARD_STYLE}
        onDrop={({ sourceSquare, targetSquare }) =>
          movePiece(sourceSquare, targetSquare)
        }
        onDragOverSquare={() => setHoverSquare("")}
        onMouseOverSquare={(s) => setHoverSquare(s)}
        lightSquareStyle={LIGHT_SQUARE_STYLE}
        darkSquareStyle={DARK_SQUARE_STYLE}
        squareStyles={squareStyles}
        dropSquareStyle={DROP_SQUARE_STYLE}
        onSquareClick={onSquareClick}
      />
      <div
        className="chess__overlay"
        style={{ visibility: showOverlay ? "visible" : "hidden" }}
      >
        <div
          className={"promotion-bar"}
          style={{ display: promotion.has ? "flex" : "none" }}
        >
          <span className="promotion-bar__header">Promotion</span>
          <button
            className="promotion-bar__button"
            onClick={() => onPromotion("q")}
          >
            <Icon
              className="promotion-bar__button__icon"
              path={mdiChessQueen}
            />
            Queen
          </button>
          <button
            className="promotion-bar__button"
            onClick={() => onPromotion("r")}
          >
            <Icon className="promotion-bar__button__icon" path={mdiChessRook} />
            Rook
          </button>
          <button
            className="promotion-bar__button"
            onClick={() => onPromotion("b")}
          >
            <Icon
              className="promotion-bar__button__icon"
              path={mdiChessBishop}
            />
            Bishop
          </button>
          <button
            className="promotion-bar__button"
            onClick={() => onPromotion("n")}
          >
            <Icon
              className="promotion-bar__button__icon"
              path={mdiChessKnight}
            />
            Knight
          </button>
        </div>
        <div
          className="game-over"
          style={{ display: game.game_over() ? "flex" : "none" }}
        >
          <span className="game-over__header">Game Over</span>
          <span
            className={`game-over__result ${
              game.in_checkmate()
                ? game.turn() == color
                  ? "game-over__result--lost"
                  : "game-over__result--won"
                : ""
            }`}
          >
            {game.in_checkmate()
              ? game.turn() == color
                ? "You Lost!"
                : "You Won!"
              : "Draw!"}
          </span>
          <span className="game-over__reason">
            {game.in_checkmate() ? "Checkmate" : ""}
            {game.in_stalemate() ? "Stalemate" : ""}
            {game.in_threefold_repetition() ? "Threefold Repetition" : ""}
            {game.insufficient_material() ? "Insufficient Material" : ""}
            {game.in_draw() && !game.insufficient_material()
              ? "50-Move Rule"
              : ""}
          </span>
          <button className="game-over__button" onClick={exitGame}>
            Exit
          </button>
        </div>
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

const mapDispatchToProps = { makeMove, exitGame };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ValidatedChessboard);
