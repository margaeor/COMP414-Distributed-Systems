import React from "react";
import { connect } from "react-redux";
import { exitGame, makeMove } from "../../../store/actions";
import { selectGameData, selectPlay } from "../../../store/selectors";
import { State } from "../../../store/types";

const mapStateToProps = (state: State) => {
  const dataString = selectGameData(state);
  const play = selectPlay(state);
  const data = dataString.split(";");

  const board = data[0];
  const move = data[1];
  const color: "w" | "b" = play.isPlayer1 ? "w" : "b";

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
)(React.lazy(() => import("./ValidatedChessboard")));
