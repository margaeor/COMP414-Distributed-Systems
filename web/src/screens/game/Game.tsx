import React, { useState, Suspense } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../../store/actions";
import { selectGameData, selectHistory } from "../../store/selectors";
import { State } from "../../store/types";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

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

  // Dynamic import (code splitting)
  const ValidatedChessboard = React.lazy(() => import("./ValidatedChessboard"));

  return (
    <div className="game">
      <div className="chat">
        <textarea className="chat__history" readOnly value={history} />
        <div className="chat__form">
          <input
            className="chat__form__input"
            value={message}
            placeholder={"Message..."}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && submitMessage()}
          />
          <button className="chat__form__submit" onClick={submitMessage}>
            Send
          </button>
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
