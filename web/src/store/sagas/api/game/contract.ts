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

export const CONNECTED = "CONNECTED";
export const TIMED_OUT = "TIMED_OUT";
export const CONNECTION_ERROR = "CONNECTION_ERROR";
export const DISCONNECTED = "DISCONNECTED";
export const RECONNECTED = "RECONNECTED";

export const EMIT_MAKE_MOVE = MAKE_MOVE;
export const EMIT_EXIT = EXIT;
export const EMIT_MESSAGE = MESSAGE;
export const EMIT_FORFEIT = FORFEIT;
export const EMIT_READY = READY;
export const RECEIVE_MESSAGE = MESSAGE;
export const RECEIVE_DATA = DATA;
export const RECEIVE_UPDATED_STATE = UPDATED_STATE;

export interface MessageReception {
  type: typeof RECEIVE_MESSAGE;
  event: MessageEvent;
}

export interface DataReception {
  type: typeof RECEIVE_DATA;
  event: DataEvent;
}

export interface UpdatedStateReception {
  type: typeof UPDATED_STATE;
  event: UpdatedStateEvent;
}
