import { Tournament, Game } from "../types";

export const CREATE_TOURNAMENT = "CREATE_TOURNAMENT";
export const CHANGE_PRIVILEGES = "CHANGE_PRIVILEGES";

export interface CreateTournamentAction {
  type: typeof CREATE_TOURNAMENT;
  name: string;
  game: Game;
  maxPlayers: number;
}

export interface ChangePrivilegesAction {
  type: typeof CHANGE_PRIVILEGES;
  user: string;
  admin: boolean;
  officer: boolean;
}

export function createTournament(
  name: string,
  game: Game,
  maxPlayers: number
): CreateTournamentAction {
  return {
    type: CREATE_TOURNAMENT,
    name,
    game,
    maxPlayers,
  };
}

export function changePrivileges(
  user: string,
  admin: boolean,
  officer: boolean
) {
  return {
    type: CHANGE_PRIVILEGES,
    user,
    admin,
    officer,
  };
}
