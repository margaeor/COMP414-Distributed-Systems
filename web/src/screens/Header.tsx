import React from "react";
import { connect } from "react-redux";
import {
  goAdmin,
  goHome,
  goLeaderboard,
  logout,
} from "../store/actions/header";
import { selectIsAuthorized } from "../store/selectors";
import { State } from "../store/types";

interface IProps {
  authorized: boolean;
  goHome: typeof goHome;
  goAdmin: typeof goAdmin;
  goLeaderboard: typeof goLeaderboard;
  logout: typeof logout;
}

const Header = ({
  authorized,
  goHome,
  goAdmin,
  goLeaderboard,
  logout,
}: IProps) => {
  return (
    <nav className="site-nav">
      <ul className="nav">
        <li className="nav__item">
          <div className="nav__item__logo" />
        </li>
        <li className="nav__item">
          <button className="nav__item__button" onClick={goHome}>
            Home
          </button>
        </li>
        <li className="nav__item">
          <button
            className="nav__item__button"
            onClick={goLeaderboard}
            disabled={!authorized}
          >
            Leaderboards
          </button>
        </li>
        <li className="nav__item">
          <button className="nav__item__button" onClick={goAdmin}>
            Admin
          </button>
        </li>
        <li className="nav__item">
          <button className="nav__item__button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

const mapStateToProps = (state: State) => {
  return {
    authorized: selectIsAuthorized(state),
  };
};

const mapDispatchToProps = {
  goHome,
  goAdmin,
  goLeaderboard,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
