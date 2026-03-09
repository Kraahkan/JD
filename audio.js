window.FantasyAudio = (function() {
  let ctx = null, noiseBuffer = null, ambientTrack = null, musicTrack = null;

  const init = () => {
    if (ctx) return; 
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1.0, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) data[i] = Math.random() * 2 - 1;
      if (ctx.state === 'suspended') ctx.resume();

      if (!ambientTrack) {
        ambientTrack = new Audio('https://opengameart.org/sites/default/files/dungeon_ambient_1_0.ogg');
        ambientTrack.loop = true; ambientTrack.volume = 0; 
      }
      if (!musicTrack) {
        musicTrack = new Audio('https://opengameart.org/sites/default/files/RPG%20-%20The%20Secret%20Within%20The%20Silent%20Woods.ogg');
        musicTrack.loop = true; musicTrack.volume = 0; 
      }
    } catch(e) {}
  };

  const ensureAwake = () => { if (ctx && ctx.state === 'suspended') ctx.resume(); };

  const smoothFade = (audioObj, targetVolume, durationMs) => {
    if (!audioObj) return;
    audioObj.play().catch(() => {});
    const startVolume = audioObj.volume; 
    const startTime = performance.now();
    const fadeStep = (currentTime) => {
      let progress = (currentTime - startTime) / durationMs;
      if (progress > 1) progress = 1;
      audioObj.volume = Math.max(0, Math.min(1, startVolume + (targetVolume - startVolume) * progress));
      if (progress < 1) requestAnimationFrame(fadeStep);
    };
    requestAnimationFrame(fadeStep);
  };

  const playNoise = (d, t, f, v) => {
    ensureAwake();
    if (!ctx || !noiseBuffer) return;
    try {
      const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noiseBuffer; fl.type = t; fl.frequency.value = f;
      g.gain.setValueAtTime(v, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
      s.connect(fl); fl.connect(g); g.connect(ctx.destination); s.start();
    } catch (e) {}
  };

  const playTone = (f, t, d, v, ps = null) => {
    ensureAwake();
    if (!ctx) return;
    try {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = t; o.frequency.setValueAtTime(f, ctx.currentTime);
      if (ps) o.frequency.exponentialRampToValueAtTime(ps, ctx.currentTime + d);
      g.gain.setValueAtTime(t === 'sine' ? 0.01 : v, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + d);
    } catch (e) {}
  };

  return {
    init,
    startMusic: () => { 
      if (ambientTrack) ambientTrack.volume = 0;
      if (musicTrack) musicTrack.volume = 0;
      smoothFade(ambientTrack, 0.15, 10000); 
      smoothFade(musicTrack, 0.07, 10000); 
    },
    pauseMusic: () => { if (ambientTrack) ambientTrack.pause(); if (musicTrack) musicTrack.pause(); if (ctx && ctx.state === 'running') ctx.suspend(); },
    resumeMusic: () => { if (ambientTrack) ambientTrack.play().catch(() => {}); if (musicTrack) musicTrack.play().catch(() => {}); if (ctx && ctx.state === 'suspended') ctx.resume(); },
    playCreatureSound: () => {}, 
    shuffle: () => {
      for(let i=0; i<6; i++) {
         setTimeout(() => playNoise(0.12, 'bandpass', 1000 + Math.random()*400, 0.25), i * 110);
      }
      for(let i=0; i<6; i++) {
         setTimeout(() => playNoise(0.06, 'highpass', 1200 + i*200, 0.15), 1670 + (i * 88));
      }
      setTimeout(() => { 
          playNoise(0.3, 'lowpass', 350, 0.9); 
          playTone(50, 'sawtooth', 0.2, 0.5); 
      }, 2110);
    },
    cardGrab: () => playNoise(0.1, 'bandpass', 1200, 0.3),
    cardThreshold: () => { playTone(900, 'triangle', 0.05, 0.2, 300); playNoise(0.05, 'highpass', 2000, 0.1); },
    cardCancel: () => playNoise(0.1, 'bandpass', 800, 0.2),
    cardCommit: () => { playNoise(0.15, 'highpass', 2000, 0.5); playTone(150, 'sine', 0.1, 0.3, 50); },
    cardDraw: () => { playNoise(0.2, 'highpass', 800, 0.3); playTone(120, 'sine', 0.1, 0.1, 50); },
    textTick: () => playTone(600, 'triangle', 0.015, 0.3), 
    statTick: () => playTone(600, 'sine', 0.05, 0.5, 100), 
    statHeavy: () => { playTone(150, 'sine', 0.2, 0.6, 40); playNoise(0.2, 'lowpass', 400, 0.5); },
    statCriticalEnter: () => { playTone(220, 'triangle', 1.0, 0.15); playTone(233, 'triangle', 1.0, 0.15); },
    yearTick: () => playNoise(0.15, 'bandpass', 600, 0.1),
    deathHit: () => { playTone(100, 'sawtooth', 2.0, 0.4, 20); playNoise(1.5, 'lowpass', 300, 0.7); },
    restart: () => { playTone(261.63, 'sawtooth', 0.4, 0.1); setTimeout(() => playTone(329.63, 'sawtooth', 0.4, 0.1), 150); },
    achievement: () => { playTone(523.25, 'sine', 0.1, 0.2); setTimeout(() => playTone(659.25, 'sine', 0.3, 0.2), 100); },
    uiClick: () => playNoise(0.05, 'highpass', 1500, 0.1),
    ultActivate: () => { playNoise(0.8, 'lowpass', 200, 1.0); playTone(80, 'sawtooth', 1.0, 0.4); playTone(40, 'sine', 1.5, 0.5); }
  };
})();

