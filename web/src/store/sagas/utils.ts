import { call } from "redux-saga/effects";

export function* sleep(ms: number) {
  yield call(() => new Promise((r) => setTimeout(r, ms)));
}
