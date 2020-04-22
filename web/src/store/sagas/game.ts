import { put, call } from "redux-saga/effects";
import { changeScreen } from "../actions";
import { LoaderStep, Play, ScreenState } from "../types";
import { sleep } from "./utils";
import { generateFens } from "./fake";

export default function* game(token: string, play: Play) {
  yield put(changeScreen(ScreenState.GAME, LoaderStep.INACTIVE));

  yield call(generateFens);
  yield call(sleep, 1000000000);
}
