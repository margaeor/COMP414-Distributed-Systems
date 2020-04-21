import React from "react";
import "./Lobby.css";
import { connect } from "react-redux";
import { State, Play, Tournament, Game } from "../../store/types";
import {
  selectLobbyDataFetched,
  selectOngoingPlays,
  selectTournaments,
} from "../../store/selectors";
import { joinGame, joinTournament, joinQuickPlay } from "../../store/actions";
interface IProps {
  fetched: boolean;
  plays: Play[];
  tournaments: Tournament[];
  joinGame: (a: string) => void;
  joinTournament: (a: string) => void;
  joinQuickPlay: (a: Game) => void;
}

const Lobby: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="lobby">
      <div className="quickPlay">
        <span>Quick Play</span>
        <button onClick={(e) => props.joinQuickPlay(Game.CHESS)}>Chess</button>
        <button onClick={(e) => props.joinQuickPlay(Game.TICTACTOE)}>
          Tic Tac Toe
        </button>
      </div>
      <div className="tournamentPlay">
        <span>Tournaments</span>
        <ul className="tournamentList">
          {props.tournaments.map((t) => (
            <li>
              <span>{`${t.players}/${t.maxPlayers} ${t.name}`}</span>
              <button onClick={(e) => props.joinTournament(t.id)}>Join</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="currentPlays">
        <span>Ongoing Matches</span>
        <ul className="playList">
          {props.plays.map((p) => (
            <li>
              <span>{`Opponent: ${p.opponent} ${
                p.started ? "Started" : ""
              }`}</span>
              <button onClick={(e) => props.joinGame(p.id)}>Join</button>
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

const mapDispatchToProps = {
  joinGame,
  joinTournament,
  joinQuickPlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
