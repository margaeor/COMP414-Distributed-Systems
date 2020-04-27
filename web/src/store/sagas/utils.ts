import { call, CallEffect, put, take } from "redux-saga/effects";
import {
  loadingFailed,
  RETRY_LOADING,
  startLoading,
  updateError,
  stopLoading,
} from "../actions";
import { AccessTokenError, ConnectionError } from "./api/errors";

export function* sleep(ms: number) {
  yield call(() => new Promise((r) => setTimeout(r, ms)));
}

export function* callApi(message: string, effect: CallEffect) {
  let eff;
  while (1) {
    yield put(startLoading(message));
    try {
      eff = yield effect;
      yield put(stopLoading());
      return eff;
    } catch (e) {
      if (e instanceof ConnectionError) {
        yield put(loadingFailed("Connection Error"));
        yield take(RETRY_LOADING);
      } else if (e instanceof AccessTokenError) {
        throw e;
      } else {
        yield put(updateError(e.message));
        console.log("poopie");
        return;
      }
    }
  }
}
