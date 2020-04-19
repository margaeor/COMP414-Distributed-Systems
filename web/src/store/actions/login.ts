import { LobbyState, LoginStep } from "../types";

export const UPDATE_LOGIN_DATA = "UPDATE_LOGIN_DATA";
export const UPDATE_LOGIN_STEP = "UPDATE_LOGIN_STEP";
export const SUBMIT_LOGIN = "SUBMIT_LOGIN";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";

export interface UpdateLoginDataAction {
  type: typeof UPDATE_LOGIN_DATA;
  username: String;
  password: String;
  answer: String;
}

export interface UpdateLoginStepAction {
  type: typeof UPDATE_LOGIN_STEP;
  step: LoginStep;
  error: String;
}

export function updateLoginData(
  username: String,
  password: String,
  answer: String
): UpdateLoginDataAction {
  return {
    type: UPDATE_LOGIN_DATA,
    username,
    password,
    answer,
  };
}

export function updateLoginStep(
  step: LoginStep,
  error: String
): UpdateLoginStepAction {
  return {
    type: UPDATE_LOGIN_STEP,
    step,
    error,
  };
}

export function submitLogin() {
  return {
    type: SUBMIT_LOGIN,
  };
}

export function forgotPassword() {
  return {
    type: FORGOT_PASSWORD,
  };
}
