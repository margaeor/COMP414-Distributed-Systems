import { put, take, fork, cancel, select, call } from "redux-saga/effects";
import {
  changeScreen,
  FORGOT_PASSWORD,
  GO_TO_SIGN_UP,
  RETURN_TO_LOGIN,
  updateLoginStep,
  SUBMIT_LOGIN,
} from "../actions";
import { ScreenState, LoaderStep, LoginStep, LoginState } from "../types";
import { selectLoginData } from "../selectors";
import {
  renewRefreshToken,
  signUp,
  changePassword,
  renewAccessToken,
} from "./loginUtils";

function* handleModeButtons() {
  while (1) {
    const { type } = yield take([
      FORGOT_PASSWORD,
      GO_TO_SIGN_UP,
      RETURN_TO_LOGIN,
    ]);

    switch (type) {
      case FORGOT_PASSWORD:
        yield put(updateLoginStep(LoginStep.FORGOT, ""));
        break;
      case GO_TO_SIGN_UP:
        yield put(updateLoginStep(LoginStep.SIGN_UP, ""));
        break;
      case RETURN_TO_LOGIN:
        yield put(updateLoginStep(LoginStep.FORM, ""));
    }
  }
}

function* login() {
  yield put(updateLoginStep(LoginStep.FORM, ""));
  while (1) {
    // Setup login screen
    yield put(changeScreen(ScreenState.LOGIN, LoaderStep.INACTIVE));
    const buttonHandler = yield fork(handleModeButtons);
    // Wait for submit
    yield take(SUBMIT_LOGIN);
    // Setup Loader
    yield cancel(buttonHandler);
    yield put(changeScreen(ScreenState.LOGIN, LoaderStep.LOADING));
    const d: LoginState = yield select(selectLoginData);

    // Make proper api call
    try {
      switch (d.step) {
        case LoginStep.FORM:
          yield call(renewRefreshToken, d.username, d.password);
          break;
        case LoginStep.FORGOT:
          yield call(changePassword, d.username, d.password, d.answer);
          break;
        case LoginStep.SIGN_UP:
          yield call(signUp, d.username, d.password, d.answer);
          break;
      }
      return yield call(renewAccessToken);
    } catch (e) {
      updateLoginStep(d.step, e.toString());
    }
  }
}

export default function* getAccessToken() {
  for (let i = 0; i < 4; i++) {
    try {
      return yield call(renewAccessToken);
    } catch (e) {
      console.log(e.toString());
    }
  }
  return yield* login();
}
