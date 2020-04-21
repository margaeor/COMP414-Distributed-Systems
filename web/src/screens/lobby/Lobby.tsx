import React from "react";
import "./Lobby.css";
import { connect } from "react-redux";
import { State, Play, Tournament } from "../../store/types";
import {
  selectLobbyDataFetched,
  selectOngoingPlays,
  selectTournaments,
} from "../../store/selectors";

interface IProps {
  fetched: boolean;
  plays: Play[];
  tournaments: Tournament[];
}

const Lobby: React.FunctionComponent<IProps> = ({
  fetched,
  plays,
  tournaments,
}) => {
  return (
    <div className="lobby">
      <div className="quickPlay">
        <span>Quick Play</span>
        <button>Chess</button>
        <button>Tic Tac Toe</button>
      </div>
      <div className="tournamentPlay">
        <span>Tournaments</span>
        <ul className="tournamentList">
          {tournaments.map((t) => (
            <li>
              <span>{`${t.players}/${t.maxPlayers} ${t.name}`}</span>
              <button>Join</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="currentPlays">
        <span>Ongoing Matches</span>
        <ul className="playList">
          {plays.map((p) => (
            <li>
              <span>{`Opponent: ${p.opponent} ${
                p.started ? "Started" : ""
              }`}</span>
              <button>Join</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    fetched: selectLobbyDataFetched(state),
    plays: selectOngoingPlays(state),
    tournaments: selectTournaments(state),
  };
};

export default connect(mapStateToProps)(Lobby);
