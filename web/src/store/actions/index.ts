import { ScreenState, LoaderStep, User } from "../types";

export * from "./administration";
export * from "./game";
export * from "./lobby";
export * from "./login";
export * from "./loader";

export const CHANGE_SCREEN = "CHANGE_SCREEN";
export const SET_USER = "SET_USER";
export const UPDATE_ERROR = "UPDATE_ERROR";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const NOTIFY_URL_CHANGE = "NOTIFY_URL_CHANGE";

export interface NotifyUrlChangeAction {
  type: typeof NOTIFY_URL_CHANGE;
  screen: ScreenState;
  id?: string;
}

export interface ChangeScreenAction {
  type: typeof CHANGE_SCREEN;
  screen: ScreenState;
  loader?: LoaderStep;
}

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export interface UpdateErrorAction {
  type: typeof UPDATE_ERROR;
  error: string;
}

export interface UpdateMessageAction {
  type: typeof UPDATE_MESSAGE;
  message: string;
}

export function updateError(error: string): UpdateErrorAction {
  return {
    type: UPDATE_ERROR,
    error,
  };
}

export function updateMessage(message: string): UpdateMessageAction {
  return {
    type: UPDATE_MESSAGE,
    message,
  };
}

export function changeScreen(
  screen: ScreenState,
  loader?: LoaderStep
): ChangeScreenAction {
  return {
    type: CHANGE_SCREEN,
    screen,
    loader,
  };
}

export function notifyUrlChange(
  screen: ScreenState,
  id?: string
): NotifyUrlChangeAction {
  return {
    type: NOTIFY_URL_CHANGE,
    screen,
    id,
  };
}

export function setUser(user: User): SetUserAction {
  return {
    type: SET_USER,
    user,
  };
}
