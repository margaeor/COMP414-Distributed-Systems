import { call, CallEffect, put, take } from "redux-saga/effects";
import {
  loadingFailed,
  RETRY_LOADING,
  startLoading,
  updateError,
  stopLoading,
  CANCEL_LOADING,
} from "../actions";
import {
  AccessTokenError,
  ConnectionError,
  UserCancelledError,
} from "./api/errors";

export function* sleep(ms: number) {
  yield call(() => new Promise((r) => setTimeout(r, ms)));
}

export function* callApi(
  message: string,
  effect: CallEffect,
  canCancel = false
) {
  let eff;
  while (1) {
    yield put(startLoading(message));
    try {
      eff = yield effect;
      yield put(stopLoading());
      return eff;
    } catch (e) {
      if (e instanceof ConnectionError) {
        if (canCancel) {
          yield put(loadingFailed("Connection Error", undefined, true, true));
          const { type } = yield take([RETRY_LOADING, CANCEL_LOADING]);
          if (type === CANCEL_LOADING)
            throw new UserCancelledError("User cancelled");
        } else {
          yield put(loadingFailed("Connection Error"));
          yield take(RETRY_LOADING);
        }
      } else if (e instanceof AccessTokenError) {
        throw e;
      } else {
        yield put(updateError(e.message));
        throw e;
      }
    }
  }
}

export function* failLoadingAndExit(error: string, message?: string) {
  yield put(loadingFailed(error, message, false, true));
  yield take(CANCEL_LOADING);
}

export function* waitForRetry(error: string, message?: string) {
  yield put(loadingFailed(error, message, true, false));
  yield take(RETRY_LOADING);
}

export function* waitForRetryOrExit(error: string, message?: string) {
  yield put(loadingFailed(error, message, true, true));
  const act = yield take([RETRY_LOADING, CANCEL_LOADING]);
  return act.type == RETRY_LOADING;
}
