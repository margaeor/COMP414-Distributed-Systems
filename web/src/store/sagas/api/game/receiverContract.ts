export * from "./contract";
import {
  CONNECTION_ERROR,
  MAKE_MOVE,
  EXIT,
  MESSAGE,
  FORFEIT,
  READY,
  DATA,
  UPDATED_STATE,
  UpdatedStateEvent,
  DataEvent,
  ConnectionErrorEvent,
} from "./contract";

export const CONNECTED = "CONNECTED";
export const TIMED_OUT = "TIMED_OUT";
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

export interface ConnectionErrorReception {
  type: typeof CONNECTION_ERROR;
  event: ConnectionErrorEvent;
}
