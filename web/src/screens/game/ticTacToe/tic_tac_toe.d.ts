export function TicTacToe(
  fen?: string
): {
  /**
   * Returns 1 if player 1 won,
   * 2 if player 2 won and
   * 3 if there's a draw
   * 0 if nobody has won yet
   */
  hasGameEnded: () => number;
  /**
   * Returns the move on success and false on failure.
   * Move must be in the form [0-2]{2}
   * e.g. '00','01','02','10'
   */
  move: (move: string) => boolean;
  /**
   * Returns the fen.
   */
  fen: () => string;
  /**
   * Returns the last move (if any).
   */
  getLastMove: () => string | false;
  /**
   * Returns the moves on the board.
   */
  getMoves: () => string[];
  /**
   * Returns how many moves were done by the player.
   */
  getMoveNumber: () => number;
  /**
   * Returns who's turn it is.
   */
  turn: () => 1 | 2 | 0;
  /*
   * Returns the target square with the given id
   */
  fgetSquare: (i: number) => "x" | "o" | "-";
  /*
   * Draw x or o to position with id.
   */
  fmove: (num: number, p: "x" | "o") => false | string;
};
