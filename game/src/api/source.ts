export interface Play {
  id: string;
  opponent1: string;
  opponent2: string;
  game: "chess" | "tictactoe";
}

export interface ExtendedPlay extends Play {
  data: string;
}

export function retrievePlay(id: string): Play {
  return {
    id: "12543",
    opponent1: "bobby",
    opponent2: "vetIO",
    game: "chess",
  };
}

export function retrievePlayProgress(id: string): string {
  return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1;;w";
}
