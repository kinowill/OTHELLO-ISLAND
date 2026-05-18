import { describe, expect, it } from "vitest";
import {
  applyMove,
  countDiscs,
  createInitialGame,
  getLegalMoves,
} from "./othello";

describe("othello rules", () => {
  it("starts with four discs and dark to move", () => {
    const game = createInitialGame();

    expect(countDiscs(game.board)).toEqual({ dark: 2, light: 2 });
    expect(game.currentPlayer).toBe("dark");
  });

  it("lists the four standard opening moves", () => {
    const game = createInitialGame();
    const moves = getLegalMoves(game.board, "dark");

    expect(moves).toEqual([
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ]);
  });

  it("applies a legal move and flips captured discs", () => {
    const next = applyMove(createInitialGame(), { row: 2, col: 3 });

    expect(next).not.toBeNull();
    expect(next?.board[2][3]).toBe("dark");
    expect(next?.board[3][3]).toBe("dark");
    expect(countDiscs(next!.board)).toEqual({ dark: 4, light: 1 });
    expect(next?.currentPlayer).toBe("light");
  });

  it("rejects illegal moves", () => {
    const next = applyMove(createInitialGame(), { row: 0, col: 0 });

    expect(next).toBeNull();
  });
});

