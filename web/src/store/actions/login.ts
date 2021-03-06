export const SUBMIT_LOGIN = "SUBMIT_LOGIN";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const SIGN_UP = "SIGN_UP";

export interface LoginSubmitAction {
  type: typeof SUBMIT_LOGIN;
  username: string;
  password: string;
}

export interface LoginForgotAction {
  type: typeof FORGOT_PASSWORD;
  username: string;
  password: string;
  answer: string;
}

export interface LoginSignUpAction {
  type: typeof SIGN_UP;
  username: string;
  password: string;
  email: string;
  answer: string;
}

export function loginSubmit(
  username: string,
  password: string
): LoginSubmitAction {
  return {
    type: SUBMIT_LOGIN,
    username,
    password,
  };
}

export function loginForgot(
  username: string,
  password: string,
  answer: string
): LoginForgotAction {
  return {
    type: FORGOT_PASSWORD,
    username,
    password,
    answer,
  };
}

export function loginSignUp(
  username: string,
  password: string,
  email: string,
  answer: string
): LoginSignUpAction {
  return {
    type: SIGN_UP,
    username,
    password,
    email,
    answer,
  };
}
