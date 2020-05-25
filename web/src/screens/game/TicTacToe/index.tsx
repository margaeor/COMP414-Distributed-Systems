import React from "react";
import { connect } from "react-redux";
import { exitGame, makeMove } from "../../../store/actions";
import { selectGameData, selectPlay } from "../../../store/selectors";
import { State } from "../../../store/types";

const mapStateToProps = (state: State) => {
  const board = selectGameData(state);
  const play = selectPlay(state);
  const color: "x" | "o" = play.isPlayer1 ? "x" : "o";

  return {
    board,
    color,
  };
};

const mapDispatchToProps = { makeMove, exitGame };

// Unbundle redux connection because it causes issues with lazy loading
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.lazy(() => import("./TicTacToe")));
