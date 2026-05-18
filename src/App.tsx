import { useMemo, useState } from "react";
import {
  applyMove,
  countDiscs,
  createInitialGame,
  getLegalMoves,
  isLegalMove,
  type GameState,
  type Player,
  type Position,
} from "./game/othello";

const playerLabels: Record<Player, string> = {
  dark: "Noir",
  light: "Blanc",
};

const cellName = ({ row, col }: Position): string =>
  `${String.fromCharCode(65 + col)}${row + 1}`;

function App() {
  const [game, setGame] = useState<GameState>(() => createInitialGame());
  const legalMoves = useMemo(
    () => getLegalMoves(game.board, game.currentPlayer),
    [game.board, game.currentPlayer],
  );
  const score = useMemo(() => countDiscs(game.board), [game.board]);
  const lead = score.dark - score.light;

  const playMove = (position: Position) => {
    const next = applyMove(game, position);

    if (next) {
      setGame(next);
    }
  };

  const statusText = game.winner
    ? game.winner === "draw"
      ? "Partie terminee, egalite."
      : `Partie terminee, ${playerLabels[game.winner]} gagne.`
    : game.consecutivePasses > 0
      ? `${playerLabels[game.currentPlayer]} rejoue : aucun coup adverse.`
      : `${playerLabels[game.currentPlayer]} a jouer.`;

  return (
    <main className="app-shell">
      <section className="game-stage" aria-label="Prototype Othello Island">
        <div className="atmosphere" aria-hidden="true" />
        <div className="island-map" aria-hidden="true">
          <span className="contour contour-a" />
          <span className="contour contour-b" />
          <span className="contour contour-c" />
          <span className="chart-line chart-line-a" />
          <span className="chart-line chart-line-b" />
          <span className="chart-star chart-star-a" />
          <span className="chart-star chart-star-b" />
          <span className="chart-star chart-star-c" />
        </div>
        <header className="title-block">
          <p className="eyebrow">Prototype jouable</p>
          <h1>Othello Island</h1>
          <p className="subtitle">
            Un Othello classique pose sur une table d'ile ancienne : signes
            graves, cartes effacees, lumiere basse.
          </p>
        </header>

        <section className="board-zone">
          <aside className="side-panel left-panel" aria-label="Etat du duel">
            <div>
              <p className="panel-kicker">Tour</p>
              <p className={`turn-orb ${game.currentPlayer}`}>
                {playerLabels[game.currentPlayer]}
              </p>
            </div>
            <div className="score-grid" aria-label="Score">
              <div>
                <span>Noir</span>
                <strong>{score.dark}</strong>
              </div>
              <div>
                <span>Blanc</span>
                <strong>{score.light}</strong>
              </div>
            </div>
            <p className="lead-copy">
              {lead === 0
                ? "La position est equilibree."
                : `${lead > 0 ? "Noir" : "Blanc"} mene de ${Math.abs(lead)}.`}
            </p>
          </aside>

          <div className="board-frame">
            <div className="sigil-ring" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="board" role="grid" aria-label="Plateau Othello">
              {game.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const position = { row: rowIndex, col: colIndex };
                  const legal = isLegalMove(legalMoves, position);

                  return (
                    <button
                      className={`cell ${legal ? "legal" : ""}`}
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => playMove(position)}
                      aria-label={`${cellName(position)} ${
                        cell
                          ? `occupe par ${playerLabels[cell]}`
                          : legal
                            ? "coup legal"
                            : "case vide"
                      }`}
                      disabled={!legal || Boolean(game.winner)}
                      type="button"
                    >
                      <span className="cell-mark" aria-hidden="true" />
                      {cell ? (
                        <span className={`disc ${cell}`} aria-hidden="true" />
                      ) : legal ? (
                        <span className="legal-dot" aria-hidden="true" />
                      ) : null}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <aside className="side-panel right-panel" aria-label="Actions">
            <div>
              <p className="panel-kicker">Etat</p>
              <p className="status-copy">{statusText}</p>
            </div>
            <div className="move-list">
              <p className="panel-kicker">Coups ouverts</p>
              <p>{legalMoves.map(cellName).join(" / ") || "Aucun"}</p>
            </div>
            <button
              className="reset-button"
              onClick={() => setGame(createInitialGame())}
              type="button"
            >
              Nouvelle partie
            </button>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default App;
