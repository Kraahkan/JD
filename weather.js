window.Weather = (() => {
  let canvas, ctx, puffCanvas, particles = [], width, height, currentType = 'clear', globalOpacity = 1.0;
  const FADE_INCREMENT = 1 / 300; 

  const createPuffTexture = () => {
      puffCanvas = document.createElement('canvas'); puffCanvas.width = 800; puffCanvas.height = 800;
      const pctx = puffCanvas.getContext('2d');
      const grad = pctx.createRadialGradient(400, 400, 0, 400, 400, 400);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)'); grad.addColorStop(0.4, 'rgba(220, 230, 255, 0.15)'); grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pctx.fillStyle = grad; pctx.fillRect(0, 0, 800, 800);
  };

  class Particle {
      constructor(type) { this.type = type; this.fade = 0; this.isDying = false; this.setup(); }
      setup() {
          if (this.type === 'fog') {
              this.size = Math.random() * (width * 0.8) + (width * 0.4); this.x = Math.random() * (width + this.size) - this.size / 2;
              this.y = Math.random() * height; this.vx = -(Math.random() * 0.4 + 0.15); this.vy = (Math.random() - 0.5) * 0.08;
              this.baseOpacity = (Math.random() * 0.2 + 0.1) * 0.5; this.rotation = Math.random() * Math.PI * 2; this.rotSpeed = (Math.random() - 0.5) * 0.0008;
          } else if (this.type === 'rain') {
              this.x = Math.random() * width; this.y = Math.random() * height;
              this.l = Math.random() * 25 + 15; this.v = Math.random() * 15 + 12;
              this.baseOpacity = Math.random() * 0.25 + 0.15;
          }
      }
      update() {
          if (this.isDying) { this.fade -= FADE_INCREMENT; } else if (this.fade < 1) { this.fade += FADE_INCREMENT; }
          this.fade = Math.max(0, Math.min(1, this.fade));
          if (this.type === 'fog') { this.x += this.vx; this.y += this.vy; this.rotation += this.rotSpeed; if (this.x + this.size < -200) this.x = width + this.size; } 
          else if (this.type === 'rain') { this.y += this.v; if (this.y > height) { this.y = -this.l; this.x = Math.random() * width; } }
      }
      draw() {
          if (this.baseOpacity * this.fade * globalOpacity <= 0) return;
          if (this.type === 'fog') {
              ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
              ctx.globalAlpha = this.baseOpacity * this.fade * globalOpacity; ctx.drawImage(puffCanvas, -this.size / 2, -this.size / 2, this.size, this.size); ctx.restore();
          } else if (this.type === 'rain') {
              ctx.beginPath(); ctx.strokeStyle = `rgba(200, 220, 255, ${this.baseOpacity * this.fade * globalOpacity})`; ctx.lineWidth = 1; ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + this.l); ctx.stroke();
          }
      }
  }

  const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const targetCount = currentType === 'fog' ? 45 : (currentType === 'rain' ? 150 : 0);
      if (particles.filter(p => !p.isDying && p.type === currentType).length < targetCount) particles.push(new Particle(currentType));
      particles = particles.filter(p => { p.update(); return !(p.isDying && p.fade <= 0); });
      particles.forEach(p => p.draw()); requestAnimationFrame(animate);
  };

  const resize = () => { width = window.innerWidth; height = window.innerHeight; if(canvas) { canvas.width = width; canvas.height = height; } };
  return {
      init: () => {
          try {
            if (document.getElementById('weather-layer')) return; 
            canvas = document.createElement('canvas'); canvas.id = 'weather-layer';
            Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', zIndex: '9998', pointerEvents: 'none' });
            document.body.appendChild(canvas); ctx = canvas.getContext('2d');
            createPuffTexture(); window.addEventListener('resize', resize); resize(); animate();
          } catch(e) {}
      },
      set: (type) => { if (type === currentType) return; particles.forEach(p => p.isDying = true); currentType = type; },
      clear: () => { particles.forEach(p => p.isDying = true); currentType = 'clear'; }
  };
})();
