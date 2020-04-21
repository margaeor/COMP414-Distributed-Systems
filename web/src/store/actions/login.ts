import { LoginStep } from "../types";
import { UpdatePlayDataAction } from "./game";

export const UPDATE_LOGIN_DATA = "UPDATE_LOGIN_DATA";
export const UPDATE_LOGIN_USERNAME = "UPDATE_LOGIN_USERNAME";
export const UPDATE_LOGIN_PASSWORD = "UPDATE_LOGIN_PASSWORD";
export const UPDATE_LOGIN_ANSWER = "UPDATE_LOGIN_ANSWER";
export const UPDATE_LOGIN_STEP = "UPDATE_LOGIN_STEP";
export const SUBMIT_LOGIN = "SUBMIT_LOGIN";
export const SUBMIT_FORGOT = "SUBMIT_FORGOT";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const REMEMBERED_PASSWORD = "REMEMBERED_PASSWORD";

export interface UpdateLoginDataAction {
  type: typeof UPDATE_LOGIN_DATA;
  username: string;
  password: string;
  answer: string;
}

export interface UpdateLoginUsernameAction {
  type: typeof UPDATE_LOGIN_USERNAME;
  username: string;
}

export interface UpdateLoginPasswordAction {
  type: typeof UPDATE_LOGIN_PASSWORD;
  password: string;
}

export interface UpdateLoginAnswerAction {
  type: typeof UPDATE_LOGIN_ANSWER;
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

export function updateLoginUsername(
  username: string
): UpdateLoginUsernameAction {
  return {
    type: UPDATE_LOGIN_USERNAME,
    username,
  };
}

export function updateLoginPassword(
  password: string
): UpdateLoginPasswordAction {
  return {
    type: UPDATE_LOGIN_PASSWORD,
    password,
  };
}

export function updateLoginAnswer(answer: string): UpdateLoginAnswerAction {
  return {
    type: UPDATE_LOGIN_ANSWER,
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

export function submitForgot() {
  return {
    type: SUBMIT_FORGOT,
  };
}

export function forgotPassword() {
  return {
    type: FORGOT_PASSWORD,
  };
}

export function rememberedPassword() {
  return {
    type: REMEMBERED_PASSWORD,
  };
}
