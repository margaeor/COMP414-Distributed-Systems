import { State, LoginState } from "../types";

export function selectLoginData({ login }: State): LoginState {
  return login;
}
