import { ChessInstance, Square } from "chess.js";
import Chess from "chess.js";
import Chessboard from "chessboardjsx";
import React, { Component, CSSProperties } from "react";
import { makeMove } from "../../store/actions";
import {
  highlightPossibleMoves,
  styleActiveSquares,
  DROP_SQUARE_STYLE,
  BOARD_STYLE,
} from "./ChessboardStyle";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectGameData } from "../../store/selectors";

interface IState {
  dropSquareStyle: CSSProperties; // square styles for active drop square
  squareStyles: { [square in Square]?: CSSProperties }; // custom square styles
  pieceSquare: Square | ""; // square with the currently clicked piece
  square: Square | ""; // square below the cursor
}

interface IProps {
  game: ChessInstance;
  color: "b" | "w";
  makeMove: (move: string) => void;
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
  };

  movePiece = (sourceSquare: Square | "", targetSquare: Square) => {
    if (sourceSquare == "") return false;

    // see if the move is legal
    let move = this.props.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move or wrong color
    if (move === null) return false;
    if (move.color !== this.props.color) {
      this.props.game.undo();
      return false;
    } else {
      this.props.makeMove(move.san);
      return true;
    }
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

    let moved;
    if ("pieceSquare" in this.state)
      moved = this.movePiece(this.state.pieceSquare, square);
  };

  onMouseOverSquare = (square: Square) => {
    // Memoize the location of the square
    if (this.state.square === square) return;

    this.setState({
      square,
      squareStyles: {
        ...styleActiveSquares(this.props.game, this.state.pieceSquare),
        ...highlightPossibleMoves(this.props.game, square),
      },
    });
  };

  onSquareRightClick = (square: Square) =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } },
    });

  render() {
    const { dropSquareStyle, squareStyles } = this.state;

    return this.props.children({
      squareStyles,
      position: this.props.game.fen(),
      onMouseOverSquare: this.onMouseOverSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onSquareClick: this.onSquareClick,
      onSquareRightClick: this.onSquareRightClick,
    });
  }
}

function ValidatedChessboard(props: IProps) {
  return (
    <div>
      <ChessController {...props}>
        {({
          position,
          onDrop,
          onMouseOverSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
        }) => (
          <Chessboard
            width={600}
            transitionDuration={300}
            position={position}
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
