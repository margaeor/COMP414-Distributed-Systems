import { Play, Result } from "./types";

export function retrievePlay(id: string): Play {
  return {
    id: "12543",
    opponent1: "bobby",
    opponent2: "vetIO",
    game: "chess",
  };
}

export function retrievePlayProgress(id: string): string {
  return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1;";
}

export function publishResult(id: string, result: Result): void {
  console.log(`play ${id} finished with status: ${result}`);
}
