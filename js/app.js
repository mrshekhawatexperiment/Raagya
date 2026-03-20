/**
 * RAAGYA — Web Harmonium
 * js/app.js — Main orchestrator
 * © 2025 Raagya · Devendra Singh · raagyamusic.free.nf
 * mrshekhewatexperiments@gmail.com
 */

'use strict';

(function(){

  let isRec = false, recNotes = [], recStart = 0, playTimers = [];

  // ─── BOOT ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {

    // UI setup
    RU.buildBellows();
    RU.initTheme();
    RU.initReverb();
    RU.initSliders();
    RU.initTimbre();
    RU.initOctave();
    RU.initDrone();
    RU.buildKmap();
    RU.initParticles();

    // Build keyboard
    RK.build('keyboard');
    RK.setCallbacks(
      async (noteId, note, oct) => {
        await _ensureAudio();
        const f = RA.play(noteId, note, oct);
        RU.pumpBellows();
        RU.updateDisplay(RA.getVoices());
        RU.burstParticles(2);
        if(isRec) recNotes.push({t:_t(), type:'on', noteId, note, oct});
      },
      (noteId) => {
        RA.stop(noteId);
        RU.updateDisplay(RA.getVoices());
        if(isRec) recNotes.push({t:_t(), type:'off', noteId});
      }
    );
    RK.initKBEvents();

    // Special keys
    document.addEventListener('keydown', e => {
      if(['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if(k==='r'){ e.preventDefault(); _toggleRec(); }
      if(k==='p'){ e.preventDefault(); _play(); }
      if(k==='x'){ e.preventDefault(); _clear(); }
    });

    // Record buttons
    document.getElementById('recBtn') ?.addEventListener('click', _toggleRec);
    document.getElementById('playBtn')?.addEventListener('click', _play);
    document.getElementById('stopBtn')?.addEventListener('click', _stopPlay);
    document.getElementById('clrBtn') ?.addEventListener('click', _clear);

    // Audio init on first gesture
    const once = async () => {
      await RA.init();
      RU.initViz();
      document.removeEventListener('click',    once);
      document.removeEventListener('keydown',  once);
      document.removeEventListener('touchstart',once);
    };
    document.addEventListener('click',     once);
    document.addEventListener('keydown',   once);
    document.addEventListener('touchstart',once);

  });

  // ─── HELPERS ────────────────────────────────────────────────────────────────
  async function _ensureAudio() { await RA.init(); }
  function _t(){ return performance.now()/1000; }

  // ─── RECORD ─────────────────────────────────────────────────────────────────
  function _toggleRec(){
    if(!isRec){
      isRec=true; recNotes=[]; recStart=_t();
      const btn=document.getElementById('recBtn');
      if(btn){ btn.textContent='⏹ STOP REC'; btn.classList.add('on'); }
      const ind=document.getElementById('recInd');
      if(ind) ind.textContent='● Recording…';
    } else {
      isRec=false;
      const btn=document.getElementById('recBtn');
      if(btn){ btn.textContent='⏺ REC'; btn.classList.remove('on'); }
      const ind=document.getElementById('recInd');
      if(ind) ind.textContent='';
      if(recNotes.length>0){
        const t0=recNotes[0].t;
        recNotes.forEach(e=>e.t-=t0);
        const pb=document.getElementById('playBtn');
        const sb=document.getElementById('stopBtn');
        if(pb) pb.classList.remove('hidden');
        if(sb) sb.classList.remove('hidden');
      }
    }
  }

  function _play(){
    if(!recNotes.length) return;
    _stopPlay();
    recNotes.forEach(ev=>{
      const t=setTimeout(async()=>{
        await _ensureAudio();
        if(ev.type==='on'){
          RA.play(ev.noteId, ev.note, ev.oct);
          const el=document.querySelector(`[data-note-id="${ev.noteId}"]`);
          if(el) el.classList.add('pressed');
          RU.pumpBellows();
        } else {
          RA.stop(ev.noteId);
          const el=document.querySelector(`[data-note-id="${ev.noteId}"]`);
          if(el) el.classList.remove('pressed');
        }
        RU.updateDisplay(RA.getVoices());
      }, ev.t*1000);
      playTimers.push(t);
    });
  }

  function _stopPlay(){
    playTimers.forEach(clearTimeout); playTimers=[];
    document.querySelectorAll('.kw.pressed,.kb.pressed').forEach(k=>k.classList.remove('pressed'));
  }

  function _clear(){
    _stopPlay(); recNotes=[]; isRec=false;
    const r=document.getElementById('recBtn');
    const p=document.getElementById('playBtn');
    const s=document.getElementById('stopBtn');
    const i=document.getElementById('recInd');
    if(r){ r.textContent='⏺ REC'; r.classList.remove('on'); }
    if(p) p.classList.add('hidden');
    if(s) s.classList.add('hidden');
    if(i) i.textContent='';
  }

})();
