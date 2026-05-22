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
  getFlipsForMove,
  getLegalMoves,
  isLegalMove,
  type GameState,
  type Player,
  type Position,
} from "./game/othello";
import { TitleAudioController, type AudioMix } from "./audio/titleAudio";

type Screen = "menu" | "game" | "campaign";
type GameMode = "campaign" | "local";
type CampaignScene = "approach" | "door" | "board";
type DisplayMode = "borderless" | "fullscreen" | "windowed";

const DEFAULT_AUDIO_MIX: AudioMix = {
  ambience: 0.6,
  music: 0.9,
  ui: 0.78,
};

const TITLE_FADE_DURATION_MS = 760;
const CAMPAIGN_APPROACH_DURATION_MS = 3_600;
const DOOR_MOVE_DELAY_MS = 900;
const CAMPAIGN_FLIP_DURATION_MS = 720;
const SAD_EASTER_EGG_CHANCE = 0.006;

const displayModeLabels: Record<DisplayMode, string> = {
  borderless: "Sans bordure",
  fullscreen: "Plein ecran",
  windowed: "Fenetre fixe",
};

const gameModeLabels: Record<GameMode, string> = {
  campaign: "Campagne",
  local: "Multijoueur local",
};

const playerLabels: Record<Player, string> = {
  dark: "Noir",
  light: "Blanc",
};

const CAMPAIGN_MESSAGES = {
  shadow: "Des bruits etranges emanent de l'ombre...",
  door: "Cette porte semble fermee par un lourd mecanisme.",
  eye: "Cet oeil... mieux vaut ne pas trainer la.",
  approachBoard: "Je pense pouvoir y arriver.",
  firstDoorMove: "Les... LES PIONS BOUGENT TOUT SEUL !!!??",
  darkWin: "J'ai gagne ! La porte emet un son...",
  lightWin: "...j'ai perdu...",
  draw: "Je n'ai pas reussi a forcer le mecanisme.",
  boardCleared: "J'ai gagne cette partie, la porte a emis un son.",
} as const;

const cellName = ({ row, col }: Position): string =>
  `${String.fromCharCode(65 + col)}${row + 1}`;

const positionKey = ({ row, col }: Position): string => `${row}-${col}`;

const isCornerMove = ({ row, col }: Position): boolean =>
  (row === 0 || row === 7) && (col === 0 || col === 7);

const isEdgeMove = ({ row, col }: Position): boolean =>
  row === 0 || row === 7 || col === 0 || col === 7;

const selectDoorMove = (
  board: GameState["board"],
  legalMoves: Position[],
): Position | null => {
  if (legalMoves.length === 0) {
    return null;
  }

  return [...legalMoves].sort((a, b) => {
    const aFlips = getFlipsForMove(board, "light", a).length;
    const bFlips = getFlipsForMove(board, "light", b).length;
    const aWeight = (isCornerMove(a) ? 8 : 0) + (isEdgeMove(a) ? 2 : 0) + aFlips;
    const bWeight = (isCornerMove(b) ? 8 : 0) + (isEdgeMove(b) ? 2 : 0) + bFlips;

    return aWeight - bWeight || a.row - b.row || a.col - b.col;
  })[0];
};

const applyDisplayMode = async (mode: DisplayMode) => {
  try {
    const {
      LogicalSize,
      currentMonitor,
      getCurrentWindow,
    } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    await appWindow.setCursorVisible(true);

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
  const campaignApproachTimerRef = useRef<number | null>(null);
  const campaignFlipTimerRef = useRef<number | null>(null);
  const doorMoveTimerRef = useRef<number | null>(null);
  const titleFadeTimerRef = useRef<number | null>(null);
  const [audioMix, setAudioMix] = useState<AudioMix>(DEFAULT_AUDIO_MIX);
  const [campaignChoiceOpen, setCampaignChoiceOpen] = useState(false);
  const [campaignBoardStarted, setCampaignBoardStarted] = useState(false);
  const [campaignDoorUnlocked, setCampaignDoorUnlocked] = useState(false);
  const [campaignFlippingCells, setCampaignFlippingCells] = useState<Set<string>>(
    () => new Set(),
  );
  const [campaignFlipDirection, setCampaignFlipDirection] = useState<
    "dark-to-light" | "light-to-dark"
  >("dark-to-light");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [campaignResultAnnounced, setCampaignResultAnnounced] = useState(false);
  const [campaignHotspotKeyActive, setCampaignHotspotKeyActive] = useState(false);
  const [campaignQuickMenuOpen, setCampaignQuickMenuOpen] = useState(false);
  const [campaignScene, setCampaignScene] =
    useState<CampaignScene>("approach");
  const [doorHasMoved, setDoorHasMoved] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("fullscreen");
  const [screen, setScreen] = useState<Screen>("menu");
  const [gameMode, setGameMode] = useState<GameMode>("local");
  const [game, setGame] = useState<GameState>(() => createInitialGame());
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [titleFading, setTitleFading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showLegalMoves, setShowLegalMoves] = useState(false);
  const [showCampaignHotspots, setShowCampaignHotspots] = useState(false);
  const legalMoves = useMemo(
    () => getLegalMoves(game.board, game.currentPlayer),
    [game.board, game.currentPlayer],
  );
  const score = useMemo(() => countDiscs(game.board), [game.board]);
  const lead = score.dark - score.light;
  const campaignHotspotsVisible = showCampaignHotspots || campaignHotspotKeyActive;

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "v" || event.repeat) {
        return;
      }

      if (screen !== "campaign" || settingsOpen) {
        return;
      }

      setCampaignHotspotKeyActive(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "v") {
        setCampaignHotspotKeyActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [screen, settingsOpen]);

  useEffect(() => {
    if (screen !== "campaign") {
      setCampaignHotspotKeyActive(false);
    }
  }, [screen]);

  useEffect(() => {
    return () => {
      if (campaignApproachTimerRef.current) {
        window.clearTimeout(campaignApproachTimerRef.current);
      }

      if (doorMoveTimerRef.current) {
        window.clearTimeout(doorMoveTimerRef.current);
      }

      if (campaignFlipTimerRef.current) {
        window.clearTimeout(campaignFlipTimerRef.current);
      }

      if (titleFadeTimerRef.current) {
        window.clearTimeout(titleFadeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (screen !== "campaign" || campaignScene !== "approach") {
      return;
    }

    setCampaignMessage("");
    setCampaignChoiceOpen(false);
    setCampaignQuickMenuOpen(false);
    audioControllerRef.current?.playFootsteps();

    if (campaignApproachTimerRef.current) {
      window.clearTimeout(campaignApproachTimerRef.current);
    }

    campaignApproachTimerRef.current = window.setTimeout(() => {
      campaignApproachTimerRef.current = null;
      setCampaignScene("door");
      void audioControllerRef.current
        ?.startCampaignMusic(4)
        .catch(() => undefined);
    }, CAMPAIGN_APPROACH_DURATION_MS);

    return () => {
      if (campaignApproachTimerRef.current) {
        window.clearTimeout(campaignApproachTimerRef.current);
        campaignApproachTimerRef.current = null;
      }
    };
  }, [campaignScene, screen]);

  useEffect(() => {
    if (
      screen !== "campaign" ||
      campaignScene !== "board" ||
      game.currentPlayer !== "light" ||
      game.winner
    ) {
      return;
    }

    if (doorMoveTimerRef.current) {
      window.clearTimeout(doorMoveTimerRef.current);
    }

    doorMoveTimerRef.current = window.setTimeout(() => {
      doorMoveTimerRef.current = null;
      const doorMoves = getLegalMoves(game.board, "light");
      const doorMove = selectDoorMove(game.board, doorMoves);

      if (!doorMove) {
        return;
      }

      const next = applyMove(game, doorMove);

      if (!next) {
        return;
      }

      const flippedCells = new Set(
        getFlipsForMove(game.board, "light", doorMove).map(positionKey),
      );

      setCampaignFlipDirection("dark-to-light");
      setCampaignFlippingCells(flippedCells);

      if (campaignFlipTimerRef.current) {
        window.clearTimeout(campaignFlipTimerRef.current);
      }

      campaignFlipTimerRef.current = window.setTimeout(() => {
        campaignFlipTimerRef.current = null;
        setCampaignFlippingCells(new Set());
      }, CAMPAIGN_FLIP_DURATION_MS);

      audioControllerRef.current?.playPionSound();

      if (!doorHasMoved) {
        setDoorHasMoved(true);
        setCampaignMessage(CAMPAIGN_MESSAGES.firstDoorMove);
        window.setTimeout(() => audioControllerRef.current?.playSpeak(), 160);
      }

      setGame(next);
    }, DOOR_MOVE_DELAY_MS);

    return () => {
      if (doorMoveTimerRef.current) {
        window.clearTimeout(doorMoveTimerRef.current);
        doorMoveTimerRef.current = null;
      }
    };
  }, [campaignScene, doorHasMoved, game, screen]);

  useEffect(() => {
    if (
      screen !== "campaign" ||
      campaignScene !== "board" ||
      !game.winner ||
      campaignResultAnnounced
    ) {
      return;
    }

    const message =
      game.winner === "dark"
        ? CAMPAIGN_MESSAGES.darkWin
        : game.winner === "light"
          ? CAMPAIGN_MESSAGES.lightWin
          : CAMPAIGN_MESSAGES.draw;

    setCampaignResultAnnounced(true);

    if (game.winner === "dark") {
      setCampaignDoorUnlocked(true);
    }

    setCampaignMessage(message);
    audioControllerRef.current?.playDoorLocked();
  }, [campaignResultAnnounced, campaignScene, game.winner, screen]);

  const playHoverSound = () => {
    audioControllerRef.current?.playHover();
  };

  const playSelectSound = () => {
    audioControllerRef.current?.playSelect();
  };

  const playSpeakSound = () => {
    audioControllerRef.current?.playSpeak();
  };

  const playCampaignWrongClick = () => {
    if (Math.random() < SAD_EASTER_EGG_CHANCE) {
      audioControllerRef.current?.playSadEasterEgg();
      return;
    }

    audioControllerRef.current?.playWrongClick();
  };

  const hoverAudioProps = {
    onFocus: playHoverSound,
    onPointerEnter: playHoverSound,
  };

  const showCampaignThought = (message: string) => {
    setCampaignMessage(message);
    playSpeakSound();
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

  const playCampaignMove = (position: Position) => {
    if (game.currentPlayer !== "dark" || game.winner) {
      playCampaignWrongClick();
      return;
    }

    const next = applyMove(game, position);

    if (!next) {
      playCampaignWrongClick();
      return;
    }

    const flippedCells = new Set(
      getFlipsForMove(game.board, "dark", position).map(positionKey),
    );

    setCampaignFlipDirection("light-to-dark");
    setCampaignFlippingCells(flippedCells);

    if (campaignFlipTimerRef.current) {
      window.clearTimeout(campaignFlipTimerRef.current);
    }

    campaignFlipTimerRef.current = window.setTimeout(() => {
      campaignFlipTimerRef.current = null;
      setCampaignFlippingCells(new Set());
    }, CAMPAIGN_FLIP_DURATION_MS);

    audioControllerRef.current?.playPionSound();
    setGame(next);
  };

  const beginCampaignBoard = () => {
    playSelectSound();
    if (campaignDoorUnlocked) {
      setCampaignChoiceOpen(false);
      showCampaignThought(CAMPAIGN_MESSAGES.boardCleared);
      return;
    }

    setCampaignChoiceOpen(false);
    setCampaignScene("board");
    setGameMode("campaign");
    setCampaignFlippingCells(new Set());
    setCampaignQuickMenuOpen(false);

    if (!campaignBoardStarted) {
      setGame(createInitialGame());
      setDoorHasMoved(false);
      setCampaignResultAnnounced(false);
      setCampaignBoardStarted(true);
      audioControllerRef.current?.playCampaignSting();
      showCampaignThought(CAMPAIGN_MESSAGES.approachBoard);
      return;
    }

    if (game.winner === "light") {
      setCampaignMessage(CAMPAIGN_MESSAGES.lightWin);
    } else if (game.winner === "draw") {
      setCampaignMessage(CAMPAIGN_MESSAGES.draw);
    } else {
      setCampaignMessage("");
    }
  };

  const resetCampaignScene = () => {
    playSelectSound();
    setCampaignChoiceOpen(false);
    setCampaignQuickMenuOpen(false);
    setCampaignScene("door");
    setCampaignFlippingCells(new Set());
    setCampaignMessage(
      campaignDoorUnlocked ? CAMPAIGN_MESSAGES.boardCleared : "",
    );
    void audioControllerRef.current
      ?.startCampaignMusic(2.2)
      .catch(() => undefined);
  };

  const openModeMenu = () => {
    if (titleFading) {
      return;
    }

    playSelectSound();
    setSettingsOpen(false);
    setModeMenuOpen(true);
  };

  const enterGameFromTitle = (mode: GameMode) => {
    if (titleFading) {
      return;
    }

    playSelectSound();
    setSettingsOpen(false);
    setModeMenuOpen(false);
    setTitleFading(true);
    setCampaignQuickMenuOpen(false);

    if (titleFadeTimerRef.current) {
      window.clearTimeout(titleFadeTimerRef.current);
    }

    if (mode === "campaign") {
      void audioControllerRef.current
        ?.fadeOutMenuMusic(1.2)
        .catch(() => undefined);
    }

    titleFadeTimerRef.current = window.setTimeout(() => {
      titleFadeTimerRef.current = null;
      setGameMode(mode);
      setGame(createInitialGame());
      setHasStartedGame(true);
      setDoorHasMoved(false);
      setCampaignBoardStarted(false);
      setCampaignDoorUnlocked(false);
      setCampaignResultAnnounced(false);
      setCampaignFlippingCells(new Set());
      setCampaignChoiceOpen(false);
      setCampaignMessage("");
      setCampaignScene("approach");
      setScreen(mode === "campaign" ? "campaign" : "game");
      setTitleFading(false);
    }, TITLE_FADE_DURATION_MS);
  };

  const startNewGame = () => {
    playSelectSound();
    setGame(createInitialGame());
    setHasStartedGame(true);
    setSettingsOpen(false);
    setGameMode("local");
    setScreen("game");
  };

  const resumeGame = () => {
    if (titleFading) {
      return;
    }

    playSelectSound();
    setSettingsOpen(false);
    setModeMenuOpen(false);
    setTitleFading(true);

    if (gameMode === "campaign") {
      void audioControllerRef.current
        ?.fadeOutMenuMusic(1.2)
        .catch(() => undefined);
    }

    if (titleFadeTimerRef.current) {
      window.clearTimeout(titleFadeTimerRef.current);
    }

    titleFadeTimerRef.current = window.setTimeout(() => {
      titleFadeTimerRef.current = null;
      setScreen(gameMode === "campaign" ? "campaign" : "game");
      setTitleFading(false);

      if (gameMode === "campaign" && campaignScene !== "approach") {
        void audioControllerRef.current
          ?.startCampaignMusic(2.4)
          .catch(() => undefined);
      }
    }, TITLE_FADE_DURATION_MS);
  };

  const openMenu = () => {
    playSelectSound();
    setSettingsOpen(false);
    setModeMenuOpen(false);
    if (screen === "campaign") {
      void audioControllerRef.current
        ?.returnToMenuMusic(2.8)
        .catch(() => undefined);
    }
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

  const titleModeMenu = modeMenuOpen ? (
    <div className="title-mode-menu" role="dialog" aria-modal="true">
      <section className="title-mode-dialog" aria-labelledby="title-mode-heading">
        <div className="title-mode-header">
          <div>
            <p className="title-mode-kicker">Mode de jeu</p>
            <h2 id="title-mode-heading">Choisir</h2>
          </div>
        </div>
        <div className="title-mode-section">
          <div className="title-mode-actions">
            {(Object.keys(gameModeLabels) as GameMode[]).map((mode) => (
              <button
                className={`mode-choice mode-choice-${mode}`}
                disabled={titleFading}
                key={mode}
                onClick={() => enterGameFromTitle(mode)}
                type="button"
                {...hoverAudioProps}
              >
                <span className="mode-choice-label">{gameModeLabels[mode]}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          className="title-mode-back"
          disabled={titleFading}
          onClick={() => {
            playSelectSound();
            setModeMenuOpen(false);
          }}
          type="button"
          {...hoverAudioProps}
        >
          <span aria-hidden="true" />
          Retour
        </button>
      </section>
    </div>
  ) : null;

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
              <p className="panel-kicker">Options</p>
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
              <em>Audio</em>
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
              <em>Afficher les coups</em>
            </label>

            <label className="option-toggle">
              <input
                checked={showCampaignHotspots}
                onChange={(event) => {
                  playSelectSound();
                  setShowCampaignHotspots(event.target.checked);
                }}
                type="checkbox"
              />
              <span aria-hidden="true" />
              <em>Zones cliquables</em>
            </label>
          </div>

          <div className="settings-group settings-group-audio">
            <div className="settings-group-title">
              <span className="settings-icon settings-icon-audio" aria-hidden="true" />
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

        </div>
      </section>
    </div>
  );

  const campaignQuickMenu = (
    <>
      <button
        aria-expanded={campaignQuickMenuOpen}
        aria-label="Menu campagne"
        className="campaign-menu-button"
        onClick={() => {
          playSelectSound();
          setCampaignQuickMenuOpen((isOpen) => !isOpen);
        }}
        type="button"
        {...hoverAudioProps}
      >
        <span aria-hidden="true" />
      </button>
      {campaignQuickMenuOpen ? (
        <div className="campaign-quick-menu" role="dialog" aria-label="Menu campagne">
          <button
            className="campaign-menu-entry"
            onClick={() => {
              playSelectSound();
              setSettingsOpen(true);
              setCampaignQuickMenuOpen(false);
            }}
            type="button"
            {...hoverAudioProps}
          >
            Parametres
          </button>
          <button
            className="campaign-menu-entry"
            disabled
            type="button"
          >
            Sauvegarder
          </button>
          <button
            className="campaign-menu-entry"
            onClick={openMenu}
            type="button"
            {...hoverAudioProps}
          >
            Menu
          </button>
        </div>
      ) : null}
    </>
  );

  const campaignDialogue = campaignMessage ? (
    <div className="campaign-dialogue" role="status">
      <p>{campaignMessage}</p>
    </div>
  ) : null;

  const campaignChoice = campaignChoiceOpen ? (
    <div className="campaign-choice-panel" role="dialog" aria-label="Plateau">
      <button
        className="campaign-choice-action"
        onClick={beginCampaignBoard}
        type="button"
        {...hoverAudioProps}
      >
        S'approcher
      </button>
      <button
        className="campaign-choice-action campaign-choice-cancel"
        onClick={() => {
          playSelectSound();
          setCampaignChoiceOpen(false);
        }}
        type="button"
        {...hoverAudioProps}
      >
        Annuler
      </button>
    </div>
  ) : null;

  const campaignDoorScene = (
    <div className="campaign-scene campaign-scene-door">
      <button
        aria-label="Zone non interactive"
        className="campaign-wrong-surface"
        onClick={playCampaignWrongClick}
        type="button"
      />
      <button
        aria-label="Herbes dans l'ombre"
        className="campaign-hotspot hotspot-shadow"
        onClick={() => showCampaignThought(CAMPAIGN_MESSAGES.shadow)}
        type="button"
        {...hoverAudioProps}
      />
      <button
        aria-label="Porte fermee"
        className="campaign-hotspot hotspot-door"
        onClick={() => {
          audioControllerRef.current?.playDoorLocked();
          setCampaignMessage(CAMPAIGN_MESSAGES.door);
        }}
        type="button"
        {...hoverAudioProps}
      />
      <button
        aria-label="Oeil de la porte"
        className="campaign-hotspot hotspot-eye"
        onClick={() => {
          audioControllerRef.current?.playDoorEye();
          setCampaignMessage(CAMPAIGN_MESSAGES.eye);
        }}
        type="button"
        {...hoverAudioProps}
      />
      <button
        aria-label="Plateau d'Othello avec une cle"
        className="campaign-hotspot hotspot-board"
        onClick={() => {
          playSelectSound();
          if (campaignDoorUnlocked) {
            setCampaignChoiceOpen(false);
            showCampaignThought(CAMPAIGN_MESSAGES.boardCleared);
            return;
          }

          setCampaignChoiceOpen(true);
          setCampaignMessage("");
        }}
        type="button"
        {...hoverAudioProps}
      />
      {campaignQuickMenu}
      {campaignChoice}
      {campaignDialogue}
    </div>
  );

  const campaignBoardScene = (
    <div className="campaign-scene campaign-scene-board">
      <div className="campaign-board-hud" aria-label="Etat de la partie">
        <div>
          <p className="panel-kicker">La porte</p>
          <strong>{statusText}</strong>
        </div>
        <div className="campaign-score">
          <span>Noir {score.dark}</span>
          <span>Blanc {score.light}</span>
        </div>
      </div>
      {campaignQuickMenu}
      <div className="campaign-board-grid" role="grid" aria-label="Plateau campagne">
        {game.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const legal =
              game.currentPlayer === "dark" &&
              !game.winner &&
              isLegalMove(legalMoves, position);
            const flipping = campaignFlippingCells.has(positionKey(position));

            return (
              <button
                aria-label={`${cellName(position)} ${
                  cell
                    ? `occupe par ${playerLabels[cell]}`
                    : legal
                      ? "coup legal"
                      : "case vide"
                }`}
                className={`campaign-board-cell ${legal ? "playable" : ""} ${
                  showLegalMoves && legal ? "legal" : ""
                }`}
                key={`${rowIndex}-${colIndex}`}
                onClick={() => playCampaignMove(position)}
                onFocus={legal ? playHoverSound : undefined}
                onPointerEnter={legal ? playHoverSound : undefined}
                type="button"
              >
                {cell ? (
                  <span
                    className={`campaign-disc ${cell} ${
                      flipping
                        ? campaignFlipDirection === "dark-to-light"
                          ? "is-flipping-light"
                          : "is-flipping-dark"
                        : ""
                    }`}
                    aria-hidden="true"
                  />
                ) : showLegalMoves && legal ? (
                  <span className="campaign-legal-dot" aria-hidden="true" />
                ) : null}
              </button>
            );
          }),
        )}
      </div>
      <div className="campaign-board-actions">
        <button
          className="campaign-choice-action"
          onClick={resetCampaignScene}
          type="button"
          {...hoverAudioProps}
        >
          Reculer
        </button>
      </div>
      {campaignDialogue}
    </div>
  );

  if (screen === "menu") {
    return (
      <main className="app-shell landing-shell">
        <section
          className={`asset-title-screen${titleFading ? " is-fading" : ""}`}
          aria-label="Accueil Othello Island"
        >
          <div className="asset-title-background" aria-hidden="true" />
          <div className="asset-title-logo" aria-hidden="true" />

          <nav className="asset-title-menu" aria-label="Menu principal">
            <div className="asset-title-menu-panel" aria-hidden="true" />
            <div className="asset-title-actions">
              <button
                aria-label="Ouvrir le choix du mode de jeu"
                className="title-action title-action-enter"
                disabled={titleFading}
                onClick={openModeMenu}
                type="button"
                {...hoverAudioProps}
              />
              <button
                aria-label="Reprendre la partie"
                className="title-action title-action-resume"
                disabled={!hasStartedGame || titleFading}
                onClick={resumeGame}
                type="button"
                {...(hasStartedGame && !titleFading ? hoverAudioProps : {})}
              />
              <button
                aria-label="Parametres"
                className="title-action title-action-settings"
                disabled={titleFading}
                onClick={() => {
                  playSelectSound();
                  setModeMenuOpen(false);
                  setSettingsOpen(true);
                }}
                type="button"
                {...hoverAudioProps}
              />
              <button
                aria-label="Quitter"
                className="title-action title-action-quit"
                disabled={titleFading}
                onClick={() => void quitGame()}
                type="button"
                {...hoverAudioProps}
              />
            </div>
          </nav>

          <div className="asset-title-footer" aria-hidden="true" />
          {titleModeMenu}
          {titleFading ? <div className="title-fade-overlay" aria-hidden="true" /> : null}
        </section>
        {settingsOpen ? settingsPanel : null}
      </main>
    );
  }

  if (screen === "campaign") {
    return (
      <main className="app-shell campaign-shell">
        <section
          className={`campaign-stage campaign-stage-${campaignScene}${
            campaignHotspotsVisible ? " campaign-hotspots-visible" : ""
          }`}
          aria-label="Campagne Othello Island"
        >
          {campaignScene === "approach" ? (
            <div className="campaign-scene campaign-scene-far" aria-hidden="true" />
          ) : campaignScene === "door" ? (
            campaignDoorScene
          ) : (
            campaignBoardScene
          )}
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
          <p className="eyebrow">{gameModeLabels[gameMode]}</p>
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
