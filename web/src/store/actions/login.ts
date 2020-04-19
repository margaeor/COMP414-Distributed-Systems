import { LobbyState } from "../types";

export const UPDATE_LOGIN_DATA = "UPDATE_LOGIN_DATA";
export const SUBMIT_LOGIN = "SUBMIT_LOGIN";

export interface UpdateLoginDataAction {
  type: typeof UPDATE_LOGIN_DATA;
  username: String;
  password: String;
  answer: String;
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

export function submitLogin() {
  return {
    type: SUBMIT_LOGIN,
  };
}
