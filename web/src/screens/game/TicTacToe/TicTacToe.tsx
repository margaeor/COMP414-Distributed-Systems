import React from "react";
import { exitGame, makeMove } from "../../../store/actions";
import ticTacToe from "./tic_tac_toe";

interface IProps {
  board: string;
  color: "x" | "o";
  makeMove: typeof makeMove;
  exitGame: typeof exitGame;
}

const TicTacToe = ({ board, color, makeMove, exitGame }: IProps) => {
  const tic = ticTacToe(board);

  const move = (i: number) => {
    const res = tic.fmove(i, color);

    if (res) {
      makeMove(res);
    }
  };

  const cells: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    cells.push(
      <div
        key={i}
        className="cell"
        data-cell={tic.fgetSquare(i)}
        onClick={() => move(i)}
      />
    );
  }

  return <div className="tic-tac-toe">{cells}</div>;
};

export default TicTacToe;
