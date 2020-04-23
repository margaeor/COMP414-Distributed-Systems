import Chess, { ChessInstance, Square } from "chess.js";
import Chessboard from "chessboardjsx";
import React, { CSSProperties, useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeMove } from "../../store/actions";
import { selectGameData } from "../../store/selectors";
import { State } from "../../store/types";
import {
  BOARD_STYLE,
  DROP_SQUARE_STYLE,
  highlightPossibleMoves,
  styleActiveSquares,
} from "./ChessboardStyle";
import "./ValidatedChessboard.css";

interface IState {
  dropSquareStyle: CSSProperties; // square styles for active drop square
  squareStyles: { [square in Square]?: CSSProperties }; // custom square styles
  pieceSquare: Square | ""; // square with the currently clicked piece
  square: Square | ""; // square below the cursor
  promotion: {
    has: boolean;
    from: Square;
    to: Square;
  };
}

interface IProps {
  game: ChessInstance;
  color: "b" | "w";
  makeMove: (board: string) => void;
}

interface IPropsWithChildren extends IProps {
  children: (...args: any) => JSX.Element;
}

const ValidatedChessboard = (props: IProps) => {
  const [promotion, updatePromotion] = useState({
    has: false,
    from: "e1" as Square,
    to: "e1" as Square,
  });
  const [squareStyles, updateSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState("" as Square | "");
  const [hoverSquare, setHoverSquare] = useState("" as Square | "");

  const movePiece = (sourceSquare: Square, targetSquare: Square) => {
    // see if the move is legal
    // @ts-ignore ts(2351)
    let move = new Chess(props.game.fen()).move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move or wrong color
    if (move === null) return false;
    else if (move.flags.includes("p")) {
      updatePromotion({
        has: true,
        from: sourceSquare,
        to: targetSquare,
      });
    } else {
      props.makeMove(move.san);
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
    let move = new Chess(this.props.game.fen()).move({
      from: promotion.from,
      to: promotion.to,
      promotion: p, // always promote to a queen for example simplicity
    });
    props.makeMove(move.san);
  };

  // Set up an effect to color squares
  useEffect(() => {
    updateSquareStyles({
      ...(hoverSquare &&
        highlightPossibleMoves(props.game, hoverSquare, props.color)),
      ...styleActiveSquares(props.game, pieceSquare),
    });
  }, [pieceSquare, hoverSquare, props.game]);

  return (
    <div>
      <Chessboard
        width={600}
        transitionDuration={300}
        position={props.game.fen()}
        orientation={props.color === "w" ? "white" : "black"}
        onDrop={({ sourceSquare, targetSquare }) =>
          movePiece(sourceSquare, targetSquare)
        }
        onDragOverSquare={(s) => setHoverSquare("")}
        onMouseOverSquare={(s) => setHoverSquare(s)}
        boardStyle={BOARD_STYLE}
        squareStyles={squareStyles}
        dropSquareStyle={DROP_SQUARE_STYLE}
        onSquareClick={onSquareClick}
      />
      <div
        className="promotionBar"
        style={{ visibility: promotion.has ? "visible" : "hidden" }}
      >
        <button onClick={(e) => onPromotion("q")}>Queen</button>
        <button onClick={(e) => onPromotion("r")}>Rook</button>
        <button onClick={(e) => onPromotion("b")}>Bishop</button>
        <button onClick={(e) => onPromotion("n")}>Knight</button>
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
