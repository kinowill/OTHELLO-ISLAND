import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import { TitleAudioController, type AudioMix } from "./audio/titleAudio";

type Screen = "menu" | "game";
type DisplayMode = "borderless" | "fullscreen" | "windowed";

const DEFAULT_AUDIO_MIX: AudioMix = {
  ambience: 0.68,
  music: 0.9,
  ui: 0.78,
};

const displayModeLabels: Record<DisplayMode, string> = {
  borderless: "Plein ecran fenetre",
  fullscreen: "Vrai plein ecran",
  windowed: "Fenetre 1600x900",
};

const playerLabels: Record<Player, string> = {
  dark: "Noir",
  light: "Blanc",
};

const cellName = ({ row, col }: Position): string =>
  `${String.fromCharCode(65 + col)}${row + 1}`;

const applyDisplayMode = async (mode: DisplayMode) => {
  try {
    const {
      LogicalSize,
      currentMonitor,
      getCurrentWindow,
    } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();

    if (mode === "fullscreen") {
      await appWindow.setSizeConstraints(null);
      await appWindow.setDecorations(true);
      await appWindow.setFullscreen(true);
      await appWindow.setFocus();
      return;
    }

    await appWindow.setFullscreen(false);

    if (mode === "borderless") {
      await appWindow.setSizeConstraints(null);
      await appWindow.setDecorations(false);

      const monitor = await currentMonitor();

      if (monitor) {
        await appWindow.setPosition(monitor.position);
        await appWindow.setSize(monitor.size);
      } else {
        await appWindow.maximize();
      }

      await appWindow.setFocus();
      return;
    }

    await appWindow.unmaximize().catch(() => undefined);
    await appWindow.setDecorations(true);
    await appWindow.setSizeConstraints({
      maxHeight: 900,
      maxWidth: 1600,
      minHeight: 900,
      minWidth: 1600,
    });
    await appWindow.setSize(new LogicalSize(1600, 900));
    await appWindow.center();
    await appWindow.setFocus();
  } catch {
    // Running in a regular browser during dev: display mode controls become no-ops.
  }
};

function App() {
  const audioControllerRef = useRef<TitleAudioController | null>(null);
  const [audioMix, setAudioMix] = useState<AudioMix>(DEFAULT_AUDIO_MIX);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("borderless");
  const [screen, setScreen] = useState<Screen>("menu");
  const [game, setGame] = useState<GameState>(() => createInitialGame());
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showLegalMoves, setShowLegalMoves] = useState(false);
  const legalMoves = useMemo(
    () => getLegalMoves(game.board, game.currentPlayer),
    [game.board, game.currentPlayer],
  );
  const score = useMemo(() => countDiscs(game.board), [game.board]);
  const lead = score.dark - score.light;

  useEffect(() => {
    const controller = new TitleAudioController();
    audioControllerRef.current = controller;
    controller.setMix(audioMix);

    const unlockAudio = () => {
      void controller.unlock();
    };

    void controller.setEnabled(true).catch(() => undefined);
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      controller.dispose();
      audioControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    void audioControllerRef.current
      ?.setEnabled(audioEnabled)
      .catch(() => undefined);
  }, [audioEnabled]);

  useEffect(() => {
    audioControllerRef.current?.setMix(audioMix);
  }, [audioMix]);

  useEffect(() => {
    void applyDisplayMode(displayMode);
  }, [displayMode]);

  const playHoverSound = () => {
    audioControllerRef.current?.playHover();
  };

  const playSelectSound = () => {
    audioControllerRef.current?.playSelect();
  };

  const hoverAudioProps = {
    onFocus: playHoverSound,
    onPointerEnter: playHoverSound,
  };

  const updateAudioMix = (key: keyof AudioMix, value: string) => {
    setAudioMix((currentMix) => ({
      ...currentMix,
      [key]: Number(value) / 100,
    }));
  };

  const changeDisplayMode = (mode: DisplayMode) => {
    if (displayMode === mode) {
      return;
    }

    playSelectSound();
    setDisplayMode(mode);
  };

  const volumeStyle = (value: number): CSSProperties =>
    ({ "--volume-level": `${Math.round(value * 100)}%` }) as CSSProperties;

  const playMove = (position: Position) => {
    const next = applyMove(game, position);

    if (next) {
      playSelectSound();
      setGame(next);
    }
  };

  const startNewGame = () => {
    playSelectSound();
    setGame(createInitialGame());
    setHasStartedGame(true);
    setSettingsOpen(false);
    setScreen("game");
  };

  const resumeGame = () => {
    playSelectSound();
    setSettingsOpen(false);
    setScreen("game");
  };

  const openMenu = () => {
    playSelectSound();
    setSettingsOpen(false);
    setScreen("menu");
  };

  const quitGame = async () => {
    playSelectSound();

    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch {
      window.close();
    }
  };

  const statusText = game.winner
    ? game.winner === "draw"
      ? "Partie terminee, egalite."
      : `Partie terminee, ${playerLabels[game.winner]} gagne.`
    : game.consecutivePasses > 0
      ? `${playerLabels[game.currentPlayer]} rejoue : aucun coup adverse.`
      : `${playerLabels[game.currentPlayer]} a jouer.`;

  const settingsPanel = (
    <div className="settings-overlay" role="dialog" aria-modal="true">
      <section className="settings-panel" aria-label="Parametres">
        <div className="settings-header">
          <div className="settings-title-art" aria-hidden="true" />
          <h2 className="sr-only">Parametres</h2>
          <button
            aria-label="Fermer les parametres"
            className="icon-button settings-close-button"
            onClick={() => {
              playSelectSound();
              setSettingsOpen(false);
            }}
            type="button"
            {...hoverAudioProps}
          >
            Retour
          </button>
        </div>

        <div className="settings-tabs" aria-hidden="true">
          <span className="settings-tab settings-tab-display" />
          <span className="settings-tab settings-tab-audio" />
          <span className="settings-tab settings-tab-gameplay" />
          <span className="settings-tab settings-tab-controls" />
        </div>

        <div className="settings-list">
          <div className="settings-group settings-group-display">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-display" aria-hidden="true" />
              <p className="panel-kicker">Affichage</p>
            </div>
            <div className="display-mode-grid" aria-label="Mode d'affichage">
              {(Object.keys(displayModeLabels) as DisplayMode[]).map((mode) => (
                <button
                  className="setting-choice"
                  disabled={displayMode === mode}
                  key={mode}
                  onClick={() => changeDisplayMode(mode)}
                  aria-pressed={displayMode === mode}
                  type="button"
                  {...(displayMode === mode ? {} : hoverAudioProps)}
                >
                  {displayModeLabels[mode]}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-group settings-group-gameplay">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-gameplay" aria-hidden="true" />
              <p className="panel-kicker">Gameplay</p>
            </div>

            <label className="option-toggle">
              <input
                checked={audioEnabled}
                onChange={(event) => {
                  playSelectSound();
                  setAudioEnabled(event.target.checked);
                }}
                type="checkbox"
              />
              <span aria-hidden="true" />
              <em>Ambiance sonore</em>
            </label>

            <label className="option-toggle">
              <input
                checked={showLegalMoves}
                onChange={(event) => {
                  playSelectSound();
                  setShowLegalMoves(event.target.checked);
                }}
                type="checkbox"
              />
              <span aria-hidden="true" />
              <em>Afficher les coups possibles</em>
            </label>
          </div>

          <div className="asset-placeholder asset-placeholder-audio">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-audio" aria-hidden="true" />
              <p className="panel-kicker">Audio</p>
            </div>
            <strong>{audioEnabled ? "Ambiance active" : "Ambiance coupee"}</strong>
            <p>
              Musique legerement devant le decor sonore. Ocean en fondue, vent
              aleatoire, depart musical retarde.
            </p>
          </div>

          <div className="settings-group settings-group-audio">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-controls" aria-hidden="true" />
              <p className="panel-kicker">Mixage</p>
            </div>
            <label className="volume-control" style={volumeStyle(audioMix.music)}>
              <span>Musique</span>
              <input
                aria-label="Volume musique"
                max="100"
                min="0"
                onChange={(event) => updateAudioMix("music", event.target.value)}
                type="range"
                value={Math.round(audioMix.music * 100)}
              />
              <strong>{Math.round(audioMix.music * 100)}%</strong>
            </label>
            <label className="volume-control" style={volumeStyle(audioMix.ambience)}>
              <span>Ambiance</span>
              <input
                aria-label="Volume ambiance"
                max="100"
                min="0"
                onChange={(event) => updateAudioMix("ambience", event.target.value)}
                type="range"
                value={Math.round(audioMix.ambience * 100)}
              />
              <strong>{Math.round(audioMix.ambience * 100)}%</strong>
            </label>
            <label className="volume-control" style={volumeStyle(audioMix.ui)}>
              <span>UI</span>
              <input
                aria-label="Volume interface"
                max="100"
                min="0"
                onChange={(event) => updateAudioMix("ui", event.target.value)}
                type="range"
                value={Math.round(audioMix.ui * 100)}
              />
              <strong>{Math.round(audioMix.ui * 100)}%</strong>
            </label>
          </div>

          <div className="asset-placeholder asset-placeholder-warning">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-warning" aria-hidden="true" />
              <p className="panel-kicker">Textures</p>
            </div>
            <strong>Non integrees</strong>
            <p>
              Les textures definitives seront generees en 32-bit puis ajoutees
              comme assets locaux.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  if (screen === "menu") {
    return (
      <main className="app-shell landing-shell">
        <section
          className="asset-title-screen"
          aria-label="Accueil Othello Island"
        >
          <div className="asset-title-background" aria-hidden="true" />
          <div className="asset-title-logo" aria-hidden="true" />

          <nav className="asset-title-menu" aria-label="Menu principal">
            <div className="asset-title-menu-panel" aria-hidden="true" />
            <div className="asset-title-actions">
              <button
                aria-label="Entrer sur l'ile, nouvelle partie"
                className="title-action title-action-enter"
                onClick={startNewGame}
                type="button"
                {...hoverAudioProps}
              />
              <button
                aria-label="Reprendre la partie"
                className="title-action title-action-resume"
                disabled={!hasStartedGame}
                onClick={resumeGame}
                type="button"
                {...(hasStartedGame ? hoverAudioProps : {})}
              />
              <button
                aria-label="Parametres"
                className="title-action title-action-settings"
                onClick={() => {
                  playSelectSound();
                  setSettingsOpen(true);
                }}
                type="button"
                {...hoverAudioProps}
              />
              <button
                aria-label="Quitter"
                className="title-action title-action-quit"
                onClick={() => void quitGame()}
                type="button"
                {...hoverAudioProps}
              />
            </div>
          </nav>

          <div className="asset-title-footer" aria-hidden="true" />
        </section>
        {settingsOpen ? settingsPanel : null}
      </main>
    );
  }

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
          <div className="game-toolbar" aria-label="Navigation">
            <button
              className="menu-button"
              onClick={openMenu}
              type="button"
              {...hoverAudioProps}
            >
              Menu
            </button>
            <button
              className="menu-button"
              onClick={() => {
                playSelectSound();
                setSettingsOpen(true);
              }}
              type="button"
              {...hoverAudioProps}
            >
              Parametres
            </button>
          </div>
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
                      className={`cell ${legal ? "playable" : ""} ${
                        showLegalMoves && legal ? "legal" : ""
                      }`}
                      disabled={!legal || Boolean(game.winner)}
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => playMove(position)}
                      onFocus={legal ? playHoverSound : undefined}
                      onPointerEnter={legal ? playHoverSound : undefined}
                      aria-label={`${cellName(position)} ${
                        cell
                          ? `occupe par ${playerLabels[cell]}`
                          : legal
                            ? "coup legal"
                            : "case vide"
                      }`}
                      type="button"
                    >
                      <span className="cell-mark" aria-hidden="true" />
                      {cell ? (
                        <span className={`disc ${cell}`} aria-hidden="true" />
                      ) : showLegalMoves && legal ? (
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
              <p>
                {showLegalMoves
                  ? legalMoves.map(cellName).join(" / ") || "Aucun"
                  : "Masques"}
              </p>
            </div>
            <button
              className="reset-button"
              onClick={startNewGame}
              type="button"
              {...hoverAudioProps}
            >
              Nouvelle partie
            </button>
          </aside>
        </section>
      </section>
      {settingsOpen ? settingsPanel : null}
    </main>
  );
}

export default App;
