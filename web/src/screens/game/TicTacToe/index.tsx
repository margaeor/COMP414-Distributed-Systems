import React from "react";
import { connect } from "react-redux";
import { exitGame, makeMove } from "../../../store/actions";
import { selectGameData, selectPlay } from "../../../store/selectors";
import { State } from "../../../store/types";

const mapStateToProps = (state: State) => {
  const data = selectGameData(state).split(";");
  const board = data[0];
  const move = data[1];
  const play = selectPlay(state);
  const color: "x" | "o" = play.isPlayer1 ? "x" : "o";

  return {
    board,
    move,
    color,
  };
};

const mapDispatchToProps = { makeMove, exitGame };

// Unbundle redux connection because it causes issues with lazy loading
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.lazy(() => import("./TicTacToe")));
