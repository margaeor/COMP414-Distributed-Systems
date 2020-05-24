import Axios from "axios";
import {
  FinishedPracticePlay,
  FinishedTournament,
  FinishedTournamentPlay,
  Game,
  ResultType,
  Tournament,
  TournamentPlay,
  Play,
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

    const plays: FinishedPracticePlay[] = data.past_games
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

    const tournaments: FinishedTournament[] = data.user_tournaments.map(
      (t: Record<string, any>): FinishedTournament => {
        const plays = t.rounds.games.map(
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

    const plays: (Play | TournamentPlay)[] = data.past_games
      .filter((g: Record<string, Object>) => !g.tournament_id)
      .map((p: Record<string, Object>) => {
        const isPlayer1 = p.player1 === username;

        return {
          id: p._id,
          isPlayer1,
          opponent: isPlayer1 ? p.player2 : p.player1,
          game: p.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
          started: true,
        };
      });

    const tournaments: Tournament[] = data.active_tournaments
      .filter((t: Record<string, any>) => !t.has_started)
      .map(
        (t: Record<string, any>): Tournament => {
          return {
            id: t._id,
            name: t.name,
            game: Game.CHESS, //t.game_type === "chess" ? Game.CHESS : Game.TICTACTOE,
            joined: false,
            players: 0,
            maxPlayers: 0,
            date: new Date(t.date_created),
          };
        }
      );

    return { ongoingPlays: plays, tournaments };
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function joinTournament(token: string, id: string) {}

export async function joinQuickGame(token: string, game: Game) {}

export async function checkQuickGame(token: string) {}

export async function joinPlay(token: string, id: string) {}
