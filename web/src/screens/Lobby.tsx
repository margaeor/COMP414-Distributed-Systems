import {
  mdiAccount,
  mdiChessBishop,
  mdiChessKing,
  mdiChessKnight,
  mdiChessPawn,
  mdiChessRook,
  mdiPound,
  mdiGamepadSquare,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { joinGame, joinQuickPlay, joinTournament } from "../store/actions";
import {
  selectOngoingPlays,
  selectScores,
  selectTournaments,
  selectUser,
} from "../store/selectors";
import {
  FinishedPracticePlay,
  FinishedTournament,
  Game,
  isTournament,
  Play,
  ResultType,
  State,
  Tournament,
  User,
  isPlay,
  TournamentPlay,
  isTournamentPlay,
} from "../store/types";

interface IProps {
  user: User;
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
    <li className="list-node">
      <span className="list-node__name">{sr.name}</span>
      <span className="list-node__tertiary">
        {sr.game == Game.CHESS && (
          <Icon path={pickChessTour(sr)} className="list-node__icon" />
        )}
        {sr.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="list-node__icon" />
        )}
        {sr.ranking} in
        {sr.game == Game.CHESS ? " Chess " : ""}
        {sr.game == Game.TICTACTOE ? " Tic Tac Toe " : ""}
        <Icon path={mdiAccount} className="list-node__icon" />
        {sr.players}/{sr.maxPlayers}
      </span>
    </li>
  ) : (
    <li className="list-node">
      <span className="list-node__name">Play with: {sr.opponent}</span>
      <span className="list-node__tertiary">
        {sr.game == Game.CHESS && (
          <Icon path={pickChessPractice(sr)} className="list-node__icon" />
        )}
        {sr.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="list-node__icon" />
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

const TournamentJoin = ({
  t,
  join,
}: {
  t: Tournament;
  join: typeof joinTournament;
}) => {
  return (
    <li className="list-node">
      <span className="list-node__name">{t.name}</span>
      <span className="list-node__tertiary">
        {t.game == Game.CHESS && (
          <Icon path={mdiChessPawn} className="list-node__icon" />
        )}
        {t.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="list-node__icon" />
        )}
        {t.game == Game.CHESS ? " Chess " : ""}
        {t.game == Game.TICTACTOE ? " Tic Tac Toe " : ""}
        <Icon path={mdiAccount} className="list-node__icon" />
        {t.players}/{t.maxPlayers}
      </span>
      <button
        className={"list-node__button"}
        onClick={() => join(t.id)}
        disabled={t.joined}
      >
        {t.joined ? "Already Joined" : "Join"}
      </button>
    </li>
  );
};

const PlayJoin = ({
  p,
  join,
}: {
  p: Play | TournamentPlay;
  join: typeof joinGame;
}) => {
  return (
    <li className="list-node">
      <span className="list-node__name">
        {p.started ? "Resume" : "Play"} with {p.opponent}
      </span>
      <span className="list-node__tertiary">
        {p.game == Game.CHESS && (
          <Icon path={mdiChessPawn} className="list-node__icon" />
        )}
        {p.game == Game.TICTACTOE && (
          <Icon path={mdiPound} className="list-node__icon" />
        )}
        {p.game == Game.CHESS ? " Chess" : ""}
        {p.game == Game.TICTACTOE ? " Tic Tac Toe" : ""}
        {isTournamentPlay(p) ? `, ${p.name}` : ""}
      </span>
      <button className={"list-node__button"} onClick={() => join(p.id)}>
        {p.started ? "Continue" : "Join"}
      </button>
    </li>
  );
};

const Lobby: React.FunctionComponent<IProps> = (props) => {
  const calcStats = useMemo(() => {
    const s = props.scores.filter((p) => isPlay(p)) as FinishedPracticePlay[];
    const w = s.filter((p) => p.result === ResultType.WON).length;
    const l = s.filter((p) => p.result === ResultType.LOST).length;
    const d = s.filter((p) => p.result === ResultType.DRAW).length;
    return "W: " + w + " L: " + l + " D: " + d;
  }, [props.scores]);

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

        <div className="user-panel">
          <span className="user-panel__username">{props.user.username}</span>
          <Icon path={mdiGamepadSquare} className="user-panel__icon" />
          <span className="user-panel__stats">{calcStats}</span>
        </div>
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
              <TournamentJoin key={t.id} t={t} join={props.joinTournament} />
            ))}
          </ul>
        </div>
        <div className="player-info__col plays">
          <span className="player-info__col__label">Ongoing Matches</span>
          <ul className="player-info__col__list">
            {props.plays.map((p) => (
              <PlayJoin key={p.id} p={p} join={props.joinGame} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: selectUser(state),
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
