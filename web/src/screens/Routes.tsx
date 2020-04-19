import React from "react";
import { connect } from "react-redux";

import { ScreenState, LoaderStep, State } from "../store/types";
import Login from "./Login";
import Lobby from "./Lobby";
import Loader from "./Loader";
import Game from "./Game";
import { selectScreen, selectLoader } from "../store/selectors";

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

export default connect(mapStateToProps)(Routes);
