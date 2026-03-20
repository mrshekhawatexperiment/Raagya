/**
 * RAAGYA — Web Harmonium
 * js/audio.js — Realistic Instrument Sound Engine
 * © 2025 Raagya · Devendra Singh · ragyamusic.free.nf
 * Contact: mrshekhewatexperiments@gmail.com
 *
 * Each instrument uses a completely unique synthesis approach:
 *  - Harmonium  → Layered sawtooth reeds + chorus + slight beating
 *  - Bansuri    → Sine + noise breath layer + flutter vibrato
 *  - Sarangi    → Bowed string simulation, odd harmonics, gritty bow noise
 *  - Sitar      → Plucked string (Karplus-Strong style) + sympathetic drones
 */

'use strict';

const RA = (() => { // RA = RaagyaAudio

  let ctx, master, reverbSend, reverbGain, dryNode, analyser;
  let reverbOn = true, reverbMix = 0.35, vol = 0.70, sus = 0.40;
  let timbre = 'harmonium', baseOct = 4;

  const voices = {};  // noteId → voice
  const drones = {};  // droneKey → voice

  // ─── INIT ───────────────────────────────────────
  async function init() {
    if (ctx) { if (ctx.state === 'suspended') await ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master   = ctx.createGain(); master.gain.value = vol;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.80;

    dryNode    = ctx.createGain(); dryNode.gain.value = 1 - reverbMix * 0.6;
    reverbGain = ctx.createGain(); reverbGain.gain.value = reverbOn ? reverbMix : 0;

    reverbSend = ctx.createConvolver();
    reverbSend.buffer = _mkReverb(2.4, 0.5);

    master.connect(dryNode);
    master.connect(reverbSend);
    reverbSend.connect(reverbGain);
    dryNode.connect(analyser);
    reverbGain.connect(analyser);
    analyser.connect(ctx.destination);
  }

  // ─── REVERB IMPULSE ─────────────────────────────
  function _mkReverb(dur, decay) {
    const rate = ctx.sampleRate;
    const len  = Math.floor(rate * dur);
    const buf  = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        // slightly different per channel for stereo
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay + c * 0.15);
      }
    }
    return buf;
  }

  // ─── NOTE FREQUENCY ─────────────────────────────
  function freq(note, oct) {
    const N = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const s = N.indexOf(note);
    if (s < 0) return 440;
    return 440 * Math.pow(2, (oct - 4) + (s - 9) / 12);
  }

  // ═══════════════════════════════════════════════
  //  INSTRUMENT VOICES — each totally unique
  // ═══════════════════════════════════════════════

  // ── 1. HARMONIUM ─────────────────────────────────
  // Real harmonium = multiple reeds per note, each slightly out of tune,
  // creating the characteristic "beating" chorus sound.
  function _mkHarmonium(f, gVal) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gVal, ctx.currentTime + 0.03);
    g.connect(master);

    const oscs = [];

    // 3 reed layers — main + two detuned copies (≈ chorus/beating)
    const REEDS = [
      { detune:  0,   gMul: 1.0 },
      { detune: +7,   gMul: 0.55 },
      { detune: -6,   gMul: 0.55 },
    ];

    REEDS.forEach(reed => {
      // Additive partials for sawtooth-like reed timbre
      const PARTIALS = [1,2,3,4,5,6,7,8,9];
      const AMPS     = [1.0,0.62,0.40,0.25,0.16,0.10,0.07,0.04,0.025];
      PARTIALS.forEach((p, i) => {
        const osc = ctx.createOscillator();
        const og  = ctx.createGain();
        osc.type  = p === 1 ? 'sawtooth' : 'sine';
        osc.frequency.value = f * p;
        osc.detune.value    = reed.detune + (Math.random() - 0.5) * 3;
        og.gain.value       = (AMPS[i] * reed.gMul) / (PARTIALS.length * 1.2);
        osc.connect(og); og.connect(g);
        osc.start(); oscs.push(osc);
      });
    });

    // Slow vibrato (bellows pressure variation)
    const lfo = ctx.createOscillator();
    const lfg = ctx.createGain();
    lfo.frequency.value = 5.2; lfg.gain.value = f * 0.003;
    lfo.connect(lfg); oscs.forEach(o => lfg.connect(o.frequency));
    lfo.start(); oscs.push(lfo);

    return { oscs, g, f };
  }

  // ── 2. BANSURI ─────────────────────────────────
  // Bamboo flute: breath noise + pure sine fundamental, minimal overtones,
  // flutter vibrato, gentle attack.
  function _mkBansuri(f, gVal) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gVal, ctx.currentTime + 0.065); // slower attack = breathier
    g.connect(master);
    const oscs = [];

    // Fundamental (pure)
    const osc1 = ctx.createOscillator();
    const g1   = ctx.createGain();
    osc1.type  = 'sine'; osc1.frequency.value = f; g1.gain.value = 0.85;
    osc1.connect(g1); g1.connect(g); osc1.start(); oscs.push(osc1);

    // 2nd harmonic (very soft)
    const osc2 = ctx.createOscillator();
    const g2   = ctx.createGain();
    osc2.type  = 'sine'; osc2.frequency.value = f * 2; g2.gain.value = 0.18;
    osc2.connect(g2); g2.connect(g); osc2.start(); oscs.push(osc2);

    // 3rd (subtle)
    const osc3 = ctx.createOscillator();
    const g3   = ctx.createGain();
    osc3.type  = 'sine'; osc3.frequency.value = f * 3; g3.gain.value = 0.07;
    osc3.connect(g3); g3.connect(g); osc3.start(); oscs.push(osc3);

    // Breath noise — filtered white noise
    const bufLen = ctx.sampleRate * 0.5;
    const nbuf   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const nd     = nbuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1;
    const noise  = ctx.createBufferSource();
    noise.buffer = nbuf; noise.loop = true;
    const bpf    = ctx.createBiquadFilter();
    bpf.type = 'bandpass'; bpf.frequency.value = f * 1.5; bpf.Q.value = 4;
    const ng     = ctx.createGain(); ng.gain.value = 0.06;
    noise.connect(bpf); bpf.connect(ng); ng.connect(g);
    noise.start(); oscs.push(noise);

    // Flutter vibrato (faster + deeper than harmonium)
    const lfo = ctx.createOscillator();
    const lfg = ctx.createGain();
    lfo.type = 'sine'; lfo.frequency.value = 6.8; lfg.gain.value = f * 0.008;
    lfo.connect(lfg);
    [osc1, osc2, osc3].forEach(o => lfg.connect(o.frequency));
    lfo.start(); oscs.push(lfo);

    return { oscs, g, f };
  }

  // ── 3. SARANGI ─────────────────────────────────
  // Bowed string — rich odd harmonics, bow noise, gritty texture,
  // slow bow-pressure tremolo.
  function _mkSarangi(f, gVal) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gVal, ctx.currentTime + 0.08);
    g.connect(master);
    const oscs = [];

    // Odd harmonics dominant (bowed string characteristic)
    const PARTIALS = [1,2,3,4,5,6,7,8,9,10,11];
    const AMPS     = [1.0, 0.5, 0.75, 0.3, 0.55, 0.22, 0.40, 0.18, 0.28, 0.14, 0.20];
    PARTIALS.forEach((p, i) => {
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type = p % 2 === 0 ? 'sine' : 'sawtooth'; // odd = sawtooth for bow grittiness
      osc.frequency.value = f * p;
      osc.detune.value = (Math.random() - 0.5) * 6;
      og.gain.value = AMPS[i] / (PARTIALS.length * 0.9);
      osc.connect(og); og.connect(g);
      osc.start(); oscs.push(osc);
    });

    // Bow noise (filtered noise at fundamental)
    const bufLen = ctx.sampleRate * 0.5;
    const nbuf   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const nd     = nbuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = nbuf; noise.loop = true;
    const lp    = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = f * 2.5;
    const ng    = ctx.createGain(); ng.gain.value = 0.04;
    noise.connect(lp); lp.connect(ng); ng.connect(g);
    noise.start(); oscs.push(noise);

    // Bow pressure tremolo (slow amplitude modulation)
    const trem  = ctx.createOscillator();
    const tremG = ctx.createGain();
    trem.type = 'sine'; trem.frequency.value = 3.8;
    tremG.gain.value = 0.08;
    trem.connect(tremG); tremG.connect(g.gain);
    trem.start(); oscs.push(trem);

    // Slow vibrato
    const lfo = ctx.createOscillator();
    const lfg = ctx.createGain();
    lfo.frequency.value = 4.5; lfg.gain.value = f * 0.005;
    lfo.connect(lfg); oscs.slice(0,5).forEach(o => lfg.connect(o.frequency));
    lfo.start(); oscs.push(lfo);

    return { oscs, g, f };
  }

  // ── 4. SITAR ─────────────────────────────────
  // Plucked string: sharp attack, bright twang, fast decay + sympathetic ring,
  // characteristic sitar "jawari" buzz.
  function _mkSitar(f, gVal) {
    const g = ctx.createGain();
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gVal, now + 0.004); // very fast attack
    g.gain.exponentialRampToValueAtTime(gVal * 0.6, now + 0.12); // quick partial decay
    g.connect(master);
    const oscs = [];

    // Bright partials — sitar has a LOT of high harmonics
    const PARTIALS = [1,2,3,4,5,6,7,8,9,10,12,14,16];
    const AMPS     = [1.0,0.7,0.55,0.45,0.38,0.30,0.24,0.18,0.14,0.11,0.07,0.04,0.02];
    PARTIALS.forEach((p, i) => {
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = f * p;
      osc.detune.value = (Math.random() - 0.5) * 8;
      og.gain.value = AMPS[i] / PARTIALS.length;
      osc.connect(og); og.connect(g);
      osc.start(); oscs.push(osc);
    });

    // Jawari buzz — high-freq noise burst at attack
    const bufLen = ctx.sampleRate * 0.08;
    const nbuf   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const nd     = nbuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i/bufLen, 1.5);
    const buzz  = ctx.createBufferSource();
    buzz.buffer = nbuf;
    const hp    = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = f * 8;
    const bg    = ctx.createGain(); bg.gain.value = 0.12;
    buzz.connect(hp); hp.connect(bg); bg.connect(g);
    buzz.start(); oscs.push(buzz);

    // Sympathetic string ring (lower octave, very quiet)
    const sym  = ctx.createOscillator();
    const symG = ctx.createGain();
    sym.type = 'sine'; sym.frequency.value = f * 0.5;
    symG.gain.value = 0.08;
    sym.connect(symG); symG.connect(g);
    sym.start(); oscs.push(sym);

    // No LFO on sitar — it should be dry and percussive
    return { oscs, g, f };
  }

  // ─── FACTORY ─────────────────────────────────────
  const FACTORIES = {
    harmonium: _mkHarmonium,
    bansuri:   _mkBansuri,
    sarangi:   _mkSarangi,
    sitar:     _mkSitar,
  };

  function _mkVoice(f, gVal, isDrone) {
    const fn = FACTORIES[timbre] || _mkHarmonium;
    return fn(f, isDrone ? gVal * 0.55 : gVal);
  }

  // ─── PLAY NOTE ──────────────────────────────────
  function play(noteId, note, oct) {
    if (!ctx || voices[noteId]) return;
    const f    = freq(note, oct);
    const v    = _mkVoice(f, 0.22, false);
    voices[noteId] = v;
    return f;
  }

  // ─── STOP NOTE ──────────────────────────────────
  function stop(noteId) {
    const v = voices[noteId];
    if (!v) return;
    const now = ctx.currentTime;
    const rel = 0.04 + sus * 1.8;
    v.g.gain.cancelScheduledValues(now);
    v.g.gain.setValueAtTime(v.g.gain.value, now);
    v.g.gain.exponentialRampToValueAtTime(0.0001, now + rel);
    const cleanup = () => {
      v.oscs.forEach(o => { try { o.stop(); } catch(e){} });
      try { v.g.disconnect(); } catch(e){}
    };
    setTimeout(cleanup, (rel + 0.18) * 1000);
    delete voices[noteId];
  }

  // ─── DRONE ──────────────────────────────────────
  function toggleDrone(note) {
    const id = 'dr_' + note;
    if (drones[id]) {
      const v = drones[id];
      const now = ctx.currentTime;
      v.g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      setTimeout(() => {
        v.oscs.forEach(o => { try { o.stop(); } catch(e){} });
        try { v.g.disconnect(); } catch(e){}
      }, 1000);
      delete drones[id];
      return false;
    }
    const f = freq(note, baseOct - 1);
    const v = _mkHarmonium(f, 0.14); // drones always use harmonium timbre (tanpura-like)
    drones[id] = v;
    return true;
  }

  function stopAllDrones() {
    Object.keys(drones).forEach(id => {
      const note = id.replace('dr_', '');
      toggleDrone(note);
    });
  }

  // ─── SETTINGS ───────────────────────────────────
  function setVol(v)    { vol = v; if (master) master.gain.value = v; }
  function setSus(s)    { sus = s; }
  function setTimbre(t) { timbre = t; }
  function setBaseOct(o){ baseOct = o; }

  function setReverb(on) {
    reverbOn = on;
    if (!reverbGain) return;
    const now = ctx.currentTime;
    reverbGain.gain.cancelScheduledValues(now);
    reverbGain.gain.linearRampToValueAtTime(on ? reverbMix : 0, now + 0.3);
    dryNode.gain.cancelScheduledValues(now);
    dryNode.gain.linearRampToValueAtTime(on ? 1 - reverbMix * 0.58 : 1, now + 0.3);
  }

  function setReverbMix(m) {
    reverbMix = m;
    if (!reverbGain || !reverbOn) return;
    const now = ctx.currentTime;
    reverbGain.gain.setTargetAtTime(m, now, 0.06);
    dryNode.gain.setTargetAtTime(1 - m * 0.58, now, 0.06);
  }

  function isReverbOn() { return reverbOn; }
  function getAnalyser(){ return analyser; }
  function getVoices()  { return voices; }

  return {
    init, play, stop, freq,
    toggleDrone, stopAllDrones,
    setVol, setSus, setTimbre, setBaseOct,
    setReverb, setReverbMix, isReverbOn,
    getAnalyser, getVoices
  };
})();
