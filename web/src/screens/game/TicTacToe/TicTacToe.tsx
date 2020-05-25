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

  const over = tic.fover();

  return (
    <div className="tic-container">
      <div className="tic-tac-toe">{cells}</div>
      <div
        className="tic-container__overlay"
        style={{ visibility: over ? "visible" : "hidden" }}
      >
        <div className="game-over" style={{ display: over ? "flex" : "none" }}>
          <span className="game-over__header">Game Over</span>
          <span
            className={`game-over__result 
            ${over === color ? "game-over__result--won" : ""} ${
              over !== "-" && over !== color ? "game-over__result--lost" : ""
            }`}
          >
            {over === color ? "You Won!" : ""}
            {over !== "-" && over !== color ? "You Lost!" : ""}
            {over === "-" ? "Draw" : ""}
          </span>
          <button className="game-over__button" onClick={exitGame}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
