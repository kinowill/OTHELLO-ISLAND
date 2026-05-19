import oceanLoopUrl from "../assets/audio/amb_ocean_night_wind_loop_01.wav";
import windLoopUrl from "../assets/audio/amb_wind_loop_01.mp3";
import menuMusicUrl from "../assets/audio/mus_menu_16bit_secret_island_loop.mp3";
import hoverUrl from "../assets/audio/ui_hover_01.wav";
import selectUrl from "../assets/audio/ui_select_01.wav";

type AudioAsset = "ocean" | "wind" | "music" | "hover" | "select";
type LoopAsset = "ocean" | "music";
type OneShotAsset = "hover" | "select";

export type AudioMix = {
  ambience: number;
  music: number;
  ui: number;
};

const AUDIO_URLS: Record<AudioAsset, string> = {
  ocean: oceanLoopUrl,
  wind: windLoopUrl,
  music: menuMusicUrl,
  hover: hoverUrl,
  select: selectUrl,
};

// Calibrated from ffmpeg volumedetect; source levels differ a lot.
const BASE_AUDIO_GAINS: Record<AudioAsset | "master", number> = {
  master: 0.82,
  ocean: 0.82,
  wind: 0.28,
  music: 0.08,
  hover: 12,
  select: 0.55,
};

const DEFAULT_MIX: AudioMix = {
  ambience: 0.86,
  music: 0.72,
  ui: 0.82,
};

const AMBIENCE_FADE_IN_SECONDS = 5.2;
const MUSIC_START_DELAY_MS = 4_500;
const MUSIC_FADE_IN_SECONDS = 7.5;
const WIND_DELAY_RANGE_MS = [7_000, 21_000] as const;
const WIND_DURATION_RANGE_SECONDS = [13, 31] as const;
const WIND_FADE_IN_SECONDS = 2.4;
const WIND_FADE_OUT_SECONDS = 3.4;
const HOVER_THROTTLE_MS = 120;

type LoopNode = {
  asset: LoopAsset;
  gain: GainNode;
  source: AudioBufferSourceNode;
};

type WindNode = {
  gain: GainNode;
  intensity: number;
  source: AudioBufferSourceNode;
};

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const getAudioContextConstructor = () =>
  window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;

export class TitleAudioController {
  private activeWind: WindNode | null = null;
  private buffers = new Map<AudioAsset, AudioBuffer>();
  private context: AudioContext | null = null;
  private enabled = true;
  private lastHoverAt = 0;
  private lastSelectAt = 0;
  private loading: Promise<void> | null = null;
  private loopNodes = new Map<LoopAsset, LoopNode>();
  private masterGain: GainNode | null = null;
  private mix: AudioMix = DEFAULT_MIX;
  private musicTimer: number | null = null;
  private windTimer: number | null = null;

  setMix(mix: AudioMix) {
    this.mix = {
      ambience: this.clampMixValue(mix.ambience),
      music: this.clampMixValue(mix.music),
      ui: this.clampMixValue(mix.ui),
    };

    this.updateLoopGain("ocean");
    this.updateLoopGain("music");
    this.updateActiveWindGain();
  }

  async setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (!enabled) {
      this.stopAll();
      return;
    }

    await this.start();
  }

  async unlock() {
    if (!this.enabled) {
      return;
    }

    await this.start();
    await this.resumeContext();
  }

  playHover() {
    this.playOneShot("hover", HOVER_THROTTLE_MS);
  }

  playSelect() {
    this.playOneShot("select", 80);
  }

  dispose() {
    this.enabled = false;
    this.stopAll();

    if (this.context && this.context.state !== "closed") {
      void this.context.close();
    }
  }

  private async start() {
    await this.ensureReady();

    if (!this.enabled) {
      return;
    }

    await this.resumeContext();
    this.startLoop("ocean", AMBIENCE_FADE_IN_SECONDS);
    this.scheduleMusic();
    this.scheduleWind();
  }

  private async ensureReady() {
    if (!this.context) {
      const AudioContextConstructor = getAudioContextConstructor();

      if (!AudioContextConstructor) {
        throw new Error("Web Audio is not supported in this environment.");
      }

      this.context = new AudioContextConstructor();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = BASE_AUDIO_GAINS.master;
      this.masterGain.connect(this.context.destination);
    }

    await this.loadBuffers();
  }

  private getAssetGain(asset: AudioAsset): number {
    const baseGain = BASE_AUDIO_GAINS[asset];

    if (asset === "music") {
      return baseGain * this.mix.music;
    }

    if (asset === "ocean" || asset === "wind") {
      return baseGain * this.mix.ambience;
    }

    return baseGain * this.mix.ui;
  }

  private async loadBuffers() {
    if (this.loading) {
      return this.loading;
    }

    this.loading = Promise.all(
      Object.entries(AUDIO_URLS).map(async ([asset, url]) => {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const buffer = await this.context!.decodeAudioData(data);
        this.buffers.set(asset as AudioAsset, buffer);
      }),
    ).then(() => undefined);

    return this.loading;
  }

  private playOneShot(asset: OneShotAsset, throttleMs: number) {
    if (!this.enabled) {
      return;
    }

    void this.unlock();

    const now = performance.now();
    const context = this.context;
    const masterGain = this.masterGain;
    const buffer = this.buffers.get(asset);
    const lastPlayedAt = asset === "hover" ? this.lastHoverAt : this.lastSelectAt;

    if (
      !context ||
      !masterGain ||
      !buffer ||
      context.state !== "running" ||
      now - lastPlayedAt < throttleMs
    ) {
      return;
    }

    if (asset === "hover") {
      this.lastHoverAt = now;
    } else {
      this.lastSelectAt = now;
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = this.getAssetGain(asset);
    source.buffer = buffer;
    source.connect(gain).connect(masterGain);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
    source.start();
  }

  private playWindGust() {
    if (!this.context || !this.masterGain || !this.enabled) {
      return;
    }

    const buffer = this.buffers.get("wind");
    const baseWindGain = this.getAssetGain("wind");

    if (!buffer || baseWindGain <= 0) {
      this.scheduleWind();
      return;
    }

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const duration = randomBetween(
      WIND_DURATION_RANGE_SECONDS[0],
      WIND_DURATION_RANGE_SECONDS[1],
    );
    const offset = randomBetween(0, Math.max(0, buffer.duration - 0.2));
    const intensity = randomBetween(0.75, 1.12);
    const targetGain = baseWindGain * intensity;
    const fadeOutAt =
      now + Math.max(WIND_FADE_IN_SECONDS, duration - WIND_FADE_OUT_SECONDS);

    source.buffer = buffer;
    source.loop = true;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + WIND_FADE_IN_SECONDS);
    gain.gain.setValueAtTime(targetGain, fadeOutAt);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    source.connect(gain).connect(this.masterGain);
    source.onended = () => {
      if (this.activeWind?.source === source) {
        this.activeWind = null;
      }

      source.disconnect();
      gain.disconnect();
      this.scheduleWind();
    };

    this.activeWind = { gain, intensity, source };
    source.start(now, offset);
    source.stop(now + duration + 0.2);
  }

  private async resumeContext() {
    if (!this.context || this.context.state !== "suspended") {
      return;
    }

    try {
      await this.context.resume();
    } catch {
      // Browsers may refuse until the next click/keydown; the unlock listener retries.
    }
  }

  private scheduleMusic() {
    if (this.loopNodes.has("music") || this.musicTimer || !this.enabled) {
      return;
    }

    this.musicTimer = window.setTimeout(() => {
      this.musicTimer = null;
      this.startLoop("music", MUSIC_FADE_IN_SECONDS);
    }, MUSIC_START_DELAY_MS);
  }

  private scheduleWind() {
    if (this.windTimer || this.activeWind || !this.enabled) {
      return;
    }

    const delay = randomBetween(WIND_DELAY_RANGE_MS[0], WIND_DELAY_RANGE_MS[1]);

    this.windTimer = window.setTimeout(() => {
      this.windTimer = null;
      this.playWindGust();
    }, delay);
  }

  private startLoop(asset: LoopAsset, fadeSeconds: number) {
    if (!this.context || !this.masterGain || this.loopNodes.has(asset)) {
      return;
    }

    const buffer = this.buffers.get(asset);

    if (!buffer) {
      return;
    }

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const offset = randomBetween(0, Math.max(0, buffer.duration - 0.2));
    const now = this.context.currentTime;
    const targetGain = this.getAssetGain(asset);

    source.buffer = buffer;
    source.loop = true;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + fadeSeconds);
    source.connect(gain).connect(this.masterGain);
    source.start(now, offset);
    this.loopNodes.set(asset, { asset, gain, source });
  }

  private stopAll() {
    if (this.musicTimer) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }

    if (this.windTimer) {
      window.clearTimeout(this.windTimer);
      this.windTimer = null;
    }

    this.loopNodes.forEach(({ gain, source }) => {
      this.stopSource(source);
      source.disconnect();
      gain.disconnect();
    });
    this.loopNodes.clear();

    if (this.activeWind) {
      this.stopSource(this.activeWind.source);
      this.activeWind.source.disconnect();
      this.activeWind.gain.disconnect();
      this.activeWind = null;
    }
  }

  private updateActiveWindGain() {
    if (!this.context || !this.activeWind) {
      return;
    }

    const now = this.context.currentTime;
    const targetGain = this.getAssetGain("wind") * this.activeWind.intensity;
    this.activeWind.gain.gain.cancelScheduledValues(now);
    this.activeWind.gain.gain.setValueAtTime(this.activeWind.gain.gain.value, now);
    this.activeWind.gain.gain.linearRampToValueAtTime(targetGain, now + 0.35);
  }

  private updateLoopGain(asset: LoopAsset) {
    if (!this.context) {
      return;
    }

    const node = this.loopNodes.get(asset);

    if (!node) {
      return;
    }

    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setValueAtTime(node.gain.gain.value, now);
    node.gain.gain.linearRampToValueAtTime(this.getAssetGain(node.asset), now + 0.35);
  }

  private clampMixValue(value: number): number {
    return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  }

  private stopSource(source: AudioBufferSourceNode) {
    try {
      source.stop();
    } catch {
      // Source may already be stopped.
    }
  }
}

