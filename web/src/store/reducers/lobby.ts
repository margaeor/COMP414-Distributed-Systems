import { NULL_LOBBY_STATE, LobbyState } from "../types";
import {
  UpdateLobbyAction,
  UpdateTournamentsAction,
  UPDATE_LOBBY_DATA,
  UPDATE_TOURNAMENTS,
  UpdateOngoingAction,
  UpdateScoresAction,
  UPDATE_ONGOING_PLAYS,
  UPDATE_SCORES,
} from "../actions/lobby";

export default function lobby(
  state = NULL_LOBBY_STATE,
  action:
    | UpdateLobbyAction
    | UpdateTournamentsAction
    | UpdateOngoingAction
    | UpdateScoresAction
): LobbyState {
  switch (action.type) {
    case UPDATE_LOBBY_DATA:
      return action.newState;
    case UPDATE_TOURNAMENTS:
      return {
        ...state,
        tournaments: action.tournaments,
      };
    case UPDATE_ONGOING_PLAYS:
      return {
        ...state,
        ongoingPlays: action.ongoingPlays,
      };
    case UPDATE_SCORES:
      return {
        ...state,
        scores: action.scores,
      };
    default:
      return state;
  }
}
