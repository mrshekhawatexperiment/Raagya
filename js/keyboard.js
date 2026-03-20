/**
 * RAAGYA — Web Harmonium
 * js/keyboard.js — Full 3-octave keyboard with number+letter+symbol keys
 * © 2025 Raagya · Devendra Singh · raagyamusic.free.nf
 *
 * LAYOUT:
 *  Numbers (1-0) + top row (Q…P) + middle row (A…;) + bottom row (Z…/) = 36 notes
 *  Numbers row covers black keys of octave 3
 *  Full chromatic 3 octaves across the keyboard
 */

'use strict';

const RK = (() => { // RK = RaagyaKeyboard

  // ─── KEY MAP ────────────────────────────────────────────────────────────────
  // Format: 'key' → { n: noteName, o: octave }
  // Three octaves, 12 notes each = 36 keys total
  // White + Black keys all mapped
  const KEY_MAP = {
    // ══ OCTAVE 3 ══
    // White keys — bottom row
    'z': { n:'C',  o:3 }, 's': { n:'C',  o:3 }, // z = C3  (also mapped via s for clarity)
    // Actually clean layout:
    // Row: Z X C V B N M , . /
    // Maps: C3 D3 E3 F3 G3 A3 B3 C4 ...
    // Let's do the proper QWERTY piano layout used by all DAWs:

    // ── OCTAVE 3 whites: A S D F G H J  ──
    'a': { n:'C',  o:3 },
    's': { n:'D',  o:3 },
    'd': { n:'E',  o:3 },
    'f': { n:'F',  o:3 },
    'g': { n:'G',  o:3 },
    'h': { n:'A',  o:3 },
    'j': { n:'B',  o:3 },

    // ── OCTAVE 3 blacks: W E  T Y U  ──
    'w': { n:'C#', o:3 },
    'e': { n:'D#', o:3 },
    't': { n:'F#', o:3 },
    'y': { n:'G#', o:3 },
    'u': { n:'A#', o:3 },

    // ══ OCTAVE 4 ══
    // ── Whites: K L ; ' ]  and  Z X C V B  ──
    'k': { n:'C',  o:4 },
    'l': { n:'D',  o:4 },
    ';': { n:'E',  o:4 },
    "'": { n:'F',  o:4 },
    ']': { n:'G',  o:4 },

    'z': { n:'A',  o:4 },
    'x': { n:'B',  o:4 },

    // ── Blacks: O P [ \  ──
    'o': { n:'C#', o:4 },
    'p': { n:'D#', o:4 },
    '[': { n:'F#', o:4 },
    '\\':{ n:'G#', o:4 },
    'i': { n:'A#', o:3 }, // remap: i = A#3

    // ── OCTAVE 4 more whites via number row ──
    'c': { n:'C',  o:4 },
    'v': { n:'D',  o:4 },
    'b': { n:'E',  o:4 },
    'n': { n:'F',  o:4 },
    'm': { n:'G',  o:4 },
    ',': { n:'A',  o:4 },
    '.': { n:'B',  o:4 },

    // ══ OCTAVE 5 ══
    // ── Whites: 1 2 3 4 5 6 7 ──
    '1': { n:'C',  o:5 },
    '2': { n:'D',  o:5 },
    '3': { n:'E',  o:5 },
    '4': { n:'F',  o:5 },
    '5': { n:'G',  o:5 },
    '6': { n:'A',  o:5 },
    '7': { n:'B',  o:5 },

    // ── Blacks: Q W E R T (number row shifted) ──
    'q': { n:'C#', o:5 },
    // 'w' already used — use shift variants where possible
    // Use remaining keys:
    'r': { n:'D#', o:5 },
    // 't' used — 
    '/': { n:'F#', o:4 },
    // Additional octave 5 blacks via:
    '8': { n:'C#', o:5 },
    '9': { n:'D#', o:5 },
    '0': { n:'F#', o:5 },
    '-': { n:'G#', o:5 },
    '=': { n:'A#', o:5 },
  };

  // Clean up duplicates — z conflicts: prioritize octave 4
  // Final clean map (no conflicts):
  const CLEAN_MAP = {
    // ══ OCTAVE 3 ══  (home row + top-row blacks)
    'a': { n:'C',  o:3, display:'A' },
    'w': { n:'C#', o:3, display:'W' },
    's': { n:'D',  o:3, display:'S' },
    'e': { n:'D#', o:3, display:'E' },
    'd': { n:'E',  o:3, display:'D' },
    'f': { n:'F',  o:3, display:'F' },
    't': { n:'F#', o:3, display:'T' },
    'g': { n:'G',  o:3, display:'G' },
    'y': { n:'G#', o:3, display:'Y' },
    'h': { n:'A',  o:3, display:'H' },
    'u': { n:'A#', o:3, display:'U' },
    'j': { n:'B',  o:3, display:'J' },

    // ══ OCTAVE 4 ══  (right home + bottom row)
    'k': { n:'C',  o:4, display:'K' },
    'o': { n:'C#', o:4, display:'O' },
    'l': { n:'D',  o:4, display:'L' },
    'p': { n:'D#', o:4, display:'P' },
    ';': { n:'E',  o:4, display:';' },
    "'": { n:'F',  o:4, display:"'" },
    '[': { n:'F#', o:4, display:'[' },
    ']': { n:'G',  o:4, display:']' },
    '\\':{ n:'G#', o:4, display:'\\' },
    'z': { n:'A',  o:4, display:'Z' },
    'x': { n:'A#', o:4, display:'X' },
    'c': { n:'B',  o:4, display:'C' },

    // ══ OCTAVE 5 ══  (number row whites + Q-row blacks + bottom row extra)
    'v': { n:'C',  o:5, display:'V' },
    'q': { n:'C#', o:5, display:'Q' },
    'b': { n:'D',  o:5, display:'B' },
    'r': { n:'D#', o:5, display:'R' },
    'n': { n:'E',  o:5, display:'N' },
    'm': { n:'F',  o:5, display:'M' },
    'i': { n:'F#', o:5, display:'I' },
    ',': { n:'G',  o:5, display:',' },
    '/': { n:'G#', o:5, display:'/' },
    '.': { n:'A',  o:5, display:'.' },

    // Number row — Octave 5 extra notes
    '1': { n:'C',  o:5, display:'1' },
    '2': { n:'C#', o:5, display:'2' },
    '3': { n:'D',  o:5, display:'3' },
    '4': { n:'D#', o:5, display:'4' },
    '5': { n:'E',  o:5, display:'5' },
    '6': { n:'F',  o:5, display:'6' },
    '7': { n:'F#', o:5, display:'7' },
    '8': { n:'G',  o:5, display:'8' },
    '9': { n:'G#', o:5, display:'9' },
    '0': { n:'A',  o:5, display:'0' },
    '-': { n:'A#', o:5, display:'-' },
    '=': { n:'B',  o:5, display:'=' },
  };

  // Build reverse map: "C3" → ['A']  (multiple keys can play same note)
  const NOTE_KEYS = {};
  Object.entries(CLEAN_MAP).forEach(([k, { n, o }]) => {
    const id = n + o;
    if (!NOTE_KEYS[id]) NOTE_KEYS[id] = [];
    NOTE_KEYS[id].push(k);
  });

  // Primary key for display (first one registered)
  function primaryKey(noteId) {
    const keys = NOTE_KEYS[noteId];
    return keys ? keys[0].toUpperCase() : '';
  }

  // ─── KEYBOARD LAYOUT FOR DISPLAY ────────────────────────────────────────────
  const WHITE_NOTES  = ['C','D','E','F','G','A','B'];
  const OCTAVES      = [3, 4, 5];
  const TOTAL_WHITES = OCTAVES.length * WHITE_NOTES.length; // 21

  // Black key positions: after which white index (0-based in the octave) does a black key go?
  // C→C# D→D# (no E#) F→F# G→G# A→A# (no B#)
  const BLACK_AFTER = { C:true, D:true, F:true, G:true, A:true };

  const pressed = { kb: new Set(), ptr: new Set() };
  let onStart = () => {};
  let onStop  = () => {};

  function setCallbacks(start, stop) { onStart = start; onStop = stop; }

  // ─── BUILD DOM ──────────────────────────────────────────────────────────────
  function build(containerId) {
    const kb = document.getElementById(containerId);
    kb.innerHTML = '';

    const whiteRow = document.createElement('div');
    whiteRow.className = 'wrow';
    kb.appendChild(whiteRow);

    let wi = 0; // global white index
    const blacks = [];

    OCTAVES.forEach(oct => {
      WHITE_NOTES.forEach(n => {
        const noteId = n + oct;
        const kchar  = primaryKey(noteId);
        const kkeys  = NOTE_KEYS[noteId] || [];
        const el = _makeWhite(noteId, n, oct, kchar, kkeys);
        whiteRow.appendChild(el);
        if (BLACK_AFTER[n]) {
          blacks.push({ noteId: n+'#'+oct, note:n+'#', oct, wi });
        }
        wi++;
      });
    });

    blacks.forEach(b => {
      const kchar = primaryKey(b.noteId);
      const kkeys = NOTE_KEYS[b.noteId] || [];
      const el    = _makeBlack(b.noteId, b.note, b.oct, kchar, kkeys, b.wi);
      kb.appendChild(el);
    });
  }

  function _makeWhite(noteId, note, oct, kchar, kkeys) {
    const el = document.createElement('div');
    el.className = 'kw';
    el.dataset.noteId = noteId;
    el.setAttribute('role','button');
    el.setAttribute('aria-label', note+oct);
    // Show primary key + note name
    el.innerHTML = `<div class="klbl">
      <span class="kchar">${kchar}</span>
      <span class="knote">${note}${oct}</span>
    </div>`;
    _ptr(el, noteId, note, oct);
    return el;
  }

  function _makeBlack(noteId, note, oct, kchar, kkeys, afterWi) {
    const el = document.createElement('div');
    el.className = 'kb';
    el.dataset.noteId = noteId;
    el.setAttribute('role','button');
    el.setAttribute('aria-label', note+oct);
    // Position between whites
    const pct = ((afterWi + 1) / TOTAL_WHITES * 100) - 1.95;
    el.style.left = pct + '%';
    el.innerHTML = `<div class="klbl">
      <span class="kchar">${kchar}</span>
      <span class="knote">${note.replace('#','♯')}${oct}</span>
    </div>`;
    _ptr(el, noteId, note, oct);
    return el;
  }

  function _ptr(el, noteId, note, oct) {
    el.addEventListener('mousedown', e => { e.preventDefault(); _pdown(noteId, note, oct, el); });
    el.addEventListener('mouseup',   () => _pup(noteId, el));
    el.addEventListener('mouseleave',() => { if(pressed.ptr.has(noteId)) _pup(noteId,el); });
    el.addEventListener('mouseenter', e => {
      if(e.buttons===1 && !pressed.ptr.has(noteId)) _pdown(noteId,note,oct,el);
    });
    el.addEventListener('touchstart', e => { e.preventDefault(); _pdown(noteId,note,oct,el); }, {passive:false});
    el.addEventListener('touchend',   e => { e.preventDefault(); _pup(noteId,el); }, {passive:false});
    el.addEventListener('touchcancel',() => _pup(noteId,el));
    el.addEventListener('contextmenu', e => e.preventDefault());
  }

  function _pdown(noteId, note, oct, el) {
    if(pressed.ptr.has(noteId)) return;
    pressed.ptr.add(noteId);
    el.classList.add('pressed');
    _ripple(el);
    onStart(noteId, note, oct);
  }
  function _pup(noteId, el) {
    pressed.ptr.delete(noteId);
    if(!pressed.kb.has(noteId)) {
      el.classList.remove('pressed');
      onStop(noteId);
    }
  }

  function _ripple(el) {
    const r = document.createElement('div');
    r.style.cssText='position:absolute;border-radius:50%;width:16px;height:16px;left:50%;top:35%;'
      +'transform:translate(-50%,-50%) scale(0);background:radial-gradient(circle,rgba(200,148,40,.55) 0%,transparent 70%);'
      +'animation:rippleKey .38s ease-out forwards;pointer-events:none;z-index:20;';
    el.appendChild(r);
    setTimeout(()=>r.remove(), 400);
  }

  // ─── KEYBOARD EVENTS ────────────────────────────────────────────────────────
  function initKBEvents() {
    document.addEventListener('keydown', e => {
      if(e.repeat) return;
      if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

      const key = e.key; // raw key — preserves case, symbols
      const def = CLEAN_MAP[key] || CLEAN_MAP[key.toLowerCase()];
      if(!def) return;
      e.preventDefault();

      const { n, o } = def;
      const noteId = n + o;
      if(pressed.kb.has(noteId)) return;
      pressed.kb.add(noteId);

      const el = document.querySelector(`[data-note-id="${noteId}"]`);
      if(el) { el.classList.add('pressed'); _ripple(el); }
      onStart(noteId, n, o);
    });

    document.addEventListener('keyup', e => {
      const key = e.key;
      const def = CLEAN_MAP[key] || CLEAN_MAP[key.toLowerCase()];
      if(!def) return;
      const { n, o } = def;
      const noteId = n + o;
      if(!pressed.kb.has(noteId)) return;
      pressed.kb.delete(noteId);
      if(!pressed.ptr.has(noteId)) {
        const el = document.querySelector(`[data-note-id="${noteId}"]`);
        if(el) el.classList.remove('pressed');
        onStop(noteId);
      }
    });
  }

  function getMap()   { return CLEAN_MAP; }
  function getNoteKeys(){ return NOTE_KEYS; }

  return { build, initKBEvents, setCallbacks, getMap, getNoteKeys };
})();
