import { State } from "../types";

export function selectLobbyDataFetched({ lobby: { fetched } }: State) {
  return fetched;
}

export function selectOngoingPlays({ lobby: { ongoingPlays } }: State) {
  return ongoingPlays;
}

export function selectTournaments({ lobby: { tournaments } }: State) {
  return tournaments;
}
