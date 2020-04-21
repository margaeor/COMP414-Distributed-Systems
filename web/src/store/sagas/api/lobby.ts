import { LobbyState, Game } from "../../types";

export async function fetchLobbyData(token: string): Promise<LobbyState> {
  // TODO: Implement this call
  return {
    fetched: true,
    ongoingPlays: [
      {
        id: "1234",
        game: Game.CHESS,
        opponent: "john",
        started: false,
        won: false,
      },
      {
        id: "12345",
        game: Game.CHESS,
        opponent: "john",
        started: false,
        won: false,
      },
      {
        id: "123456",
        game: Game.CHESS,
        opponent: "john",
        started: false,
        won: false,
      },
    ],
    tournaments: [
      {
        id: "1234567",
        game: Game.CHESS,
        name: "Very Fun Tournament",
        players: 4,
        maxPlayers: 10,
      },
      {
        id: "12345678",
        game: Game.CHESS,
        name: "Very Fun Tournament 2",
        players: 4,
        maxPlayers: 10,
      },
      {
        id: "123456789",
        game: Game.CHESS,
        name: "Very Fun Tournament 3",
        players: 4,
        maxPlayers: 10,
      },
    ],
  };
}

export async function joinTournament(token: string, id: string) {}

export async function joinQuickGame(token: string, game: Game) {}

export async function joinPlay(token: string, id: string) {}
