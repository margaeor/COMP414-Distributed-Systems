type Game = "chess" | "tictactoe";

export interface Play {
  id: string;
  opponent1: string;
  opponent2: string;
  game: Game;
}

export interface PlaySession {
  play: Play;
  user1: string | null;
  user2: string | null;
  progress: string | null;
}
