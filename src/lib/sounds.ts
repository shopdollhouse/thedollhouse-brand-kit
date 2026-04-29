let _audioCtx: AudioContext | null = null;

function getACtx(): AudioContext {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

export function playClick(type: 'soft' | 'select' | 'success' | 'back' = 'soft') {
  try {
    const ctx = getACtx();
    const g = ctx.createGain();
    g.connect(ctx.destination);

    if (type === 'soft') {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      o.connect(g); o.start(); o.stop(ctx.currentTime + 0.22);
    } else if (type === 'select') {
      [0, 0.06].forEach((d, i) => {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(i === 0 ? 660 : 880, ctx.currentTime + d);
        const lg = ctx.createGain();
        lg.gain.setValueAtTime(0.14, ctx.currentTime + d);
        lg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.2);
        o.connect(lg); lg.connect(ctx.destination);
        o.start(ctx.currentTime + d); o.stop(ctx.currentTime + d + 0.2);
      });
    } else if (type === 'success') {
      [0, 0.1, 0.22].forEach((d, i) => {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime([523, 659, 784][i], ctx.currentTime + d);
        const lg = ctx.createGain();
        lg.gain.setValueAtTime(0.15, ctx.currentTime + d);
        lg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.3);
        o.connect(lg); lg.connect(ctx.destination);
        o.start(ctx.currentTime + d); o.stop(ctx.currentTime + d + 0.3);
      });
    } else if (type === 'back') {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.14);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o.connect(g); o.start(); o.stop(ctx.currentTime + 0.2);
    }
  } catch (_) {}
}

// Luxury chime — played when gate unlocks
export function playChime() {
  try {
    const ctx = getACtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  } catch (_) {}
}

// Room unlock notification sound — gentle single tone
export function playRoomUnlock() {
  try {
    const ctx = getACtx();
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(698.46, ctx.currentTime); // F5
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

// Ambient sound engine
let ambientCtx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let ambientSource: AudioBufferSourceNode | null = null;

export function toggleAmbientTrack(trackIndex: number, currentTrack: number, volume: number): number {
  try {
    const ctx = ambientCtx || (ambientCtx = new (window.AudioContext || (window as any).webkitAudioContext)());
    if (ctx.state === 'suspended') ctx.resume();

    if (currentTrack === trackIndex) {
      if (ambientGain) ambientGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      return -1;
    }

    if (ambientSource) { try { ambientSource.stop(); } catch (_) {} }

    if (!ambientGain) { ambientGain = ctx.createGain(); ambientGain.connect(ctx.destination); }
    ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    ambientGain.gain.setTargetAtTime(Math.min(volume, 0.38), ctx.currentTime, 0.8);

    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let j = 0; j < d.length; j++) d[j] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter();
    const profiles: { type: BiquadFilterType; frequency: number; q: number }[] = [
      { type: 'lowpass', frequency: 560, q: 0.32 },  // Soft Pink Noise
      { type: 'lowpass', frequency: 430, q: 0.18 },  // Blush Silk Hiss
      { type: 'bandpass', frequency: 220, q: 0.42 },  // Vanity Room Hum
      { type: 'lowpass', frequency: 760, q: 0.14 },  // Champagne Air
      { type: 'bandpass', frequency: 680, q: 0.24 },  // Rose Quartz Rain
    ];
    const profile = profiles[trackIndex] || profiles[0];
    f.type = profile.type;
    f.frequency.value = profile.frequency;
    f.Q.value = profile.q;

    const warmth = ctx.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.value = trackIndex === 3 ? 980 : 820;
    warmth.Q.value = 0.12;

    src.connect(f); f.connect(warmth); warmth.connect(ambientGain); src.start();
    ambientSource = src;
    return trackIndex;
  } catch (_) {
    return -1;
  }
}

export function setAmbientVolume(vol: number) {
  if (ambientGain && ambientCtx) {
    ambientGain.gain.setTargetAtTime(vol, ambientCtx.currentTime, 0.1);
  }
}

let _ambientPaused = false;
let _savedVolume = 0.45;

export function pauseAmbient(): boolean {
  if (!ambientCtx || !ambientGain) return false;
  if (_ambientPaused) {
    // Resume
    ambientCtx.resume();
    ambientGain.gain.setTargetAtTime(_savedVolume, ambientCtx.currentTime, 0.15);
    _ambientPaused = false;
    return false;
  } else {
    // Pause
    _savedVolume = ambientGain.gain.value || 0.45;
    ambientGain.gain.setTargetAtTime(0, ambientCtx.currentTime, 0.15);
    setTimeout(() => { if (_ambientPaused && ambientCtx) ambientCtx.suspend(); }, 200);
    _ambientPaused = true;
    return true;
  }
}

export function isAmbientPaused(): boolean { return _ambientPaused; }

// Door click sound — subtle mechanical click for gate unlock
export function playDoorClick() {
  try {
    const ctx = getACtx();
    // Click 1 — sharp transient
    const o1 = ctx.createOscillator(); o1.type = 'square';
    o1.frequency.setValueAtTime(2200, ctx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.12, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    o1.connect(g1); g1.connect(ctx.destination);
    o1.start(); o1.stop(ctx.currentTime + 0.06);
    // Click 2 — deeper latch
    const o2 = ctx.createOscillator(); o2.type = 'sine';
    o2.frequency.setValueAtTime(300, ctx.currentTime + 0.04);
    o2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.08, ctx.currentTime + 0.04);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    o2.connect(g2); g2.connect(ctx.destination);
    o2.start(ctx.currentTime + 0.04); o2.stop(ctx.currentTime + 0.18);
  } catch (_) {}
}
