import { State, Play } from "../types";

export function selectGameData({ game: { data } }: State) {
  return data;
}

export function selectPlay({ game: { play } }: State): Play {
  return play;
}

export function selectMessage({ game: { message } }: State) {
  return message;
}

export function selectHistory({ game: { history } }: State) {
  return history;
}
