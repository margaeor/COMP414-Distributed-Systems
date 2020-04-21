export * from "./game";
export * from "./lobby";
export * from "./login";

import { State } from "../types";

export function selectScreen({ screen }: State) {
  return screen;
}

export function selectLoader({ loader }: State) {
  return loader;
}
