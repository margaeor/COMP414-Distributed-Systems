import { NULL_LOBBY_STATE, LobbyState } from "../types";
import { UpdateLobbyAction, UPDATE_LOBBY_DATA } from "../actions/lobby";

export default function lobby(
  state = NULL_LOBBY_STATE,
  action: UpdateLobbyAction
): LobbyState {
  if (action.type == UPDATE_LOBBY_DATA) {
    return action.newState;
  }
  return state;
}
