import { put, take, fork, cancel, select, call } from "redux-saga/effects";
import {
  renewRefreshToken,
  signUp,
  changePassword,
  renewAccessToken,
} from "./api/login";
import {
  changeScreen,
  SUBMIT_LOGIN,
  FORGOT_PASSWORD,
  SIGN_UP,
  LoginSubmitAction,
  LoginForgotAction,
  LoginSignUpAction,
  updateLoginError,
} from "../actions";
import { ScreenState, LoaderStep } from "../types";

function* login() {
  while (1) {
    yield put(changeScreen(ScreenState.LOGIN, LoaderStep.INACTIVE));
    const action:
      | LoginSubmitAction
      | LoginForgotAction
      | LoginSignUpAction = yield take([
      SUBMIT_LOGIN,
      FORGOT_PASSWORD,
      SIGN_UP,
    ]);
    yield put(changeScreen(ScreenState.LOGIN, LoaderStep.LOADING));

    // Make proper api call
    try {
      switch (action.type) {
        case SUBMIT_LOGIN:
          yield call(renewRefreshToken, action.username, action.password);
          break;
        case FORGOT_PASSWORD:
          yield call(
            changePassword,
            action.username,
            action.password,
            action.answer
          );
          break;
        case SIGN_UP:
          yield call(signUp, action.username, action.password, action.answer);
          break;
      }
      return yield call(renewAccessToken);
    } catch (e) {
      updateLoginError(e.toString());
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
