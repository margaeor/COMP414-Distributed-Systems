import { call, put, take } from "redux-saga/effects";
import {
  changeScreen,
  FORGOT_PASSWORD,
  loadingFailed,
  LoginForgotAction,
  LoginSignUpAction,
  LoginSubmitAction,
  RETRY_LOADING,
  SIGN_UP,
  startLoading,
  SUBMIT_LOGIN,
  updateError,
} from "../actions";
import { LoaderStep, ScreenState } from "../types";
import { ConnectionError, RefreshTokenError } from "./api/errors";
import {
  changePassword,
  renewAccessToken,
  renewRefreshToken,
  signUp,
} from "./api/login";
import { callApi, sleep } from "./utils";

function* login() {
  while (1) {
    yield put(changeScreen(ScreenState.LOGIN));
    const action:
      | LoginSubmitAction
      | LoginForgotAction
      | LoginSignUpAction = yield take([
      SUBMIT_LOGIN,
      FORGOT_PASSWORD,
      SIGN_UP,
    ]);

    // Make proper api call
    try {
      switch (action.type) {
        case SUBMIT_LOGIN:
          yield* callApi(
            "Logging In...",
            call(renewRefreshToken, action.username, action.password)
          );
          break;
        case FORGOT_PASSWORD:
          yield* callApi(
            "Resetting Password...",
            call(
              changePassword,
              action.username,
              action.password,
              action.answer
            )
          );
          break;
        case SIGN_UP:
          yield* callApi(
            "Creating account...",
            call(signUp, action.username, action.password, action.answer)
          );
          break;
      }
      return;
    } catch (e) {
      updateError(e.toString());
    }
  }
}

export default function* getAccessToken() {
  while (1) {
    yield put(startLoading("Logging in..."));
    try {
      return yield call(renewAccessToken);
    } catch (e) {
      // Only complete loop for connection errors
      if (e instanceof RefreshTokenError) yield* login();
      else if (e instanceof ConnectionError) {
        yield put(loadingFailed("Connection Error"));
        yield take(RETRY_LOADING);
      } else {
        throw e;
      }
      console.error(e.toString());
    }
  }
}
