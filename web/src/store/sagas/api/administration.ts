import { sleep } from "./utils";
import { Game } from "../../types";

export async function createTournament(
  token: string,
  name: string,
  players: number,
  game: Game
) {
  await sleep(400);
}

export async function changePrivileges(
  token: string,
  user: string,
  admin: boolean,
  officer: boolean
) {
  await sleep(400);
}
