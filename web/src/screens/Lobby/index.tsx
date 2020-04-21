import React from "react";
import "./style.css";

const Login: React.FunctionComponent = () => {
  return (
    <div className="container">
      <div className="quickPlay">
        <span>Quick Play</span>
        <button>Chess</button>
        <button>Tic Tac Toe</button>
      </div>
      <div className="tournamentPlay">
        <span>Tournaments</span>
        <ul id="tournamentList"></ul>
      </div>
      <div className="currentPlays">
        <span>Ongoing Matches</span>
        <ul id="ongoingPlays"></ul>
      </div>
    </div>
  );
};

export default Login;
