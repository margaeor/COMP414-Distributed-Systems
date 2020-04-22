import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectBoard, selectMessage } from "../../store/selectors";
import { updateMessage, sendMessage } from "../../store/actions";
import Chessboard from "chessboardjsx";

import "./Game.css";

interface IProps {
  board: string;
  message: string;
  history: string;
  updateMessage: (a: string) => void;
  sendMessage: () => void;
}

const Game = (props: IProps) => {
  return (
    <div className="game">
      <div className="chat">
        <textarea id="history" readOnly value={props.history} />
        <div className="form">
          <textarea
            id="chatBox"
            value={props.message}
            onChange={(e) => props.updateMessage(e.target.value)}
          />
          <button onClick={(e) => props.sendMessage()}>Send</button>
        </div>
      </div>
      <Chessboard position={props.board} />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    board: selectBoard(state),
    message: selectMessage(state),
  };
};

const mapDispatchToProps = { updateMessage, sendMessage };

export default connect(mapStateToProps, mapDispatchToProps)(Game);
