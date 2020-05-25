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
import {
  isTournamentPlay,
  Play,
  State,
  User,
  Game as GameType,
} from "../../store/types";
import ChessGame from "./chess";
import TicTacToe from "./TicTacToe";

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
        <div className="chat__history-container">
          <p className="chat__history">{history}</p>
        </div>
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
      {play.game === GameType.CHESS && <ChessGame />}
      {play.game === GameType.TICTACTOE && <TicTacToe />}
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
