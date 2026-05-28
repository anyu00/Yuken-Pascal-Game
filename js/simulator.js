/**
 * simulator.js — 3 Interactive Physics Demos
 * Demo 1: Hydraulic Press   (P = F ÷ A → output force)
 * Demo 2: Car Brakes        (equal pressure distribution)
 * Demo 3: Underwater Diver  (depth vs pressure)
 */
import { UI, HINTS, BRAND } from './content.js';
import { getLang } from './lang.js';

let activeDemo = null;

// ─── INIT ───────────────────────────────────────────────────
export function initSimulator() {
  renderDemoCards();
  renderBrandProducts();

  document.querySelectorAll('.demo-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.demo;
      openDemo(id);
    });
  });

  document.getElementById('btn-back-demos').addEventListener('click', closeDemos);
  document.addEventListener('langchange', () => {
    renderDemoCards();
    if (activeDemo) reopenDemo(activeDemo);
  });
}

function renderBrandProducts() {
  const container = document.getElementById('brand-products');
  if (!container) return;
  container.innerHTML = BRAND.products.map(p => `
    <a class="brand-product-card" href="${p.link}" target="_blank" rel="noopener">
      <img src="${p.img}" alt="${p.nameen}" onerror="this.src='assets/yuken-logo.svg'" />
      <div class="brand-product-name">${getLang() === 'ja' ? p.nameja : p.nameen}</div>
    </a>
  `).join('');
}

function renderDemoCards() {
  const s = UI[getLang()];
  const cards = [
    { id: 'press',  title: s.demo1Title, sub: s.demo1Sub,  emoji: '🔴' },
    { id: 'brakes', title: s.demo2Title, sub: s.demo2Sub,  emoji: '🔵' },
    { id: 'diver',  title: s.demo3Title, sub: s.demo3Sub,  emoji: '🟢' },
  ];
  const grid = document.getElementById('demos-grid');
  if (!grid) return;
  grid.innerHTML = cards.map(c => `
    <div class="demo-card" data-demo="${c.id}">
      <div class="demo-card-emoji">${c.emoji}</div>
      <div class="demo-card-title">${c.title}</div>
      <div class="demo-card-sub">${c.sub}</div>
      <button class="demo-try-btn" data-key="tryBtn">${UI[getLang()].tryBtn}</button>
    </div>
  `).join('');
  // Re-bind clicks after re-render
  grid.querySelectorAll('.demo-card').forEach(card => {
    card.addEventListener('click', () => openDemo(card.dataset.demo));
  });
}

function openDemo(id) {
  activeDemo = id;
  document.getElementById('demos-grid-wrap').style.display = 'none';
  const panel = document.getElementById('demo-panel');
  panel.style.display = 'flex';
  panel.innerHTML = buildDemoHTML(id);
  bindDemoEvents(id);
  animateDemoIn(panel);
}

function reopenDemo(id) {
  const panel = document.getElementById('demo-panel');
  if (panel.style.display !== 'none') {
    panel.innerHTML = buildDemoHTML(id);
    bindDemoEvents(id);
  }
}

function closeDemos() {
  activeDemo = null;
  document.getElementById('demos-grid-wrap').style.display = 'flex';
  document.getElementById('demo-panel').style.display = 'none';
}

function animateDemoIn(panel) {
  panel.style.opacity = '0';
  panel.style.transform = 'scale(0.92)';
  requestAnimationFrame(() => {
    panel.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
    panel.style.opacity = '1';
    panel.style.transform = 'scale(1)';
  });
}

// ─── BUILD DEMO HTML ────────────────────────────────────────
function buildDemoHTML(id) {
  const s = UI[getLang()];
  const h = HINTS[getLang()];

  if (id === 'press')  return buildPressHTML(s, h);
  if (id === 'brakes') return buildBrakesHTML(s, h);
  if (id === 'diver')  return buildDiverHTML(s, h);
  return '';
}

// ── DEMO 1: HYDRAULIC PRESS ──────────────────────────────────
function buildPressHTML(s, h) {
  return `
    <div class="demo-inner press-demo">
      <h2>${s.demo1Title}</h2>
      <p class="demo-desc">${s.demo1Sub}</p>

      <div class="press-visual" id="press-visual">
        <div class="piston-side input-side">
          <div class="piston-label">${s.inputForce}</div>
          <div class="piston-arrow" id="arrow-input">⬇️</div>
          <div class="piston-tube">
            <div class="piston-head" id="piston-in"></div>
          </div>
          <div class="piston-value" id="val-f">10 N</div>
        </div>

        <div class="fluid-connector">
          <div class="fluid-fill" id="fluid-fill"></div>
          <div class="pascal-law-label">Pascal's Law</div>
        </div>

        <div class="piston-side output-side">
          <div class="piston-arrow up" id="arrow-output">⬆️</div>
          <div class="piston-tube wide">
            <div class="piston-head wide" id="piston-out"></div>
          </div>
          <div class="piston-label">${s.outputForce}</div>
          <div class="piston-value highlight" id="val-out">? N</div>
        </div>
      </div>

      <div class="controls-grid">
        <div class="control-group">
          <label>${s.inputForce}: <strong id="disp-f">10</strong> ${s.forceUnit}</label>
          <input type="range" id="sl-force" min="1" max="200" value="10" class="slider red-slider" />
        </div>
        <div class="control-group">
          <label>${s.inputArea}: <strong id="disp-a1">5</strong> ${s.areaUnit}</label>
          <input type="range" id="sl-a1" min="1" max="20" value="5" class="slider orange-slider" />
        </div>
        <div class="control-group">
          <label>${s.outputArea}: <strong id="disp-a2">50</strong> ${s.areaUnit}</label>
          <input type="range" id="sl-a2" min="5" max="200" value="50" class="slider yellow-slider" />
        </div>
      </div>

      <div class="formula-box">
        <div class="formula-row">
          <span class="fval red"  id="disp-p">P = ?</span>
          <span class="fop">=</span>
          <span class="fval blue" id="disp-f2">F</span>
          <span class="fop">÷</span>
          <span class="fval orange" id="disp-a3">A</span>
        </div>
        <div class="hint-text" id="press-hint">${h.press_low}</div>
      </div>

      <div class="product-link-bar" id="demo-product-bar"></div>
    </div>`;
}

// ── DEMO 2: CAR BRAKES ───────────────────────────────────────
function buildBrakesHTML(s, h) {
  return `
    <div class="demo-inner brakes-demo">
      <h2>${s.demo2Title}</h2>
      <p class="demo-desc">${s.demo2Sub}</p>

      <div class="car-visual" id="car-visual">
        <div class="car-body-wrap">
          <div class="car-svg">🚗</div>
          <div class="pedal-area">
            <button class="brake-btn" id="brake-btn">${s.brakePedal}</button>
            <div class="pedal-visual" id="pedal-el">🦶</div>
          </div>
        </div>

        <div class="pipe-network" id="pipe-net">
          <svg width="100%" height="160" viewBox="0 0 400 160" id="pipe-svg">
            <!-- Master cylinder -->
            <rect x="175" y="60" width="50" height="40" rx="6"
                  fill="#1a3a5c" stroke="#00d4ff" stroke-width="2" id="master-cyl"/>
            <text x="200" y="84" text-anchor="middle" fill="#00d4ff"
                  font-size="10">Master</text>

            <!-- Pipes to 4 wheels -->
            <line x1="200" y1="60" x2="60"  y2="20"  stroke="#00d4ff" stroke-width="3"
                  stroke-dasharray="200" stroke-dashoffset="200" id="pipe-fl"/>
            <line x1="200" y1="60" x2="340" y2="20"  stroke="#00d4ff" stroke-width="3"
                  stroke-dasharray="200" stroke-dashoffset="200" id="pipe-fr"/>
            <line x1="200" y1="100" x2="60"  y2="140" stroke="#00d4ff" stroke-width="3"
                  stroke-dasharray="200" stroke-dashoffset="200" id="pipe-rl"/>
            <line x1="200" y1="100" x2="340" y2="140" stroke="#00d4ff" stroke-width="3"
                  stroke-dasharray="200" stroke-dashoffset="200" id="pipe-rr"/>

            <!-- 4 Wheel cylinders -->
            <circle cx="60"  cy="20"  r="18" fill="#0a2e1a" stroke="#4caf50" stroke-width="2"
                    id="wc-fl"/>
            <text x="60"  y="24"  text-anchor="middle" fill="#4caf50" font-size="9">FL</text>
            <circle cx="340" cy="20"  r="18" fill="#0a2e1a" stroke="#4caf50" stroke-width="2"
                    id="wc-fr"/>
            <text x="340" y="24"  text-anchor="middle" fill="#4caf50" font-size="9">FR</text>
            <circle cx="60"  cy="140" r="18" fill="#0a2e1a" stroke="#4caf50" stroke-width="2"
                    id="wc-rl"/>
            <text x="60"  y="144" text-anchor="middle" fill="#4caf50" font-size="9">RL</text>
            <circle cx="340" cy="140" r="18" fill="#0a2e1a" stroke="#4caf50" stroke-width="2"
                    id="wc-rr"/>
            <text x="340" y="144" text-anchor="middle" fill="#4caf50" font-size="9">RR</text>
          </svg>
        </div>

        <div class="pressure-eq-row" id="pressure-eq">
          <span class="pressure-badge" id="pr-fl">FL: 0</span>
          <span class="pressure-badge" id="pr-fr">FR: 0</span>
          <span class="pressure-badge" id="pr-rl">RL: 0</span>
          <span class="pressure-badge" id="pr-rr">RR: 0</span>
        </div>
      </div>

      <div class="hint-text" id="brakes-hint">${h.brake_idle}</div>
      <div class="product-link-bar" id="demo-product-bar"></div>
    </div>`;
}

// ── DEMO 3: UNDERWATER DIVER ─────────────────────────────────
function buildDiverHTML(s, h) {
  return `
    <div class="demo-inner diver-demo">
      <h2>${s.demo3Title}</h2>
      <p class="demo-desc">${s.demo3Sub}</p>

      <div class="ocean-wrap" id="ocean-wrap">
        <div class="ocean-bg">
          <div class="ocean-surface">🌊🌊🌊🌊🌊</div>
          <div class="diver-track">
            <div class="diver-sprite" id="diver">🤿</div>
            <div class="depth-ruler">
              ${[0,10,20,30,40,50].map(d =>
                `<div class="ruler-mark" style="top:${d*2}%">${d}m</div>`
              ).join('')}
            </div>
          </div>
          <div class="bubbles-layer" id="bubbles"></div>
        </div>

        <div class="gauge-wrap">
          <div class="gauge-label">${s.pressure}</div>
          <div class="gauge-outer">
            <div class="gauge-fill" id="gauge-fill" style="height:0%"></div>
            <div class="gauge-value" id="gauge-val">0 N/cm²</div>
          </div>
          <div class="gauge-zone danger" style="top:0%;height:30%">😱</div>
          <div class="gauge-zone warning" style="top:30%;height:30%">😬</div>
          <div class="gauge-zone safe" style="top:60%;height:40%">😌</div>
        </div>
      </div>

      <div class="control-group full-width">
        <label>${s.depth}: <strong id="disp-depth">0</strong> ${s.depthUnit}</label>
        <input type="range" id="sl-depth" min="0" max="100" value="0"
               class="slider blue-slider" style="width:100%" />
      </div>

      <div class="formula-box">
        <div class="formula-row">
          <span class="fval blue">P</span>
          <span class="fop">≈</span>
          <span class="fval green">depth × 0.1</span>
          <span class="fop">=</span>
          <span class="fval highlight" id="diver-p-val">0 N/cm²</span>
        </div>
      </div>

      <div class="hint-text" id="diver-hint">${h.diver_surf}</div>
      <div class="product-link-bar" id="demo-product-bar"></div>
    </div>`;
}

// ─── BIND EVENTS ────────────────────────────────────────────
function bindDemoEvents(id) {
  injectProductBar();
  if (id === 'press')  bindPress();
  if (id === 'brakes') bindBrakes();
  if (id === 'diver')  bindDiver();
}

function injectProductBar() {
  const bar = document.getElementById('demo-product-bar');
  if (!bar) return;
  const lang = getLang();
  bar.innerHTML = `
    <span style="color:var(--color-muted);font-size:0.8rem;">
      ${UI[lang].poweredBy}
    </span>
    ${BRAND.products.slice(0, 2).map(p => `
      <a class="mini-product-link" href="${p.link}" target="_blank" rel="noopener">
        <img src="${p.img}" alt="${lang === 'ja' ? p.nameja : p.nameen}"
             onerror="this.style.display='none'" />
        ${lang === 'ja' ? p.nameja : p.nameen}
      </a>
    `).join('')}`;
}

// ── PRESS LOGIC ──────────────────────────────────────────────
function bindPress() {
  const slF  = document.getElementById('sl-force');
  const slA1 = document.getElementById('sl-a1');
  const slA2 = document.getElementById('sl-a2');

  [slF, slA1, slA2].forEach(sl => sl.addEventListener('input', updatePress));
  updatePress();
}

function updatePress() {
  const F  = +document.getElementById('sl-force').value;
  const A1 = +document.getElementById('sl-a1').value;
  const A2 = +document.getElementById('sl-a2').value;

  const P    = F / A1;
  const Fout = P * A2;
  const ratio = Math.min(Fout / 2000, 1);

  document.getElementById('disp-f').textContent  = F;
  document.getElementById('disp-f2').textContent = F + ' N';
  document.getElementById('disp-a1').textContent = A1;
  document.getElementById('disp-a3').textContent = A1 + ' cm²';
  document.getElementById('disp-a2').textContent = A2;
  document.getElementById('disp-p').textContent  = `P = ${P.toFixed(2)} N/cm²`;
  document.getElementById('val-f').textContent   = F + ' N';
  document.getElementById('val-out').textContent = Fout.toFixed(1) + ' N';

  // Animate pistons
  const pistonIn  = document.getElementById('piston-in');
  const pistonOut = document.getElementById('piston-out');
  const arrowIn   = document.getElementById('arrow-input');
  const arrowOut  = document.getElementById('arrow-output');
  const fluid     = document.getElementById('fluid-fill');

  if (pistonIn)  pistonIn.style.transform  = `translateY(${Math.min(F / 5, 30)}px)`;
  if (pistonOut) pistonOut.style.transform = `translateY(-${Math.min(Fout / 40, 30)}px)`;
  if (arrowIn)   arrowIn.style.fontSize    = `${1 + F / 100}rem`;
  if (arrowOut) {
    arrowOut.style.fontSize = `${1 + Fout / 500}rem`;
    arrowOut.style.filter   = ratio > 0.5 ? 'hue-rotate(0deg) brightness(1.5)' : '';
  }
  if (fluid) fluid.style.width = `${30 + ratio * 70}%`;

  // Hint
  const h = HINTS[getLang()];
  const hintEl = document.getElementById('press-hint');
  if (hintEl) hintEl.textContent = Fout > 500 ? h.press_high : h.press_low;

  // Flash highlight on big output
  const outVal = document.getElementById('val-out');
  if (outVal) {
    outVal.classList.remove('flash-highlight');
    void outVal.offsetWidth;
    if (Fout > 200) outVal.classList.add('flash-highlight');
  }
}

// ── BRAKES LOGIC ─────────────────────────────────────────────
function bindBrakes() {
  const btn = document.getElementById('brake-btn');
  if (btn) btn.addEventListener('click', fireBrakes);
}

let brakeActive = false;

function fireBrakes() {
  if (brakeActive) { resetBrakes(); return; }
  brakeActive = true;

  const btn   = document.getElementById('brake-btn');
  const pedal = document.getElementById('pedal-el');
  const h     = HINTS[getLang()];

  if (btn)   btn.textContent = getLang() === 'ja' ? 'ブレーキ解除 🔓' : 'Release 🔓';
  if (pedal) {
    pedal.style.transform  = 'translateY(20px) rotate(-20deg)';
    pedal.style.transition = 'transform 0.3s ease';
  }

  // Master cylinder pulse
  const mc = document.getElementById('master-cyl');
  if (mc) mc.style.fill = '#0d4a8f';

  // Animate pipes with staggered delay
  const pipes = ['pipe-fl','pipe-fr','pipe-rl','pipe-rr'];
  pipes.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      el.style.stroke = '#00ff99';
      el.style.strokeDashoffset = '0';
      el.style.transition = `stroke-dashoffset 0.6s ease ${i * 0.15}s, stroke 0.2s ease`;
    }, i * 150);
  });

  // Light up wheel cylinders
  const wcs = ['wc-fl','wc-fr','wc-rl','wc-rr'];
  const prs = ['pr-fl','pr-fr','pr-rl','pr-rr'];
  const P   = 25; // fixed demo pressure
  wcs.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.style.fill   = '#0a4a1a';
        el.style.stroke = '#00ff99';
        el.style.filter = 'drop-shadow(0 0 6px #00ff99)';
        el.style.transition = 'all 0.3s ease';
      }
      const pr = document.getElementById(prs[i]);
      if (pr) {
        pr.textContent = `${['FL','FR','RL','RR'][i]}: ${P} N/cm²`;
        pr.style.background = '#00ff99';
        pr.style.color = '#000';
        pr.classList.add('badge-pop');
      }
    }, 200 + i * 150);
  });

  const hintEl = document.getElementById('brakes-hint');
  setTimeout(() => {
    if (hintEl) hintEl.textContent = h.brake_press;
  }, 900);
}

function resetBrakes() {
  brakeActive = false;
  const btn   = document.getElementById('brake-btn');
  const pedal = document.getElementById('pedal-el');
  const h     = HINTS[getLang()];
  const lang  = getLang();

  if (btn)   btn.textContent = lang === 'ja' ? 'ブレーキを踏む！' : 'Press Brake Pedal!';
  if (pedal) pedal.style.transform = '';

  ['pipe-fl','pipe-fr','pipe-rl','pipe-rr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.stroke = '#00d4ff';
      el.style.strokeDashoffset = '200';
      el.style.transition = 'stroke-dashoffset 0.4s ease, stroke 0.2s ease';
    }
  });
  ['wc-fl','wc-fr','wc-rl','wc-rr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.fill = '#0a2e1a'; el.style.stroke = '#4caf50'; el.style.filter = ''; }
  });
  ['pr-fl','pr-fr','pr-rl','pr-rr'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent  = `${['FL','FR','RL','RR'][i]}: 0`;
      el.style.background = '';
      el.style.color = '';
      el.classList.remove('badge-pop');
    }
  });

  const hintEl = document.getElementById('brakes-hint');
  if (hintEl) hintEl.textContent = h.brake_idle;
}

// ── DIVER LOGIC ──────────────────────────────────────────────
let bubbleTimer = null;

function bindDiver() {
  const sl = document.getElementById('sl-depth');
  if (sl) sl.addEventListener('input', updateDiver);
  spawnBubbles();
  updateDiver();
}

function updateDiver() {
  const depth  = +document.getElementById('sl-depth').value;
  const P      = (depth * 0.1).toFixed(2);
  const ratio  = depth / 100;
  const h      = HINTS[getLang()];

  document.getElementById('disp-depth').textContent  = depth;
  document.getElementById('diver-p-val').textContent  = `${P} N/cm²`;

  // Move diver
  const diver = document.getElementById('diver');
  if (diver) {
    diver.style.top        = `${5 + ratio * 85}%`;
    diver.style.fontSize   = `${2 - ratio * 0.8}rem`;
    diver.style.transition = 'top 0.3s ease, font-size 0.3s ease';
    diver.style.filter     =
      ratio > 0.66 ? 'hue-rotate(200deg) brightness(0.7)' :
      ratio > 0.33 ? 'hue-rotate(100deg)' : '';
  }

  // Gauge
  const fill  = document.getElementById('gauge-fill');
  const val   = document.getElementById('gauge-val');
  if (fill) {
    fill.style.height = `${ratio * 100}%`;
    fill.style.background =
      ratio > 0.66 ? 'var(--color-danger)' :
      ratio > 0.33 ? '#ff9800' : '#4caf50';
  }
  if (val) val.textContent = `${P} N/cm²`;

  // Hint
  const hintEl = document.getElementById('diver-hint');
  if (hintEl) {
    hintEl.textContent =
      ratio > 0.66 ? h.diver_deep :
      ratio > 0.33 ? h.diver_mid  : h.diver_surf;
  }
}

function spawnBubbles() {
  if (bubbleTimer) clearInterval(bubbleTimer);
  bubbleTimer = setInterval(() => {
    const layer = document.getElementById('bubbles');
    if (!layer) { clearInterval(bubbleTimer); return; }
    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.left     = `${Math.random() * 90}%`;
    b.style.bottom   = '0';
    b.style.animationDuration = `${2 + Math.random() * 3}s`;
    layer.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }, 600);
}
