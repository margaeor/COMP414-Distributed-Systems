import { put, take, fork, cancel, select, call } from "redux-saga/effects";
import { changeScreen } from "../actions";
import { ScreenState, LoaderStep } from "../types";
import { sleep } from "./utils";

export default function* administration() {
  yield put(changeScreen(ScreenState.ADMINISTRATION, LoaderStep.INACTIVE));

  yield* sleep(1000000000);
}
