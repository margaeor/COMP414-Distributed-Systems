import { put } from "redux-saga/effects";
import {
  changeScreen,
  setPlay,
  updateLobby,
  updateLoginData,
  updateLoginStep,
  updatePlayData,
} from "../actions";
import { Game, LoaderStep, LoginStep, PlayStep, ScreenState } from "../types";
import login from "./login";

export default function* joinFakeGame() {
  yield put(changeScreen(ScreenState.LOGIN, LoaderStep.INACTIVE));

  yield put(updateLoginData("bob", "1234", "Mary"));
  yield put(updateLoginStep(LoginStep.SIGN_UP, "Login Failed"));
  yield put(
    updateLobby({
      fetched: true,
      ongoingPlays: [
        {
          id: "1234",
          game: Game.CHESS,
          opponent: "john",
          started: false,
          won: false,
        },
        {
          id: "12345",
          game: Game.CHESS,
          opponent: "john",
          started: false,
          won: false,
        },
        {
          id: "123456",
          game: Game.CHESS,
          opponent: "john",
          started: false,
          won: false,
        },
      ],
      tournaments: [
        {
          id: "1234567",
          game: Game.CHESS,
          name: "Very Fun Tournament",
          players: 4,
          maxPlayers: 10,
        },
        {
          id: "12345678",
          game: Game.CHESS,
          name: "Very Fun Tournament 2",
          players: 4,
          maxPlayers: 10,
        },
        {
          id: "123456789",
          game: Game.CHESS,
          name: "Very Fun Tournament 3",
          players: 4,
          maxPlayers: 10,
        },
      ],
    })
  );

  yield put(
    setPlay({
      id: "1234",
      game: Game.CHESS,
      opponent: "john",
      started: false,
      won: false,
    })
  );
  yield put(
    updatePlayData(PlayStep.ONGOING, {
      board: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    })
  );

  yield login();
}
