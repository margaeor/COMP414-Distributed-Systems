import { ScreenState, LoaderStep, User } from "../types";

export * from "./administration";
export * from "./game";
export * from "./lobby";
export * from "./login";

export const CHANGE_SCREEN = "CHANGE_SCREEN";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";

export interface ChangeScreenAction {
  type: typeof CHANGE_SCREEN;
  screen: ScreenState;
  loader: LoaderStep;
}

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export function changeScreen(
  screen: ScreenState,
  loader: LoaderStep
): ChangeScreenAction {
  return {
    type: CHANGE_SCREEN,
    screen,
    loader,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function setUser(user: User): SetUserAction {
  return {
    type: SET_USER,
    user,
  };
}
