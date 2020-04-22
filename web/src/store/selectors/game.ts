import { State, Play } from "../types";

export function selectBoard({
  game: {
    data: { board },
  },
}: State) {
  return board;
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
