export * from "./game";
export * from "./lobby";

import { State } from "../types";

export function selectScreen({ screen }: State) {
  return screen;
}

export function selectLoader({ loader }: State) {
  return loader;
}

export function selectLoginError({ loginError }: State): string {
  return loginError;
}
