import Axios from "axios";
import {
  FinishedPracticePlay,
  FinishedTournament,
  FinishedTournamentPlay,
  Game,
  Play,
  ResultType,
  Tournament,
  TournamentPlay,
} from "../../types";
import { ConnectionError, RefreshTokenError } from "./errors";

export async function fetchScores(
  token: string,
  username: string
): Promise<(FinishedTournament | FinishedPracticePlay)[]> {
  try {
    const { data } = await Axios.get("api/me/match_history", {
      params: {
        jwt: token,
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }

    const plays: FinishedPracticePlay[] = data.data.past_games
      .filter((g: Record<string, Object>) => !g.tournament_id)
      .map((p: Record<string, Object>) => {
        const isPlayer1 = p.player1 === username;
        let result;
        if ((p.score === 1 && isPlayer1) || (p.score === -1 && !isPlayer1)) {
          result = ResultType.WON;
        } else if (p.score === 0) {
          result = ResultType.DRAW;
        } else {
          result = ResultType.LOST;
        }

        return {
          id: p._id,
          isPlayer1,
          opponent: isPlayer1 ? p.player2 : p.player1,
          game: Game.CHESS,
          started: true,
          result,
        };
      });

    const tournaments: FinishedTournament[] = data.data.user_tournaments.map(
      (t: Record<string, any>): FinishedTournament => {
        let plays;
        if (t.rounds.games) {
          plays = t.rounds.games.map(
            (p: Record<string, Object>): FinishedTournamentPlay => ({
              id: p.tournament_id as string,
              player1: p.player1 as string,
              player2: p.player2 as string,
              result:
                p.score === 1
                  ? ResultType.WON
                  : p.score === 0
                  ? ResultType.DRAW
                  : ResultType.LOST,
              date: new Date(t.date_created),
            })
          );
        } else {
          plays = [];
        }

        return {
          id: t._id,
          name: t.name,
          game: t.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
          joined: true,
          players: 0,
          maxPlayers: 0,
          ranking: 0,
          plays,
          date: new Date(t.date_created),
        };
      }
    );

    const pastGames: (FinishedTournament | FinishedPracticePlay)[] = [];
    pastGames.concat(tournaments, plays);
    pastGames.sort((a, b) => (b.date > a.date ? 1 : -1));
    return pastGames;
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    console.log(e);
    throw new ConnectionError(e.message);
  }
}

export async function fetchLobbyData(
  token: string,
  username: string
): Promise<{
  tournaments: Tournament[];
  ongoingPlays: (Play | TournamentPlay)[];
}> {
  try {
    const { data } = await Axios.get("api/me/lobby", {
      params: {
        jwt: token,
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }

    const plays: (Play | TournamentPlay)[] = data.data.active_games
      .filter((g: Record<string, Object>) => !g.tournament_id)
      .map(
        (p: Record<string, string>): Play => {
          const isPlayer1 = p.player1 === username;

          return {
            id: p._id,
            isPlayer1,
            opponent: isPlayer1 ? p.player2 : p.player1,
            game: p.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
            started: true,
            date: new Date(p.date_created),
          };
        }
      )
      .sort((a: Record<string, Object>, b: Record<string, Object>) =>
        b.date > a.date ? 1 : -1
      );

    const tournaments: Tournament[] = data.data.active_tournaments
      .filter((t: Record<string, any>) => !t.has_started)
      .map(
        (t: Record<string, any>): Tournament => {
          return {
            id: t._id,
            name: t.name,
            game: t.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
            joined: t.joined,
            players: t.players,
            started: t.has_started,
            maxPlayers: t.max_players,
            date: new Date(t.date_created),
          };
        }
      )
      .sort((a: Record<string, Object>, b: Record<string, Object>) =>
        b.date > a.date ? 1 : -1
      );

    return { ongoingPlays: plays, tournaments };
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function joinTournament(token: string, id: string) {
  try {
    const { data } = await Axios.get("api/tournament/register", {
      params: {
        jwt: token,
        id: id,
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function startTournament(token: string, id: string) {
  try {
    const { data } = await Axios.get("api/tournament/start", {
      params: {
        jwt: token,
        id: id,
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function joinQuickGame(token: string, game: Game) {
  try {
    const { data } = await Axios.get("api/practice/join_queue", {
      params: {
        jwt: token,
        game_type: game === Game.CHESS ? "chess" : "tic-tac-toe",
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function joinPlay(
  token: string,
  id: string,
  username: string
): Promise<{
  play: Play | TournamentPlay;
  server: { url: string; id: string };
}> {
  try {
    const { data } = await Axios.get("api/join_game", {
      params: {
        jwt: token,
        game_id: id,
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }

    const p = data.data;
    const isPlayer1 = p.player1 === username;
    return {
      play: {
        id: p._id,
        name: p.tournament_id && p.tournament_id.name,
        isPlayer1,
        opponent: isPlayer1 ? p.player2 : p.player1,
        game: p.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
        started: p.has_started,
        date: p.date_created,
      },
      server: {
        id: data.data.server_id,
        url: data.data.server_ip,
      },
    };
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function checkQuickPlay(token: string, game: Game) {
  try {
    const { data } = await Axios.get("api/me/in_queue", {
      params: {
        jwt: token,
        game_type: game === Game.CHESS ? "chess" : "tic-tac-toe",
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.message || `Unknown Error: ${data.status}`
      );
    }

    return data.data;
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}
