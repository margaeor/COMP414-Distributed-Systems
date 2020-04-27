import { LobbyState, Game, ResultType } from "../../types";

export async function fetchLobbyData(token: string): Promise<LobbyState> {
  // TODO: Implement this call
  return {
    scores: [
      {
        id: "1234",
        game: Game.CHESS,
        opponent: "vetIO",
        started: false,
        result: ResultType.WON,
      },
      {
        id: "aaaa",
        game: Game.CHESS,
        opponent: "bomboclaat",
        started: false,
        result: ResultType.LOST,
      },
      {
        id: "2345",
        game: Game.TICTACTOE,
        opponent: "juicy",
        started: false,
        result: ResultType.DRAW,
      },
      {
        id: "3456",
        game: Game.CHESS,
        opponent: "juicy",
        started: false,
        result: ResultType.LOST,
      },
      {
        id: "435",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        players: 10,
        maxPlayers: 23,
        joined: true,
        ranking: 1,
      },
      {
        id: "5463",
        game: Game.CHESS,
        name: "Chess Championships Round XIaadfsasdfsadfasdfasdf",
        players: 10,
        maxPlayers: 23,
        joined: true,
        ranking: 2,
      },
      {
        id: "798",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        players: 10,
        maxPlayers: 23,
        joined: true,
        ranking: 3,
      },
      {
        id: "654",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        players: 10,
        maxPlayers: 23,
        joined: true,
        ranking: 4,
      },
      {
        id: "12",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        players: 10,
        maxPlayers: 23,
        joined: true,
        ranking: 5,
      },
    ],
    ongoingPlays: [
      {
        id: "1234",
        game: Game.CHESS,
        opponent: "vetIO",
        started: true,
      },
      {
        id: "aaaa",
        game: Game.CHESS,
        opponent: "bomboclaat",
        started: false,
      },
      {
        id: "2345",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        opponent: "juicy",
        started: true,
      },
      {
        id: "3456",
        game: Game.CHESS,
        opponent: "juicy",
        started: false,
      },
    ],
    tournaments: [
      {
        id: "1234567",
        game: Game.CHESS,
        name: "Nerd Club: Chess Finals 2",
        players: 4,
        maxPlayers: 10,
        joined: false,
      },
      {
        id: "12345678",
        game: Game.CHESS,
        name: "NFC: Recruitment Rounds IV",
        players: 10,
        maxPlayers: 23,
        joined: true,
      },
      {
        id: "123456789",
        game: Game.TICTACTOE,
        name: "Gamers Nexus: Tic Tac Toe with Friends",
        players: 6,
        maxPlayers: 40,
        joined: false,
      },
    ],
  };
}

export async function joinTournament(token: string, id: string) {}

export async function joinQuickGame(token: string, game: Game) {}

export async function checkQuickGame(token: string) {}

export async function joinPlay(token: string, id: string) {}
