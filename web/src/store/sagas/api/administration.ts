import { sleep } from "./utils";
import { Game } from "../../types";
import Axios from "axios";
import {
  RefreshTokenError,
  ConnectionError,
  WrongParametersError,
} from "./errors";

export async function createTournament(
  token: string,
  name: string,
  players: number,
  game: Game
) {
  try {
    const { data } = await Axios.get("api/tournament/create", {
      params: {
        jwt: token,
        name,
        game_type: game === Game.CHESS ? "chess" : "tic-tac-toe",
        max_players: players,
      },
    });

    if (data.status === 401) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    } else if (data.status !== 200) {
      throw new WrongParametersError(data.message);
    }
  } catch (e) {
    if (e instanceof RefreshTokenError || e instanceof WrongParametersError)
      throw e;
    throw new ConnectionError(e.message);
  }
}

export async function changePrivileges(
  token: string,
  user: string,
  admin: boolean,
  officer: boolean
) {
  try {
    const roles: string[] = ["player"];
    if (admin) roles.push("admin");
    if (officer) roles.push("official");
    const { data } = await Axios.get("auth/change_roles", {
      params: {
        jwt: token,
        username: user,
        roles,
      },
    });

    if (data.status === 401) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    } else if (data.status !== 200) {
      throw new WrongParametersError(data.error);
    }
  } catch (e) {
    if (e instanceof RefreshTokenError || e instanceof WrongParametersError)
      throw e;
    throw new ConnectionError(e.message);
  }
}
