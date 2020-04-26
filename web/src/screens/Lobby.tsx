import React from "react";
import { connect } from "react-redux";
import { joinGame, joinQuickPlay, joinTournament } from "../store/actions";
import {
  selectOngoingPlays,
  selectTournaments,
  selectScores,
} from "../store/selectors";
import {
  FinishedPracticePlay,
  FinishedTournament,
  Game,
  isTournament,
  Play,
  State,
  Tournament,
  ResultType,
} from "../store/types";
import Icon from "@mdi/react";
import {
  mdiChessPawn,
  mdiPound,
  mdiChessKing,
  mdiChessKnight,
  mdiChessBishop,
  mdiChessRook,
  mdiAccount,
} from "@mdi/js";

interface IProps {
  plays: Play[];
  tournaments: Tournament[];
  scores: (FinishedTournament | FinishedPracticePlay)[];
  joinGame: typeof joinGame;
  joinTournament: typeof joinTournament;
  joinQuickPlay: typeof joinQuickPlay;
}

const Score = ({ sr }: { sr: FinishedTournament | FinishedPracticePlay }) => {
  const pickChessTour = (t: FinishedTournament) => {
    switch (t.ranking) {
      case 1:
        return mdiChessKing;
      case 2:
        return mdiChessRook;
      case 3:
        return mdiChessBishop;
      case 4:
        return mdiChessKnight;
      default:
        return mdiChessPawn;
    }
  };

  const pickChessPractice = (p: FinishedPracticePlay) => {
    switch (p.result) {
      case ResultType.WON:
        return mdiChessKing;
      case ResultType.DRAW:
        return mdiChessKnight;
      default:
        return mdiChessPawn;
    }
  };

  return isTournament(sr) ? (
    <li className="score-node">
      <span className="score-node__name">{sr.name}</span>
      <span className="score-node__tertiary">
        {sr.game == Game.CHESS && (
          <Icon path={pickChessTour(sr)} className="score-node__icon" />
        )}
        {sr.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="score-node__icon" />
        )}
        {sr.ranking} in
        {sr.game == Game.CHESS ? " Chess " : ""}
        {sr.game == Game.TICTACTOE ? " Tic Tac Toe " : ""}
        <Icon path={mdiAccount} className="score-node__icon" />
        {sr.players}/{sr.maxPlayers}
      </span>
    </li>
  ) : (
    <li className="score-node">
      <span className="score-node__name">Quick Play with: {sr.opponent}</span>
      <span className="score-node__tertiary">
        {sr.game == Game.CHESS && (
          <Icon path={pickChessPractice(sr)} className="score-node__icon" />
        )}
        {sr.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="score-node__icon" />
        )}
        {sr.result == ResultType.WON ? "Won" : ""}
        {sr.result == ResultType.LOST ? "Lost" : ""}
        {sr.result == ResultType.DRAW ? "Draw" : ""} in
        {sr.game == Game.CHESS ? " Chess " : ""}
        {sr.game == Game.TICTACTOE ? " Tic Tac Toe " : ""}
      </span>
    </li>
  );
};

const Lobby: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="lobby">
      <div className="lobby__header">
        <span className="lobby__header__label">Quick Play</span>
        <button
          className="lobby__header__game"
          onClick={() => props.joinQuickPlay(Game.CHESS)}
        >
          Chess
        </button>
        <button
          className="lobby__header__game"
          onClick={() => props.joinQuickPlay(Game.TICTACTOE)}
        >
          Tic Tac Toe
        </button>
      </div>

      <div className="player-info">
        <div className="player-info__col scores">
          <span className="player-info__col__label">Scores</span>
          <ul className="player-info__col__list">
            {props.scores.map((t) => (
              <Score sr={t} key={t.id} />
            ))}
          </ul>
        </div>
        <div className="player-info__col tournaments">
          <span className="player-info__col__label">Tournaments</span>
          <ul className="player-info__col__list">
            {props.tournaments.map((t) => (
              <li key={t.id}>
                <span>{`${t.players}/${t.maxPlayers} ${t.name}`}</span>
                <button onClick={() => props.joinTournament(t.id)}>Join</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="player-info__col plays">
          <span className="player-info__col__label">Ongoing Matches</span>
          <ul className="player-info__col__list">
            {props.plays.map((p) => (
              <li key={p.id}>
                <span>{`Opponent: ${p.opponent} ${
                  p.started ? "Started" : ""
                }`}</span>
                <button onClick={() => props.joinGame(p.id)}>Join</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    scores: selectScores(state),
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
