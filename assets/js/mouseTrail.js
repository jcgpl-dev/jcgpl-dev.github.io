// Mouse Interaction: Neon Glowing VS Code Syntax Trail (Rising/Fly Effect)
(function initCodeRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'interaction-canvas';
  
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '1',
  });
  
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  
  // High-vibrancy glowing syntax color mapping
  const syntaxGroups = [
    {
      tokens: ["let", "const", "var", "int", "void"],
      // Vibrant Electric Cyan / Teal
      lightColor: "0, 150, 255", 
      darkColor: "0, 255, 213"
    },
    {
      tokens: ["for", "switch", "if", "else", "return", "import", "export", "async", "await"],
      // Neon Magenta / Pink Hotwire
      lightColor: "219, 0, 180", 
      darkColor: "255, 46, 204"
    },
    {
      tokens: ["</>", "=>", "&&", "||", "==", "===", "="],
      // Sharp Yellow / Peach Flare
      lightColor: "230, 140, 0", 
      darkColor: "255, 191, 0"
    },
    {
      tokens: [";", "{}", "[]", "()", "true", "false"],
      // Vivid Lime / Bright Green Matrix Accent
      lightColor: "0, 180, 50", 
      darkColor: "57, 255, 20"
    }
  ];
  
  const particles = [];

  let lastMouseX = 0;
  let lastMouseY = 0;
  let lastSpawnTime = 0; 
  
  const movementThreshold = 45; 
  const timeThrottle = 65;      

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const distance = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);

    if (distance > movementThreshold && (currentTime - lastSpawnTime) > timeThrottle) {
      particles.push(new CodeParticle(e.clientX, e.clientY));
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastSpawnTime = currentTime;
    }
  });

  function isDarkMode() {
    return document.documentElement.classList.contains('dark-mode');
  }

  class CodeParticle {
    constructor(x, y) {
      this.x = x; 
      this.y = y;
      
      const randomGroup = syntaxGroups[Math.floor(Math.random() * syntaxGroups.length)];
      this.token = randomGroup.tokens[Math.floor(Math.random() * randomGroup.tokens.length)];
      
      this.lightColorRGB = randomGroup.lightColor;
      this.darkColorRGB = randomGroup.darkColor;
      
      // FLY/RAISE EFFECT: Negative speedY pulls the particle UPWARD
      this.speedY = -(Math.random() * 0.4 + 0.2); 
      
      // GENTLE DRIFT: Adds a slight left/right float to make the lift look organic
      this.speedX = (Math.random() * 0.4 - 0.2);
      
      this.opacity = 1;
      this.fadeSpeed = 0.022; // Adjusted slightly so the rising lift is noticeable before it vanishes
      this.fontSize = Math.floor(Math.random() * 3) + 12; 
    }

    update() {
      this.y += this.speedY; // Moves upward
      this.x += this.speedX; // Drifts sideways
      this.opacity -= this.fadeSpeed;
    }

    draw() {
      const targetRGB = isDarkMode() ? this.darkColorRGB : this.lightColorRGB;
      const fullColorStr = `rgba(${targetRGB}, ${this.opacity})`;

      ctx.shadowColor = fullColorStr;
      ctx.shadowBlur = isDarkMode() ? 10 : 4; 
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = fullColorStr;
      ctx.font = `700 ${this.fontSize}px 'Courier New', Courier, monospace`;
      ctx.fillText(this.token, this.x, this.y);
      
      ctx.shadowBlur = 0;
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].opacity <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
})();