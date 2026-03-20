/**
 * RAAGYA — Web Harmonium
 * js/ui.js — All UI: visualizer, bellows, chips, theme, sliders, drone
 * © 2025 Raagya · Devendra Singh · ragyamusic.free.nf
 */

'use strict';

const RU = (() => { // RU = RaagyaUI

  // ─── BELLOWS ────────────────────────────────────────────────────────────────
  function buildBellows() {
    const fold = document.getElementById('bfolds');
    if(!fold) return;
    fold.innerHTML = '';
    for(let i=0;i<20;i++){
      const seg = document.createElement('div');
      seg.className = 'bseg';
      seg.innerHTML = '<div class="bt"></div><div class="bm"></div><div class="bb"></div>';
      fold.appendChild(seg);
    }
  }

  let bellTimer = null;
  function pumpBellows() {
    const b = document.getElementById('bellows');
    if(!b) return;
    b.classList.add('pump');
    clearTimeout(bellTimer);
    bellTimer = setTimeout(()=>b.classList.remove('pump'), 340);
  }

  // ─── WAVEFORM VISUALIZER ────────────────────────────────────────────────────
  let vizRaf = null;
  function initViz() {
    const canvas = document.getElementById('vizCanvas');
    if(!canvas) return;
    const ctx2 = canvas.getContext('2d');

    function resize() {
      const dpr = devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx2.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const analyser = RA.getAnalyser();
    if(!analyser) return;

    const freqBuf = new Uint8Array(analyser.frequencyBinCount);
    const timeBuf = new Uint8Array(analyser.fftSize);

    function draw() {
      vizRaf = requestAnimationFrame(draw);
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx2.clearRect(0,0,W,H);

      const isLight = !document.body.classList.contains('dark');
      const goldR = isLight ? '100' : '200';
      const goldG = isLight ? '72'  : '148';
      const goldB = isLight ? '8'   : '40';

      // Frequency bars (bottom half)
      analyser.getByteFrequencyData(freqBuf);
      const barW = (W / freqBuf.length) * 2.6;
      let x = 0;
      for(let i=0;i<freqBuf.length;i++){
        const v = freqBuf[i]/255;
        const h = v * (H*0.55);
        const a = 0.2 + v*0.8;
        ctx2.fillStyle = `rgba(${goldR},${goldG},${goldB},${a})`;
        ctx2.fillRect(x, H-h, Math.max(barW-0.8,0.8), h);
        x += barW + 0.3;
      }

      // Waveform line (full width)
      analyser.getByteTimeDomainData(timeBuf);
      ctx2.beginPath();
      ctx2.strokeStyle = `rgba(${goldR},${goldG},${goldB},0.45)`;
      ctx2.lineWidth = 1.2;
      const sw = W / timeBuf.length;
      let sx = 0;
      for(let i=0;i<timeBuf.length;i++){
        const y = ((timeBuf[i]/128.0)-1) * (H*0.4) + H*0.5;
        i===0 ? ctx2.moveTo(sx,y) : ctx2.lineTo(sx,y);
        sx += sw;
      }
      ctx2.stroke();
    }
    draw();
  }

  // ─── NOTE DISPLAY ────────────────────────────────────────────────────────────
  function updateDisplay(voices) {
    const chips  = document.getElementById('chips');
    const npNote = document.getElementById('npNote');
    const npHz   = document.getElementById('npHz');
    if(!chips) return;

    const ids = Object.keys(voices);
    if(ids.length === 0){
      chips.innerHTML = '<span class="chip-ph">Click a key or press keyboard…</span>';
      if(npNote) npNote.textContent = '—';
      if(npHz)   npHz.textContent   = '— Hz';
      return;
    }
    chips.innerHTML = ids.map(id=>`<div class="chip">${id}</div>`).join('');
    const last = voices[ids[ids.length-1]];
    if(last){
      if(npNote) npNote.textContent = ids[ids.length-1];
      if(npHz)   npHz.textContent   = (last.f||0).toFixed(1) + ' Hz';
    }
  }

  // ─── THEME ──────────────────────────────────────────────────────────────────
  function initTheme() {
    const btn  = document.getElementById('themeBtn');
    const txt  = document.getElementById('themeTxt');
    const body = document.body;
    const saved = localStorage.getItem('raagya-theme') || 'dark';
    if(saved === 'light'){ body.classList.remove('dark'); body.classList.add('light'); }
    else                 { body.classList.add('dark'); body.classList.remove('light'); }
    _updateThemeBtn();

    btn && btn.addEventListener('click', ()=>{
      const isDark = body.classList.contains('dark');
      if(isDark){
        body.classList.remove('dark'); body.classList.add('light');
        localStorage.setItem('raagya-theme','light');
      } else {
        body.classList.remove('light'); body.classList.add('dark');
        localStorage.setItem('raagya-theme','dark');
      }
      _updateThemeBtn();
    });
  }
  function _updateThemeBtn(){
    const txt  = document.getElementById('themeTxt');
    const isDark = document.body.classList.contains('dark');
    if(txt) txt.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  // ─── REVERB TOGGLE ──────────────────────────────────────────────────────────
  function initReverb() {
    const btn = document.getElementById('reverbBtn');
    const led = document.getElementById('reverbLed');
    let on = true;
    btn && btn.addEventListener('click', ()=>{
      on = !on;
      RA.setReverb(on);
      if(led) led.classList.toggle('on', on);
    });
  }

  // ─── SLIDERS ────────────────────────────────────────────────────────────────
  function initSliders() {
    _slider('volRng','volNum',v => RA.setVol(v/100));
    _slider('susRng','susNum',v => RA.setSus(v/100));
    _slider('revRng','revNum',v => RA.setReverbMix(v/100));
  }
  function _slider(id, dispId, cb){
    const el   = document.getElementById(id);
    const disp = document.getElementById(dispId);
    if(!el) return;
    function update(){
      const v = parseInt(el.value);
      const pct = ((v/100)*100).toFixed(1)+'%';
      el.style.setProperty('--pct', pct);
      if(disp) disp.textContent = v;
      cb(v);
    }
    el.addEventListener('input', update);
    update();
  }

  // ─── TIMBRE SELECTOR ────────────────────────────────────────────────────────
  function initTimbre() {
    document.querySelectorAll('#timbreSeg .sb').forEach(btn => {
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('#timbreSeg .sb').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        RA.setTimbre(btn.dataset.t);
        // Flash shell with instrument colour hint
        _flashShell(btn.dataset.t);
      });
    });
  }
  function _flashShell(t){
    const shell = document.getElementById('shell');
    if(!shell) return;
    const colors = {
      harmonium:'rgba(200,148,40,.08)',
      bansuri:  'rgba(40,180,140,.06)',
      sarangi:  'rgba(180,80,80,.06)',
      sitar:    'rgba(180,140,40,.08)',
    };
    shell.style.boxShadow = `0 0 60px ${colors[t]||'transparent'},0 50px 120px rgba(0,0,0,.85)`;
    setTimeout(()=>shell.style.boxShadow='',1200);
  }

  // ─── OCTAVE STEPPER ─────────────────────────────────────────────────────────
  let baseOct = 4;
  function initOctave() {
    const disp = document.getElementById('octVal');
    const up   = document.getElementById('octUp');
    const dn   = document.getElementById('octDn');
    if(!disp||!up||!dn) return;
    function update(){
      disp.textContent = baseOct;
      RA.setBaseOct(baseOct);
    }
    up.addEventListener('click', ()=>{ if(baseOct<6){ baseOct++; update(); }});
    dn.addEventListener('click', ()=>{ if(baseOct>2){ baseOct--; update(); }});

    // Arrow keys
    document.addEventListener('keydown', e=>{
      if(['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      if(e.key==='ArrowUp'  && baseOct<6){ baseOct++; update(); e.preventDefault(); }
      if(e.key==='ArrowDown'&& baseOct>2){ baseOct--; update(); e.preventDefault(); }
    });
  }

  // ─── DRONE PADS ─────────────────────────────────────────────────────────────
  const activeDroneNotes = new Set();
  function initDrone() {
    const activeEl = document.getElementById('droneActive');
    document.querySelectorAll('.dpad').forEach(pad=>{
      pad.addEventListener('click', async()=>{
        await RA.init();
        const note = pad.dataset.note;
        const on   = RA.toggleDrone(note);
        pad.classList.toggle('active', on===true);
        if(on===true)  activeDroneNotes.add(note);
        if(on===false) activeDroneNotes.delete(note);
        if(activeEl) activeEl.textContent = activeDroneNotes.size>0
          ? [...activeDroneNotes].map(n=>n).join(' · ') : 'None';
        pumpBellows();
      });
    });

    // Space = stop all drones
    document.addEventListener('keydown', e=>{
      if(['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      if(e.key===' '){
        e.preventDefault();
        RA.stopAllDrones();
        activeDroneNotes.clear();
        document.querySelectorAll('.dpad').forEach(p=>p.classList.remove('active'));
        if(activeEl) activeEl.textContent='None';
      }
    });
  }

  // ─── KEYMAP LEGEND ──────────────────────────────────────────────────────────
  function buildKmap() {
    const grid = document.getElementById('kmap');
    if(!grid) return;
    const map = RK.getMap();
    grid.innerHTML = '';
    Object.entries(map).forEach(([k,{n,o,display}])=>{
      const div = document.createElement('div');
      div.className='kmi';
      div.innerHTML=`<span class="kmi-key">${(display||k).toUpperCase()}</span><span class="kmi-note">${n.replace('#','♯')}${o}</span>`;
      grid.appendChild(div);
    });
  }

  // ─── AMBIENT PARTICLES ──────────────────────────────────────────────────────
  let pts=[], ptRaf;
  function initParticles(){
    const c = document.getElementById('ambientCanvas');
    if(!c) return;
    const cx = c.getContext('2d');
    function resize(){ c.width=innerWidth; c.height=innerHeight; }
    resize(); window.addEventListener('resize',resize);

    for(let i=0;i<50;i++) pts.push(_mkPt(true));

    function loop(){
      ptRaf = requestAnimationFrame(loop);
      cx.clearRect(0,0,c.width,c.height);
      const isLight = !document.body.classList.contains('dark');
      const col = isLight ? '100,72,8' : '200,148,40';

      for(let i=0;i<pts.length;i++){
        const p=pts[i];
        p.life++;
        p.wobble+=p.ws;
        p.x+=p.vx+Math.sin(p.wobble)*0.15;
        p.y+=p.vy;
        const prog=p.life/p.maxLife;
        let a=p.op;
        if(prog<.12) a*=prog/.12;
        if(prog>.8)  a*=(1-prog)/.2;
        cx.beginPath();
        cx.arc(p.x,p.y,p.r,0,Math.PI*2);
        cx.fillStyle=`rgba(${col},${a})`;
        cx.fill();
        if(p.life>=p.maxLife||p.y<-20) pts[i]=_mkPt(false);
      }
      // connections
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){
            const a=0.05*(1-d/110);
            cx.beginPath();
            cx.moveTo(pts[i].x,pts[i].y);
            cx.lineTo(pts[j].x,pts[j].y);
            cx.strokeStyle=`rgba(${col},${a})`;
            cx.lineWidth=0.5;
            cx.stroke();
          }
        }
      }
    }
    loop();
  }
  function _mkPt(rand){
    return{
      x:Math.random()*innerWidth,
      y:rand?Math.random()*innerHeight:innerHeight+10,
      r:.7+Math.random()*2.2,
      vx:(Math.random()-.5)*.18,
      vy:-(0.1+Math.random()*.32),
      op:.05+Math.random()*.22,
      life:0,maxLife:250+Math.random()*550,
      wobble:Math.random()*Math.PI*2,
      ws:.004+Math.random()*.01
    };
  }
  function burstParticles(n=5){
    for(let i=0;i<n;i++){
      const p=_mkPt(false);
      p.x=innerWidth*(0.3+Math.random()*.4);
      p.y=innerHeight*(0.45+Math.random()*.25);
      p.vy=-(0.5+Math.random()*1.2);
      p.op=.3; p.maxLife=100+Math.random()*120;
      pts.push(p);
    }
    while(pts.length>80) pts.shift();
  }

  return {
    buildBellows, pumpBellows, initViz,
    updateDisplay, initTheme, initReverb,
    initSliders, initTimbre, initOctave,
    initDrone, buildKmap,
    initParticles, burstParticles
  };
})();
