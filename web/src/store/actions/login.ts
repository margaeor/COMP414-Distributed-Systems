import { LoginStep } from "../types";

export const UPDATE_LOGIN_DATA = "UPDATE_LOGIN_DATA";
export const UPDATE_LOGIN_STEP = "UPDATE_LOGIN_STEP";
export const SUBMIT_LOGIN = "SUBMIT_LOGIN";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";

export interface UpdateLoginDataAction {
  type: typeof UPDATE_LOGIN_DATA;
  username: string;
  password: string;
  answer: string;
}

export interface UpdateLoginStepAction {
  type: typeof UPDATE_LOGIN_STEP;
  step: LoginStep;
  error: string;
}

export function updateLoginData(
  username: string,
  password: string,
  answer: string
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
  error: string
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
