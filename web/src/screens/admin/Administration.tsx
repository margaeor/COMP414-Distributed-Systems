import React, { useState } from "react";
import "./Administration.css";
import { connect } from "react-redux";
import { State, User, Game } from "../../store/types";
import { createTournament, changePrivileges } from "../../store/actions";
import { selectError, selectUser } from "../../store/selectors";

interface IProps {
  createTournament: typeof createTournament;
  changePrivileges: typeof changePrivileges;
  error: string;
  user: User;
}

const Promotion = ({
  isAdmin,
  submitChange,
}: {
  isAdmin: boolean;
  submitChange: typeof changePrivileges;
}) => {
  const [username, setUsername] = useState("");
  const [officer, setOfficer] = useState(false);
  const [admin, setAdmin] = useState(false);

  return (
    <div className="promotion">
      <span className="header">Change User Privileges</span>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <ul className="roles">
        <li>
          <input
            id="admin"
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          <label htmlFor="admin">Admin</label>
        </li>
        <li>
          <input
            id="officer"
            type="checkbox"
            checked={officer}
            onChange={(e) => setOfficer(e.target.checked)}
          />
          <label htmlFor="officer">Officer</label>
        </li>
      </ul>
      <button
        disabled={!isAdmin}
        onClick={(e) => submitChange(username, admin, officer)}
      >
        Submit
      </button>
    </div>
  );
};

const Tournament = ({
  isOfficer,
  submitTournament,
}: {
  isOfficer: boolean;
  submitTournament: typeof createTournament;
}) => {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [game, setGame] = useState(Game.CHESS);

  const updatePlayers = (n: string) => {
    if (!isNaN(parseInt(n))) setPlayers(n);
  };

  return (
    <div className="tournamentCreation">
      <span className="header">Create Tournament</span>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Max Players"
        value={players}
        onChange={(e) => updatePlayers(e.target.value)}
      />
      <ul className="games">
        <li>
          <input
            id="chess"
            type="radio"
            checked={game === Game.CHESS}
            onChange={(e) => setGame(Game.CHESS)}
          />
          <label htmlFor="chess">Chess</label>
        </li>
        <li>
          <input
            id="tictactoe"
            type="radio"
            checked={game === Game.TICTACTOE}
            onChange={(e) => setGame(Game.TICTACTOE)}
          />
          <label htmlFor="tictactoe">Tic Tac Toe</label>
        </li>
      </ul>
      <button
        disabled={!isOfficer}
        onClick={(e) => submitTournament(name, game, parseInt(players))}
      >
        Submit
      </button>
    </div>
  );
};

const Administration = ({
  user,
  error,
  createTournament,
  changePrivileges,
}: IProps) => {
  return (
    <div className="administration">
      {error !== "" && <span className="error">{error}</span>}
      <Promotion isAdmin={user.admin} submitChange={changePrivileges} />
      <Tournament
        isOfficer={user.officer}
        submitTournament={createTournament}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: selectUser(state),
    error: selectError(state),
  };
};

const mapDispatchToProps = {
  createTournament,
  changePrivileges,
};

export default connect(mapStateToProps, mapDispatchToProps)(Administration);
