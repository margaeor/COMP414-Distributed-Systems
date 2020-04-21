import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectBoard } from "../../store/selectors";
import Chessboard from "chessboardjsx";

import "./Game.css";

const Game = ({ board }: { board: string }) => {
  return (
    <div className="game">
      <div className="chat">
        <textarea id="history" readOnly />
        <div className="form">
          <textarea id="chatBox" readOnly />
          <button type="button">Send</button>
        </div>
      </div>
      <Chessboard position={board} />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    board: selectBoard(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
