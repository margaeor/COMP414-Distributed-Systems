export * from "./game";
export * from "./lobby";

import { State } from "../types";

export function selectScreen({ screen }: State) {
  return screen;
}

export function selectLoader({ loader }: State) {
  return loader;
}

export function selectError({ error }: State): string {
  return error;
}

export function selectMessage({ message }: State): string {
  return message;
}

export function selectUser({ user }: State) {
  return user;
}
