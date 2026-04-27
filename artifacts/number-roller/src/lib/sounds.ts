import type { RarityKey } from "./types";

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

type Note = {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

function playNotes(notes: Note[]) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const master = c.createGain();
  master.gain.setValueAtTime(0.18, now);
  master.connect(c.destination);
  for (const n of notes) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = n.type ?? "triangle";
    osc.frequency.setValueAtTime(n.freq, now + n.start);
    const peak = n.gain ?? 1;
    gain.gain.setValueAtTime(0, now + n.start);
    gain.gain.linearRampToValueAtTime(peak, now + n.start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + n.start + n.duration,
    );
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.duration + 0.05);
  }
}

export function playRollClick() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(now + 0.1);
}

/**
 * Sharp slot-machine "tick" — short high click used while reels are spinning.
 */
export function playRollTick() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.025);
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(now + 0.05);
}

export function playRarity(key: RarityKey) {
  switch (key) {
    case "common":
      playNotes([{ freq: 440, start: 0, duration: 0.18, type: "sine" }]);
      break;
    case "uncommon":
      playNotes([
        { freq: 523.25, start: 0, duration: 0.18, type: "sine" },
        { freq: 659.25, start: 0.08, duration: 0.22, type: "sine" },
      ]);
      break;
    case "rare":
      playNotes([
        { freq: 523.25, start: 0, duration: 0.2, type: "triangle" },
        { freq: 659.25, start: 0.1, duration: 0.2, type: "triangle" },
        { freq: 783.99, start: 0.2, duration: 0.3, type: "triangle" },
      ]);
      break;
    case "epic":
      playNotes([
        { freq: 261.63, start: 0, duration: 0.4, type: "sawtooth", gain: 0.6 },
        { freq: 329.63, start: 0, duration: 0.4, type: "sawtooth", gain: 0.6 },
        { freq: 392.0, start: 0, duration: 0.4, type: "sawtooth", gain: 0.6 },
        { freq: 523.25, start: 0.15, duration: 0.5, type: "triangle" },
      ]);
      break;
    case "legendary":
      playNotes([
        { freq: 392.0, start: 0, duration: 0.5, type: "triangle" },
        { freq: 523.25, start: 0.12, duration: 0.5, type: "triangle" },
        { freq: 659.25, start: 0.24, duration: 0.5, type: "triangle" },
        { freq: 783.99, start: 0.36, duration: 0.6, type: "triangle" },
        { freq: 1046.5, start: 0.48, duration: 0.7, type: "triangle" },
      ]);
      break;
    case "mythic":
      playNotes([
        { freq: 65.41, start: 0, duration: 1.2, type: "sawtooth", gain: 0.7 },
        { freq: 130.81, start: 0, duration: 1.2, type: "sawtooth", gain: 0.6 },
        { freq: 164.81, start: 0.2, duration: 1.0, type: "triangle" },
        { freq: 196.0, start: 0.4, duration: 1.0, type: "triangle" },
        { freq: 261.63, start: 0.6, duration: 1.0, type: "triangle" },
        { freq: 392.0, start: 0.8, duration: 0.9, type: "triangle" },
        { freq: 523.25, start: 1.0, duration: 0.9, type: "triangle" },
      ]);
      break;
  }
}

export function playPetDrop() {
  playNotes([
    { freq: 600, start: 0, duration: 0.12, type: "sine" },
    { freq: 900, start: 0.08, duration: 0.12, type: "sine" },
    { freq: 1200, start: 0.16, duration: 0.18, type: "sine" },
  ]);
}

export function playPurchase() {
  playNotes([
    { freq: 880, start: 0, duration: 0.1, type: "sine" },
    { freq: 1320, start: 0.06, duration: 0.14, type: "sine" },
  ]);
}

export function playLevelUp() {
  playNotes([
    { freq: 523.25, start: 0, duration: 0.15, type: "triangle" },
    { freq: 659.25, start: 0.1, duration: 0.15, type: "triangle" },
    { freq: 783.99, start: 0.2, duration: 0.2, type: "triangle" },
    { freq: 1046.5, start: 0.32, duration: 0.3, type: "triangle" },
  ]);
}

export function playAchievement() {
  playNotes([
    { freq: 880, start: 0, duration: 0.12, type: "triangle" },
    { freq: 1108.73, start: 0.1, duration: 0.12, type: "triangle" },
    { freq: 1318.51, start: 0.2, duration: 0.2, type: "triangle" },
  ]);
}

export function playError() {
  playNotes([
    { freq: 200, start: 0, duration: 0.12, type: "square", gain: 0.5 },
    { freq: 150, start: 0.1, duration: 0.16, type: "square", gain: 0.5 },
  ]);
}
