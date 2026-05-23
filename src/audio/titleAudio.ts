import oceanLoopUrl from "../assets/audio/amb_ocean_night_wind_loop_01.wav";
import windLoopUrl from "../assets/audio/amb_wind_loop_01.mp3";
import menuMusicUrl from "../assets/audio/mus_menu_16bit_secret_island_loop.mp3";
import hoverUrl from "../assets/audio/ui_hover_01.wav";
import selectUrl from "../assets/audio/ui_select_01.wav";
import campaignBackgroundUrl from "../assets/campaign/campaign-background-loop.mp3";
import campaignStingUrl from "../assets/campaign/campaign-sting-map1.mp3";
import doorEyeUrl from "../assets/campaign/door-eye.wav";
import doorLockedUrl from "../assets/campaign/door-locked.wav";
import footstepsUrl from "../assets/campaign/footsteps-walking-boots.mp3";
import pionSoundUrl from "../assets/campaign/pion-sound.wav";
import sadEasterEggUrl from "../assets/campaign/sad-easter-egg.mp3";
import wrongClickUrl from "../assets/campaign/click-wrong.wav";
import speakUrl from "../assets/campaign/speak.wav";
import hallDropletsUrl from "../assets/campaign/hall-droplets.mp3";
import hallWindUrl from "../assets/campaign/hall-cave-wind.mp3";

type AudioAsset =
  | "ocean"
  | "wind"
  | "music"
  | "campaignBackground"
  | "campaignSting"
  | "hallDroplets"
  | "hallWind"
  | "sadEasterEgg"
  | "hover"
  | "select"
  | "doorLocked"
  | "doorEye"
  | "footsteps"
  | "pionSound"
  | "wrongClick"
  | "speak";
type LoopAsset =
  | "ocean"
  | "music"
  | "campaignBackground"
  | "hallDroplets"
  | "hallWind";
type OneShotAsset =
  | "hover"
  | "select"
  | "campaignSting"
  | "sadEasterEgg"
  | "doorLocked"
  | "doorEye"
  | "footsteps"
  | "pionSound"
  | "wrongClick"
  | "speak";

export type AudioMix = {
  ambience: number;
  music: number;
  ui: number;
};

const AUDIO_URLS: Record<AudioAsset, string> = {
  ocean: oceanLoopUrl,
  wind: windLoopUrl,
  music: menuMusicUrl,
  campaignBackground: campaignBackgroundUrl,
  campaignSting: campaignStingUrl,
  hallDroplets: hallDropletsUrl,
  hallWind: hallWindUrl,
  sadEasterEgg: sadEasterEggUrl,
  hover: hoverUrl,
  select: selectUrl,
  doorLocked: doorLockedUrl,
  doorEye: doorEyeUrl,
  footsteps: footstepsUrl,
  pionSound: pionSoundUrl,
  wrongClick: wrongClickUrl,
  speak: speakUrl,
};

// Calibrated from ffmpeg volumedetect; source levels differ a lot.
const BASE_AUDIO_GAINS: Record<AudioAsset | "master", number> = {
  master: 0.82,
  ocean: 0.76,
  wind: 0.22,
  music: 0.1,
  campaignBackground: 0.13,
  campaignSting: 0.09,
  hallDroplets: 0.34,
  hallWind: 0.2,
  sadEasterEgg: 0.08,
  hover: 12,
  select: 0.55,
  doorLocked: 0.68,
  doorEye: 0.62,
  footsteps: 0.74,
  pionSound: 0.58,
  wrongClick: 0.72,
  speak: 0.78,
};

const DEFAULT_MIX: AudioMix = {
  ambience: 0.6,
  music: 0.9,
  ui: 0.78,
};

const AMBIENCE_FADE_IN_SECONDS = 5.2;
const MUSIC_START_DELAY_MS = 0;
const MUSIC_FADE_IN_SECONDS = 4.2;
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

type OneShotNode = {
  gain: GainNode;
  source: AudioBufferSourceNode;
};

type OneShotOptions = {
  durationSeconds?: number;
  fadeOutSeconds?: number;
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
  private ambienceMode: "exterior" | "hall" = "exterior";
  private buffers = new Map<AudioAsset, AudioBuffer>();
  private context: AudioContext | null = null;
  private enabled = true;
  private lastOneShotAt = new Map<OneShotAsset, number>();
  private loading: Promise<void> | null = null;
  private loopNodes = new Map<LoopAsset, LoopNode>();
  private masterGain: GainNode | null = null;
  private menuMusicAllowed = true;
  private mix: AudioMix = DEFAULT_MIX;
  private musicTimer: number | null = null;
  private restartableOneShots = new Map<OneShotAsset, OneShotNode>();
  private windTimer: number | null = null;

  setMix(mix: AudioMix) {
    this.mix = {
      ambience: this.clampMixValue(mix.ambience),
      music: this.clampMixValue(mix.music),
      ui: this.clampMixValue(mix.ui),
    };

    this.updateLoopGain("ocean");
    this.updateLoopGain("music");
    this.updateLoopGain("campaignBackground");
    this.updateLoopGain("hallDroplets");
    this.updateLoopGain("hallWind");
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

  playCampaignSting() {
    void this.playRestartableOneShot("campaignSting");
  }

  stopCampaignSting(fadeSeconds = 0.45) {
    this.stopRestartableOneShot("campaignSting", fadeSeconds);
  }

  playSadEasterEgg() {
    this.playOneShot("sadEasterEgg", 180_000);
  }

  playDoorLocked() {
    this.playOneShot("doorLocked", 120);
  }

  playDoorEye() {
    this.playOneShot("doorEye", 120);
  }

  playFootsteps() {
    this.playOneShot("footsteps", 500, {
      durationSeconds: 2.15,
      fadeOutSeconds: 0.55,
    });
  }

  playPionSound() {
    this.playOneShot("pionSound", 80);
  }

  playWrongClick() {
    this.playOneShot("wrongClick", 90);
  }

  playSpeak() {
    this.playOneShot("speak", 80);
  }

  async fadeOutMenuMusic(fadeSeconds = 1.2) {
    this.ambienceMode = "exterior";
    this.menuMusicAllowed = false;
    await this.ensureReady();
    this.clearMusicTimer();
    this.stopLoop("music", fadeSeconds);
  }

  async startCampaignMusic(fadeSeconds = 4) {
    this.ambienceMode = "exterior";
    this.menuMusicAllowed = false;
    await this.unlock();
    this.clearMusicTimer();
    this.stopLoop("hallDroplets", 1.2);
    this.stopLoop("hallWind", 1.2);
    this.stopLoop("music", 0.9);
    this.startLoop("campaignBackground", fadeSeconds);
  }

  async startHallAmbience(fadeSeconds = 3) {
    this.ambienceMode = "hall";
    this.menuMusicAllowed = false;
    await this.ensureReady();
    await this.resumeContext();

    if (!this.enabled) {
      return;
    }

    this.clearMusicTimer();
    this.clearWindTimer();
    this.stopCampaignSting(0.8);
    this.stopLoop("music", 0.8);
    this.stopLoop("campaignBackground", 1.5);
    this.stopLoop("ocean", 1.2);
    this.stopActiveWind(1);
    this.startLoop("hallDroplets", fadeSeconds);
    this.startLoop("hallWind", fadeSeconds + 0.4);
  }

  async returnToMenuMusic(fadeSeconds = 2.8) {
    this.ambienceMode = "exterior";
    this.menuMusicAllowed = true;
    await this.unlock();
    this.clearMusicTimer();
    this.stopCampaignSting(0.8);
    this.stopLoop("campaignBackground", 1.4);
    this.stopLoop("hallDroplets", 1.2);
    this.stopLoop("hallWind", 1.2);
    this.startLoop("music", fadeSeconds);
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
    if (this.ambienceMode === "hall") {
      this.clearMusicTimer();
      this.clearWindTimer();
      this.stopLoop("music", 0.5);
      this.stopLoop("campaignBackground", 0.5);
      this.stopLoop("ocean", 0.5);
      this.stopActiveWind(0.5);
      this.startLoop("hallDroplets", 1.4);
      this.startLoop("hallWind", 1.8);
      return;
    }

    this.stopLoop("hallDroplets", 1);
    this.stopLoop("hallWind", 1);
    this.startLoop("ocean", AMBIENCE_FADE_IN_SECONDS);

    if (this.menuMusicAllowed) {
      this.scheduleMusic();
    } else {
      this.clearMusicTimer();
      this.stopLoop("music", 0.5);
    }

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

    if (
      asset === "music" ||
      asset === "campaignBackground" ||
      asset === "campaignSting" ||
      asset === "sadEasterEgg"
    ) {
      return baseGain * this.mix.music;
    }

    if (
      asset === "ocean" ||
      asset === "wind" ||
      asset === "hallDroplets" ||
      asset === "hallWind" ||
      asset === "footsteps"
    ) {
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

  private playOneShot(
    asset: OneShotAsset,
    throttleMs: number,
    options: OneShotOptions = {},
  ) {
    if (!this.enabled) {
      return;
    }

    void this.unlock();

    const now = performance.now();
    const context = this.context;
    const masterGain = this.masterGain;
    const buffer = this.buffers.get(asset);
    const lastPlayedAt = this.lastOneShotAt.get(asset) ?? 0;

    if (
      !context ||
      !masterGain ||
      !buffer ||
      context.state !== "running" ||
      now - lastPlayedAt < throttleMs
    ) {
      return;
    }

    this.lastOneShotAt.set(asset, now);
    this.createOneShotNode(asset, options);
  }

  private async playRestartableOneShot(
    asset: OneShotAsset,
    options: OneShotOptions = {},
  ) {
    if (!this.enabled) {
      return;
    }

    await this.unlock();
    this.stopRestartableOneShot(asset, 0.12);

    const node = this.createOneShotNode(asset, options);

    if (node) {
      this.restartableOneShots.set(asset, node);
    }
  }

  private createOneShotNode(
    asset: OneShotAsset,
    options: OneShotOptions = {},
  ): OneShotNode | null {
    const context = this.context;
    const masterGain = this.masterGain;
    const buffer = this.buffers.get(asset);

    if (!context || !masterGain || !buffer || context.state !== "running") {
      return null;
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;
    const durationSeconds = Math.min(
      options.durationSeconds ?? buffer.duration,
      buffer.duration,
    );
    const fadeOutSeconds = Math.max(
      0,
      Math.min(options.fadeOutSeconds ?? 0, durationSeconds),
    );
    const fadeStart = now + Math.max(0, durationSeconds - fadeOutSeconds);
    const stopAt = now + durationSeconds + 0.03;

    gain.gain.setValueAtTime(this.getAssetGain(asset), now);

    if (fadeOutSeconds > 0) {
      gain.gain.setValueAtTime(this.getAssetGain(asset), fadeStart);
      gain.gain.linearRampToValueAtTime(0, now + durationSeconds);
    }

    source.buffer = buffer;
    source.connect(gain).connect(masterGain);
    source.onended = () => {
      if (this.restartableOneShots.get(asset)?.source === source) {
        this.restartableOneShots.delete(asset);
      }

      source.disconnect();
      gain.disconnect();
    };
    source.start();
    source.stop(stopAt);

    return { gain, source };
  }

  private stopRestartableOneShot(asset: OneShotAsset, fadeSeconds = 0) {
    const node = this.restartableOneShots.get(asset);

    if (!node || !this.context) {
      return;
    }

    this.restartableOneShots.delete(asset);

    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setValueAtTime(node.gain.gain.value, now);

    if (fadeSeconds > 0) {
      node.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
      try {
        node.source.stop(now + fadeSeconds + 0.03);
      } catch {
        // Source may already be scheduled to stop.
      }
    } else {
      this.stopSource(node.source);
    }
  }

  private playWindGust() {
    if (
      !this.context ||
      !this.masterGain ||
      !this.enabled ||
      this.ambienceMode !== "exterior"
    ) {
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
    if (
      this.loopNodes.has("music") ||
      this.musicTimer ||
      !this.enabled ||
      !this.menuMusicAllowed
    ) {
      return;
    }

    this.musicTimer = window.setTimeout(() => {
      this.musicTimer = null;
      this.startLoop("music", MUSIC_FADE_IN_SECONDS);
    }, MUSIC_START_DELAY_MS);
  }

  private scheduleWind() {
    if (
      this.windTimer ||
      this.activeWind ||
      !this.enabled ||
      this.ambienceMode !== "exterior"
    ) {
      return;
    }

    const delay = randomBetween(WIND_DELAY_RANGE_MS[0], WIND_DELAY_RANGE_MS[1]);

    this.windTimer = window.setTimeout(() => {
      this.windTimer = null;
      this.playWindGust();
    }, delay);
  }

  private clearMusicTimer() {
    if (this.musicTimer) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private clearWindTimer() {
    if (this.windTimer) {
      window.clearTimeout(this.windTimer);
      this.windTimer = null;
    }
  }

  private startLoop(asset: LoopAsset, fadeSeconds: number) {
    if (
      !this.context ||
      !this.masterGain ||
      this.loopNodes.has(asset) ||
      !this.enabled
    ) {
      return;
    }

    const buffer = this.buffers.get(asset);

    if (!buffer) {
      return;
    }

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const offset =
      asset === "campaignBackground"
        ? 0
        : randomBetween(0, Math.max(0, buffer.duration - 0.2));
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

  private stopLoop(asset: LoopAsset, fadeSeconds = 0) {
    if (!this.context) {
      return;
    }

    const node = this.loopNodes.get(asset);

    if (!node) {
      return;
    }

    this.loopNodes.delete(asset);
    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setValueAtTime(node.gain.gain.value, now);

    if (fadeSeconds > 0) {
      node.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
      node.source.stop(now + fadeSeconds + 0.05);
    } else {
      this.stopSource(node.source);
    }

    node.source.onended = () => {
      node.source.disconnect();
      node.gain.disconnect();
    };
  }

  private stopAll() {
    this.clearMusicTimer();

    this.clearWindTimer();

    this.loopNodes.forEach(({ gain, source }) => {
      this.stopSource(source);
      source.disconnect();
      gain.disconnect();
    });
    this.loopNodes.clear();

    this.restartableOneShots.forEach(({ gain, source }) => {
      this.stopSource(source);
      source.disconnect();
      gain.disconnect();
    });
    this.restartableOneShots.clear();

    if (this.activeWind) {
      this.stopActiveWind();
    }
  }

  private stopActiveWind(fadeSeconds = 0) {
    if (!this.context || !this.activeWind) {
      return;
    }

    const node = this.activeWind;
    const now = this.context.currentTime;
    this.activeWind = null;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setValueAtTime(node.gain.gain.value, now);

    if (fadeSeconds > 0) {
      node.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
      try {
        node.source.stop(now + fadeSeconds + 0.05);
      } catch {
        // Source may already be scheduled to stop.
      }
    } else {
      this.stopSource(node.source);
    }

    node.source.onended = () => {
      node.source.disconnect();
      node.gain.disconnect();
    };
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
