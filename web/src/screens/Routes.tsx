import React from "react";
import { connect } from "react-redux";

import { ScreenState, LoaderStep, State } from "../store/types";
import Login from "./Login";
import Lobby from "./Lobby";
import Game from "./game/Game";
import Loader from "./Loader";
import { selectScreen, selectLoader } from "../store/selectors";
import Header from "./Header";

import Administration from "./admin/Administration";

const Routes = ({
  screen,
  loader,
}: {
  screen: ScreenState;
  loader: LoaderStep;
}) => {
  if (loader !== LoaderStep.INACTIVE) return <Loader />;
  switch (screen) {
    case ScreenState.LOGIN:
      return <Login />;
    case ScreenState.LOBBY:
      return <Lobby />;
    case ScreenState.GAME:
      return <Game />;
    case ScreenState.ADMINISTRATION:
      return <Administration />;
    default:
      return <Loader />;
  }
};

const mapStateToProps = (state: State) => {
  return {
    screen: selectScreen(state),
    loader: selectLoader(state),
  };
};

const ConnectedRoutes = connect(mapStateToProps)(Routes);

const Wrapper = () => {
  return (
    <div className="container">
      <Header />
      <ConnectedRoutes />
    </div>
  );
};

export default Wrapper;
