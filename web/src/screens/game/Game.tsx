import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectGameData, selectMessage } from "../../store/selectors";
import { updateMessage, sendMessage, makeMove } from "../../store/actions";

import "./Game.css";
import ValidatedChessboard from "./ValidatedChessboard";

interface IProps {
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
      <ValidatedChessboard />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    board: selectGameData(state),
    message: selectMessage(state),
  };
};

const mapDispatchToProps = { updateMessage, sendMessage };

export default connect(mapStateToProps, mapDispatchToProps)(Game);
