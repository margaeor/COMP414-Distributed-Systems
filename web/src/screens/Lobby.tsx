import {
  mdiAccount,
  mdiChessBishop,
  mdiChessKing,
  mdiChessKnight,
  mdiChessPawn,
  mdiChessRook,
  mdiGamepadSquare,
  mdiPound,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import {
  joinGame,
  joinQuickPlay,
  joinTournament,
  startTournament,
} from "../store/actions";
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
  isPlay,
  isTournament,
  isTournamentPlay,
  Play,
  ResultType,
  State,
  Tournament,
  TournamentPlay,
  User,
} from "../store/types";

interface IProps {
  user: User;
  plays: Play[];
  tournaments: Tournament[];
  scores: (FinishedTournament | FinishedPracticePlay)[];
  joinGame: typeof joinGame;
  startTournament: typeof startTournament;
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
      <div className="tournament-results">
        {sr.leaderboard.map((p, i) => (
          <div className="tournament-results__player" key={p.user}>
            <span className="tournament-results__player__num">{i + 1}:</span>
            <span className="tournament-results__player__user">{p.user}</span>
            <div className="tournament-results__player__glue" />
            <span className="tournament-results__player__stats">{`${p.wins}/${p.losses}`}</span>
          </div>
        ))}
      </div>
      <ul className="player-info__col__list">
        {sr.plays.map((p: any, i) => {
          return (
            <li className="list-node" key={p.id}>
              <span className="list-node__name">
                {p.player1} vs {p.player2}:
              </span>
              <span className="list-node__tertiary">
                Round {p.round}, Score{" "}
                {p.result == ResultType.WON
                  ? "1"
                  : p.result == ResultType.LOST
                  ? "0"
                  : "1/2"}
                -
                {p.result == ResultType.LOST
                  ? "1"
                  : p.result == ResultType.WON
                  ? "0"
                  : "1/2"}
              </span>
            </li>
          );
        })}
      </ul>
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
      <span className="list-node__tertiary">
        Date:{" "}
        {`${sr.date.getDate()}/${
          sr.date.getMonth() + 1
        } ${sr.date.getHours()}:${
          sr.date.getMinutes() < 10
            ? "0" + sr.date.getMinutes()
            : sr.date.getMinutes()
        }`}
      </span>
    </li>
  );
};

const TournamentJoin = ({
  t,
  isOfficial,
  join,
  start,
}: {
  t: Tournament;
  isOfficial: boolean;
  join: typeof joinTournament;
  start: typeof startTournament;
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
        disabled={t.joined || t.players === t.maxPlayers}
      >
        {!t.joined && t.players < t.maxPlayers && "Join"}
        {t.joined && "Already Joined"}
        {t.players === t.maxPlayers && !t.joined && "Full"}
      </button>
      {isOfficial && (
        <button
          className={"list-node__button"}
          onClick={() => start(t.id)}
          disabled={t.started || t.players < 4}
        >
          {!t.started && t.players >= 4 && "Start"}
          {t.started && "Started"}
          {t.players < 4 && "Not enough players"}
        </button>
      )}
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
        {p.started
          ? "Resume"
          : isTournamentPlay(p)
          ? "Tournament Round"
          : "Practice"}{" "}
        with {p.opponent}
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
        {` at ${p.date.getHours()}:${
          p.date.getMinutes() < 10
            ? "0" + p.date.getMinutes()
            : p.date.getMinutes()
        } ${p.date.getDate()}/${p.date.getMonth() + 1}`}
      </span>
      {isTournamentPlay(p) && (
        <span className="list-node__tertiary">
          {`Round ${p.round}, ${p.name}`}
        </span>
      )}
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
            {props.scores.map((t) => {
              return <Score sr={t} key={t.id} />;
            })}
          </ul>
        </div>
        <div className="player-info__col tournaments">
          <span className="player-info__col__label">Tournaments</span>
          <ul className="player-info__col__list">
            {props.tournaments.map((t) => (
              <TournamentJoin
                key={t.id}
                t={t}
                isOfficial={props.user.officer}
                join={props.joinTournament}
                start={props.startTournament}
              />
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
  startTournament,
  joinTournament,
  joinQuickPlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
