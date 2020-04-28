export const TOKEN_COOKIE = "AUTHENTICATION";
export const ID_COOKIE = "ID_COOKIE";
export const READY = "READY";
export const MAKE_MOVE = "MAKE_MOVE";
export const MESSAGE = "MESSAGE";
export const FORFEIT = "FORFEIT";
export const EXIT = "EXIT";
export const UPDATED_STATE = "UPDATED_STATE";
export const DATA = "RECEIVE_DATA";

export interface AuthenticationEvent {
  token: string;
  id: string;
}

export interface MakeMoveEvent {
  data: string;
  move: string;
}

export interface MessageEvent {
  message: string;
}

export interface DataEvent {
  data: string;
  isOver: boolean;
}

export interface UpdatedStateEvent {
  event:
    | "OP_DISCONNECTED"
    | "OP_RECONNECTED"
    | "OP_FORFEITED"
    | "SERVER_ERROR"
    | "GAME_STARTED"
    | "GAME_ENDED";
}
