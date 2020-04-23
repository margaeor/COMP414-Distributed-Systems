import React from "react";
import { connect } from "react-redux";
import { sendMessage, updateMessage } from "../../store/actions";
import { selectGameData, selectMessage } from "../../store/selectors";
import { State } from "../../store/types";
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
