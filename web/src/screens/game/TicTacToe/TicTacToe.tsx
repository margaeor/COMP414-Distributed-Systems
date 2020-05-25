import React from "react";
import { exitGame, makeMove } from "../../../store/actions";
import ticTacToe from "./tic_tac_toe";
import Icon from "@mdi/react";
import { mdiAlphaX, mdiAlphaO } from "@mdi/js";

interface IProps {
  board: string;
  move: string;
  color: "x" | "o";
  makeMove: typeof makeMove;
  exitGame: typeof exitGame;
}

const TicTacToe = ({
  board,
  move: newMove,
  color,
  makeMove,
  exitGame,
}: IProps) => {
  const tic = ticTacToe(board);
  tic.move(newMove);

  const move = (i: number) => {
    const res = tic.fmove(i, color);

    if (res) {
      makeMove(res);
    }
  };

  const cells: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    const mark = tic.fgetSquare(i);
    const last = tic.fgetLastMove();

    cells.push(
      <div
        key={i}
        className={`cell ${last === i ? "last" : ""}`}
        data-cell={mark}
        data-color={color}
        onClick={() => move(i)}
      >
        {mark === "x" && <Icon path={mdiAlphaX} className="cell__icon" />}
        {mark === "o" && <Icon path={mdiAlphaO} className="cell__icon" />}
        {mark === "-" && color === "x" && (
          <Icon path={mdiAlphaX} className="cell__icon cell__icon--preview" />
        )}
        {mark === "-" && color === "o" && (
          <Icon path={mdiAlphaO} className="cell__icon cell__icon--preview" />
        )}
      </div>
    );
  }

  return <div className="tic-tac-toe">{cells}</div>;
};

export default TicTacToe;
