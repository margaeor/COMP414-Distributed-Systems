import React from "react";

const Header = () => {
  return (
    <nav className="site-nav">
      <ul className="nav">
        <li className="nav__item">
          <div className="nav__item__logo" />
        </li>
        <li className="nav__item">
          <button className="nav__item__button">Home</button>
        </li>
        <li className="nav__item">
          <button className="nav__item__button">Leaderboards</button>
        </li>
        <li className="nav__item">
          <button className="nav__item__button">Admin</button>
        </li>
        <li className="nav__item">
          <button className="nav__item__button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
