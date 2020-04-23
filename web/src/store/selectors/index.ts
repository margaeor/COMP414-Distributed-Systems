export * from "./game";
export * from "./lobby";

import { State } from "../types";

export function selectScreen({ screen }: State) {
  return screen;
}

export function selectLoader({ loader }: State) {
  return loader;
}

export function selectError({ error: loginError }: State): string {
  return loginError;
}

export function selectUser({ user }: State) {
  return user;
}
