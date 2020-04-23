import React, { useState } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../../store/actions";
import { selectGameData, selectHistory } from "../../store/selectors";
import { State } from "../../store/types";
import "./Game.css";
import ValidatedChessboard from "./ValidatedChessboard";

interface IProps {
  history: string;
  sendMessage: typeof sendMessage;
}

const Game = ({ history, sendMessage }: IProps) => {
  const [message, setMessage] = useState("");

  const submitMessage = () => {
    if (message === "") return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="game">
      <div className="chat">
        <textarea id="history" readOnly value={history} />
        <div className="form">
          <input
            id="chatBox"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && submitMessage()}
          />
          <button onClick={submitMessage}>Send</button>
        </div>
      </div>
      <ValidatedChessboard />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    board: selectGameData(state),
    history: selectHistory(state),
  };
};

const mapDispatchToProps = { sendMessage };

export default connect(mapStateToProps, mapDispatchToProps)(Game);