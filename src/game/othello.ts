export type Disc = "dark" | "light";
export type Cell = Disc | null;
export type Player = Disc;
export type Position = {
  row: number;
  col: number;
};

export type GameState = {
  board: Cell[][];
  currentPlayer: Player;
  consecutivePasses: number;
  winner: Player | "draw" | null;
};

const BOARD_SIZE = 8;
const DIRECTIONS: Position[] = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
];

export const otherPlayer = (player: Player): Player =>
  player === "dark" ? "light" : "dark";

export const createInitialBoard = (): Cell[][] => {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array<Cell>(BOARD_SIZE).fill(null),
  );

  board[3][3] = "light";
  board[3][4] = "dark";
  board[4][3] = "dark";
  board[4][4] = "light";

  return board;
};

export const createInitialGame = (): GameState => ({
  board: createInitialBoard(),
  currentPlayer: "dark",
  consecutivePasses: 0,
  winner: null,
});

export const isInsideBoard = ({ row, col }: Position): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

const samePosition = (a: Position, b: Position): boolean =>
  a.row === b.row && a.col === b.col;

export const getFlipsForMove = (
  board: Cell[][],
  player: Player,
  move: Position,
): Position[] => {
  if (!isInsideBoard(move) || board[move.row][move.col] !== null) {
    return [];
  }

  const opponent = otherPlayer(player);
  const flips: Position[] = [];

  for (const direction of DIRECTIONS) {
    const path: Position[] = [];
    let cursor = {
      row: move.row + direction.row,
      col: move.col + direction.col,
    };

    while (isInsideBoard(cursor) && board[cursor.row][cursor.col] === opponent) {
      path.push(cursor);
      cursor = {
        row: cursor.row + direction.row,
        col: cursor.col + direction.col,
      };
    }

    if (
      path.length > 0 &&
      isInsideBoard(cursor) &&
      board[cursor.row][cursor.col] === player
    ) {
      flips.push(...path);
    }
  }

  return flips;
};

export const getLegalMoves = (board: Cell[][], player: Player): Position[] => {
  const moves: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const move = { row, col };
      if (getFlipsForMove(board, player, move).length > 0) {
        moves.push(move);
      }
    }
  }

  return moves;
};

export const countDiscs = (board: Cell[][]): Record<Player, number> =>
  board.flat().reduce<Record<Player, number>>(
    (score, cell) => {
      if (cell) {
        score[cell] += 1;
      }

      return score;
    },
    { dark: 0, light: 0 },
  );

export const getWinner = (board: Cell[][]): GameState["winner"] => {
  const score = countDiscs(board);

  if (score.dark === score.light) {
    return "draw";
  }

  return score.dark > score.light ? "dark" : "light";
};

export const hasAnyLegalMove = (board: Cell[][], player: Player): boolean =>
  getLegalMoves(board, player).length > 0;

export const applyMove = (
  state: GameState,
  move: Position,
): GameState | null => {
  if (state.winner) {
    return null;
  }

  const flips = getFlipsForMove(state.board, state.currentPlayer, move);

  if (flips.length === 0) {
    return null;
  }

  const board = state.board.map((row) => [...row]);
  board[move.row][move.col] = state.currentPlayer;

  for (const flip of flips) {
    board[flip.row][flip.col] = state.currentPlayer;
  }

  const nextPlayer = otherPlayer(state.currentPlayer);
  const currentStillHasMoves = hasAnyLegalMove(board, state.currentPlayer);
  const nextHasMoves = hasAnyLegalMove(board, nextPlayer);

  if (!currentStillHasMoves && !nextHasMoves) {
    return {
      board,
      currentPlayer: nextPlayer,
      consecutivePasses: 0,
      winner: getWinner(board),
    };
  }

  return {
    board,
    currentPlayer: nextHasMoves ? nextPlayer : state.currentPlayer,
    consecutivePasses: nextHasMoves ? 0 : 1,
    winner: null,
  };
};

export const isLegalMove = (
  legalMoves: Position[],
  position: Position,
): boolean => legalMoves.some((move) => samePosition(move, position));

