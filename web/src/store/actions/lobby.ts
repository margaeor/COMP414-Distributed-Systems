import { LobbyState } from "../types";

export const UPDATE_LOBBY_DATA = "UPDATE_LOBBY_DATA";

export interface UpdateLobbyAction {
  type: typeof UPDATE_LOBBY_DATA;
  newState: LobbyState;
}

export function updateLobby(newState: LobbyState): UpdateLobbyAction {
  return {
    type: UPDATE_LOBBY_DATA,
    newState,
  };
}
