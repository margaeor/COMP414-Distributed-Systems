import { State } from "../types";

export function selectOngoingPlays({ lobby: { ongoingPlays } }: State) {
  return ongoingPlays;
}

export function selectTournaments({ lobby: { tournaments } }: State) {
  return tournaments;
}

export function selectScores({ lobby: { scores } }: State) {
  return scores;
}
