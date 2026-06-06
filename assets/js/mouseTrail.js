
(function initCodeRain() {
   if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'interaction-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '1',
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const syntaxGroups = [
    { tokens: ["let","const","var","int","void"],    lightRGB:"0,150,255",   darkRGB:"0,255,213"  },
    { tokens: ["for","if","else","return","async","await","import"], lightRGB:"219,0,180",  darkRGB:"255,46,204" },
    { tokens: ["</>","=>","&&","||","===","="],       lightRGB:"230,140,0",  darkRGB:"255,191,0"  },
    { tokens:[";","{}","[]","()","true","false"],     lightRGB:"0,180,50",   darkRGB:"57,255,20"  },
  ];

  let particles = [];
  let mouse = { x: -999, y: -999, vx: 0, vy: 0 };
  let lastSpawn = 0;

  const MAX_PARTICLES = 120;
  const SPAWN_INTERVAL = 55;

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function isDark() { return document.documentElement.classList.contains('dark-mode'); }

  class CodeParticle {
    constructor(x, y, mvx, mvy) {
      const g = syntaxGroups[Math.floor(Math.random() * syntaxGroups.length)];
      this.token = g.tokens[Math.floor(Math.random() * g.tokens.length)];
      this.lightRGB = g.lightRGB; this.darkRGB = g.darkRGB;
      // Scatter slightly around cursor
      this.x = x + (Math.random() - 0.5) * 14;
      this.y = y + (Math.random() - 0.5) * 8;
      // Upward drift + mouse velocity inheritance
      const a = Math.PI * 1.5 + (Math.random() - 0.5) * 1.4;
      const mag = 0.35 + Math.random() * 0.55;
      this.vx = Math.cos(a) * mag + mvx * 0.07;
      this.vy = Math.sin(a) * mag + mvy * 0.07;
      this.wobble = (Math.random() - 0.5) * 0.035;
      this.rotation = 0;
      this.opacity = 0.85 + Math.random() * 0.15;
      this.decay = 0.015 + Math.random() * 0.01;
      this.fontSize = 11 + Math.floor(Math.random() * 4);
    }
    update() {
      this.vy -= 0.01;          // subtle upward acceleration
      this.vx += this.wobble;   // organic lateral drift
      this.rotation += this.wobble * 0.25;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
    }
    draw() {
      if (this.opacity <= 0) return;
      const rgb = isDark() ? this.darkRGB : this.lightRGB;
      const c = `rgba(${rgb},${this.opacity})`;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.shadowColor = c;
      ctx.shadowBlur = isDark() ? 12 : 5;
      ctx.fillStyle = c;
      ctx.font = `700 ${this.fontSize}px 'Courier New', monospace`;
      ctx.fillText(this.token, 0, 0);
      ctx.restore();
    }
    get dead() { return this.opacity <= 0; }
  }

  function spawnParticles(x, y, count = 1) {
    if (particles.length >= MAX_PARTICLES) return;
    for (let i = 0; i < count; i++) {
      particles.push(new CodeParticle(x, y, mouse.vx, mouse.vy));
    }
  }

  function onMove(x, y) {
    const dvx = x - mouse.x;
    const dvy = y - mouse.y;
    mouse.vx = dvx; mouse.vy = dvy;
    mouse.x = x; mouse.y = y;

    const now = Date.now();
    const speed = Math.sqrt(dvx * dvx + dvy * dvy);
    if (speed > 3 && now - lastSpawn > SPAWN_INTERVAL) {
      lastSpawn = now;
      // Faster movement = more particles (1–3)
      const count = Math.min(3, 1 + Math.floor(speed / 22));
      spawnParticles(x, y, count);
    }
  }

  function onClick(x, y) {
    // 8-particle burst on click
    const saved = { vx: mouse.vx, vy: mouse.vy };
    mouse.vx = 0; mouse.vy = 0;
    spawnParticles(x, y, 8);
    mouse.vx = saved.vx; mouse.vy = saved.vy;
  }

  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
  window.addEventListener('click', e => onClick(e.clientX, e.clientY));

 

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].dead) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }

  animate();
})();