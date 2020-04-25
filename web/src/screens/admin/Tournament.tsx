import React, { useState } from "react";
import { createTournament } from "../../store/actions";
import { Game } from "../../store/types";

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
    <div className="tournamentCreation form">
      <span className="form__header">Create Tournament</span>
      <input
        className="form__input form__input--first"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="form__input"
        type="text"
        placeholder="Max Players"
        value={players}
        onChange={(e) => updatePlayers(e.target.value)}
      />
      <label className="form__label">Game</label>
      <div className="form__check">
        <input
          id="chess"
          type="radio"
          checked={game === Game.CHESS}
          onChange={(e) => setGame(Game.CHESS)}
        />
        <label htmlFor="chess">Chess</label>
      </div>
      <div className="form__check">
        <input
          id="tictactoe"
          type="radio"
          checked={game === Game.TICTACTOE}
          onChange={(e) => setGame(Game.TICTACTOE)}
        />
        <label htmlFor="tictactoe">Tic Tac Toe</label>
      </div>
      <button
        className="form__submit"
        disabled={!isOfficer}
        onClick={(e) => submitTournament(name, game, parseInt(players))}
      >
        Submit
      </button>
    </div>
  );
};

export default Tournament;
