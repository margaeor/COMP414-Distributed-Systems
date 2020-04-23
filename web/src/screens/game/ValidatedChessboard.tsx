import Chess, { ChessInstance, Square } from "chess.js";
import Chessboard, { Piece } from "chessboardjsx";
import React, { Component, CSSProperties } from "react";
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

// Stolen from https://chessboardjsx.com/integrations/move-validation
class ChessController extends Component<IPropsWithChildren, IState> {
  state = {
    dropSquareStyle: DROP_SQUARE_STYLE,
    squareStyles: {},
    pieceSquare: "" as "" | Square,
    square: "" as "" | Square,
    promotion: {
      has: false,
      from: "e1" as Square,
      to: "e1" as Square,
    },
  };

  movePiece = (sourceSquare: Square | "", targetSquare: Square) => {
    if (sourceSquare == "") return false;

    // see if the move is legal
    // @ts-ignore ts(2351)
    const newGame = new Chess(this.props.game.fen());
    let move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move or wrong color
    if (move === null) return false;
    else if (move.flags.includes("p")) {
      this.setState({
        promotion: {
          has: true,
          from: sourceSquare,
          to: targetSquare,
        },
      });
    } else {
      this.props.makeMove(move.san);
    }
    return true;
  };

  onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => this.movePiece(sourceSquare, targetSquare);

  onSquareClick = (square: Square) => {
    this.setState({
      squareStyles: styleActiveSquares(this.props.game, square),
      pieceSquare: square,
    });

    let moved = this.movePiece(this.state.pieceSquare, square);

    if (moved) {
      this.setState({
        pieceSquare: "",
      });
    }
  };

  onMouseOverSquare = (square: Square) => {
    // Memoize the location of the square
    if (this.state.square === square) return;

    this.setState({
      square,
      squareStyles: {
        ...styleActiveSquares(this.props.game, this.state.pieceSquare),
        ...highlightPossibleMoves(this.props.game, square, this.props.color),
      },
    });
  };

  onSquareRightClick = (square: Square) =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } },
    });

  onPromotion = (p: Piece) => {
    const promotion = this.state.promotion;
    if (!promotion.has) return;

    // @ts-ignore ts(2351)
    let move = new Chess(this.props.game.fen()).move({
      from: promotion.from,
      to: promotion.to,
      promotion: p, // always promote to a queen for example simplicity
    });
    this.props.makeMove(move.san);
  };

  render() {
    const { dropSquareStyle, squareStyles } = this.state;

    return this.props.children({
      squareStyles,
      onMouseOverSquare: this.onMouseOverSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onSquareClick: this.onSquareClick,
      onSquareRightClick: this.onSquareRightClick,
      onPromotion: this.onPromotion,
      hasPromotion: this.state.promotion.has,
    });
  }
}

function ValidatedChessboard(props: IProps) {
  return (
    <div>
      <ChessController {...props}>
        {({
          onDrop,
          onMouseOverSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
          onPromotion,
          hasPromotion,
        }) => (
          <div>
            <Chessboard
              width={600}
              transitionDuration={300}
              position={props.game.fen()}
              orientation={props.color === "w" ? "white" : "black"}
              onDrop={onDrop}
              onMouseOverSquare={onMouseOverSquare}
              boardStyle={BOARD_STYLE}
              squareStyles={squareStyles}
              dropSquareStyle={dropSquareStyle}
              onDragOverSquare={onDragOverSquare}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
            />
            <div
              className="promotionBar"
              style={{ visibility: hasPromotion ? "visible" : "hidden" }}
            >
              <button onClick={(e) => onPromotion("q")}>Queen</button>
              <button onClick={(e) => onPromotion("r")}>Rook</button>
              <button onClick={(e) => onPromotion("b")}>Bishop</button>
              <button onClick={(e) => onPromotion("n")}>Knight</button>
            </div>
          </div>
        )}
      </ChessController>
    </div>
  );
}

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
