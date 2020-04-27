import { put, call, take } from "redux-saga/effects";
import { changeScreen, EXIT_GAME } from "../actions";
import { LoaderStep, Play, ScreenState } from "../types";
import { sleep } from "./utils";
import { generateFens } from "./api/fake/fake";

export default function* game(token: string, play: Play) {
  yield put(changeScreen(ScreenState.GAME, LoaderStep.INACTIVE));

  yield generateFens();

  yield take(EXIT_GAME);
}
