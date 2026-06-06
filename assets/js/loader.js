// assets/js/loader.js
// Genuine terminal loading animation for jesie.gapol portfolio

const LINES = [
  {
    type: "cmd",
    parts: [
      { type: "kw", text: "import " },
      { type: "fn", text: "Portfolio" },
      { type: "plain", text: " from " },
      { type: "num", text: '"./jesie.gapol"' },
    ],
  },
  { type: "out", id: "module-wait", text: "// loading modules..." },
  { type: "bar", id: "asset-bar", label: "bundling" },
  {
    type: "cmd",
    parts: [
      { type: "kw", text: "await " },
      { type: "fn", text: "init" },
      { type: "plain", text: "({ theme: " },
      { type: "num", text: '"dark"' },
      { type: "plain", text: " })" },
    ],
  },
  { type: "ok", text: "✓  ready" },
];

const BAR_STEPS = 16;
const LINE_DELAY = 60;   // Snappy text print speed for code commands
const DONE_HOLD  = 400;  // Quick pause on completion before entry

let timeouts = [];
let modulesReady = false;
let assetsReady = false;

function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildCmdHTML(parts) {
  return parts
    .map((p) => {
      const s = esc(p.text);
      if (p.type === "plain") return s;
      return `<span class="loader-t-${p.type}">${s}</span>`;
    })
    .join("");
}

function appendLine(container, html) {
  const row = document.createElement("div");
  row.className = "loader-t-line";
  row.innerHTML = html;
  container.appendChild(row);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => row.classList.add("visible"))
  );
  return row;
}

// Simulated smooth progress bar that caps early if the network is still downloading assets
function runRealBar(container, onDone) {
  let step = 0;
  const row = appendLine(
    container,
    `<span class="loader-t-out">bundling ` +
      `<span class="loader-bar-filled"></span>` +
      `<span class="loader-bar-empty">${"░".repeat(BAR_STEPS)}</span>` +
      ` <span class="loader-t-num">0%</span></span>`
  );

  const filled = row.querySelector(".loader-bar-filled");
  const empty  = row.querySelector(".loader-bar-empty");
  const pct    = row.querySelector(".loader-t-num");

  const tick = () => {
    // If assets haven't finished downloading via window.onload, cap the loading bar at ~85%
    if (step >= BAR_STEPS - 3 && !assetsReady) {
      timeouts.push(setTimeout(tick, 100)); // Poll network state
      return;
    }

    step++;
    filled.textContent = "█".repeat(step);
    empty.textContent  = "░".repeat(BAR_STEPS - step);
    pct.textContent    = Math.round((step / BAR_STEPS) * 100) + "%";

    if (step < BAR_STEPS) {
      // Speeds up dynamically if assets are already cached/ready early
      const currentTickSpeed = assetsReady ? 20 : 65; 
      timeouts.push(setTimeout(tick, currentTickSpeed));
    } else {
      onDone?.();
    }
  };
  timeouts.push(setTimeout(tick, 40));
}

function runSequence(container, idx, onComplete) {
  if (idx >= LINES.length) {
    appendLine(container, `<span class="loader-t-prompt">❯</span><span class="loader-cursor"></span>`);
    timeouts.push(setTimeout(onComplete, DONE_HOLD));
    return;
  }

  const seq = LINES[idx];
  const next = () => timeouts.push(setTimeout(() => runSequence(container, idx + 1, onComplete), LINE_DELAY));

  if (seq.id === "module-wait") {
    appendLine(container, `<span class="loader-t-out">${esc(seq.text)}</span>`);
    // Real checkpoint: Wait for document.readyState interactive phase
    const checkModules = () => {
      if (modulesReady || document.readyState === "interactive" || document.readyState === "complete") {
        next();
      } else {
        setTimeout(checkModules, 30);
      }
    };
    checkModules();
  } 
  else if (seq.id === "asset-bar") {
    runRealBar(container, next);
  } 
  else {
    // Standard quick console print paths
    if (seq.type === "cmd") {
      appendLine(container, `<span class="loader-t-prompt">❯</span><span class="loader-t-cmd">${buildCmdHTML(seq.parts)}</span>`);
    } else if (seq.type === "ok") {
      appendLine(container, `<span class="loader-t-ok">${esc(seq.text)}</span>`);
    }
    next();
  }
}

// Exposed event hooks called by main.js
export function notifyModulesLoaded() { modulesReady = true; }
export function notifyAssetsLoaded() { assetsReady = true; }

export function initLoader() {
  const overlay     = document.getElementById("page-loader");
  const mainContent = document.getElementById("main-content");
  const chatToggle  = document.getElementById("chat-toggle");

  if (!overlay) return;
  const loaderContent = overlay.querySelector(".loader-content");
  if (!loaderContent) return;

  loaderContent.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo-line">
        <span class="loader-logo-bracket">&lt;</span><span class="loader-logo-name">JC.DEV</span><span class="loader-logo-bracket">/&gt;</span>
      </div>
      <div class="loader-terminal" id="loader-terminal"></div>
    </div>
  `;

  const terminal = document.getElementById("loader-terminal");

  runSequence(terminal, 0, () => {
    overlay.classList.add("fade-out");
    if (mainContent) mainContent.style.opacity = "1";
    if (chatToggle)  chatToggle.style.opacity = "1";
    
    timeouts.push(
      setTimeout(() => {
        overlay.style.display = "none";
        overlay.remove(); // Clean up DOM completely
      }, 450)
    );
  });
}