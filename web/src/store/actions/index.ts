import { ScreenState, LoaderStep } from "../types";

export * from "./game";
export * from "./lobby";
export * from "./login";

export const CHANGE_SCREEN = "CHANGE_SCREEN";
export const LOGOUT = "LOGOUT";

export interface ChangeScreenAction {
  type: typeof CHANGE_SCREEN;
  screen: ScreenState;
  loader: LoaderStep;
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
