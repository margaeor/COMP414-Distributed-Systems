import { mdiSwordCross } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../../store/actions";
import {
  selectGameData,
  selectHistory,
  selectPlay,
  selectUser,
} from "../../store/selectors";
import { isTournamentPlay, Play, State, User } from "../../store/types";
import ValidatedChessboard from "./chess/ValidatedChessboard";
import ChessGame from "./chess";

interface IProps {
  user: User;
  play: Play;
  history: string;
  sendMessage: typeof sendMessage;
}

const Game = ({ user, play, history, sendMessage }: IProps) => {
  const [message, setMessage] = useState("");

  const submitMessage = () => {
    if (message === "") return;
    sendMessage(message);
    setMessage("");
  };

  // Dynamic import (code splitting)
  // const ValidatedChessboard = React.lazy(() => import("./ValidatedChessboard"));

  return (
    <div className="game">
      <div className="chat">
        <div className="play-info">
          <span className="play-info__title">
            {isTournamentPlay(play) ? play.name : "Practice Play"}
          </span>
          <div className="play-info__players">
            <span className="play-info__players__you">
              {user.username} (You)
            </span>
            <Icon path={mdiSwordCross} className="play-info__players__vs" />
            <span className="play-info__players__opponent">
              {play.opponent}
            </span>
          </div>
        </div>
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
      <ChessGame />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: selectUser(state),
    play: selectPlay(state),
    board: selectGameData(state),
    history: selectHistory(state),
  };
};

const mapDispatchToProps = { sendMessage };

export default connect(mapStateToProps, mapDispatchToProps)(Game);
