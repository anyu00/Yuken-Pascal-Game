/**
 * world2.js — Valve Factory
 * Level 1: Pipe rotation puzzle (connect flow from START to END)
 * Level 2: Valve sequence arcade (hit valves in correct order under time pressure)
 */

export class World2 {
  constructor(levelNum, onComplete) {
    this.levelNum   = levelNum;
    this.onComplete = onComplete;
    this.score      = 0;
    this.destroyed  = false;
    this._timers    = [];

    this._updateHUD();
    if (levelNum === 1) this._initPuzzle();
    if (levelNum === 2) this._initArcade();
  }

  // ─── HUD ───────────────────────────────────────────────────
  _updateHUD() {
    const titles = { 1: 'Level 1 · Rotate the Valves', 2: 'Level 2 · Switch Sequence' };
    document.getElementById('w2-level-title').textContent = titles[this.levelNum] || '';
    document.getElementById('w2-score').textContent = this.score;
    document.getElementById('w2-puzzle-area').style.display = this.levelNum === 1 ? 'block' : 'none';
    document.getElementById('w2-arcade-area').style.display = this.levelNum === 2 ? 'block' : 'none';
  }

  _addScore(pts) {
    this.score += pts;
    document.getElementById('w2-score').textContent = this.score;
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 1 — PIPE ROTATION PUZZLE
  //  4×4 grid. Each cell has a pipe piece with a rotation.
  //  Player clicks to rotate. Goal: connect START(0,0) → END(3,3)
  // ══════════════════════════════════════════════════════════

  // Pipe types: which sides are open? [top, right, bottom, left]
  // 'straight': two opposite sides
  // 'elbow':    two adjacent sides
  // 'T':        three sides
  // 'cross':    all four sides
  static PIPE_TYPES = {
    straight: [[0,1,0,1],[1,0,1,0]],              // H or V
    elbow:    [[0,1,1,0],[1,0,0,1],[0,0,1,1],[1,1,0,0]], // 4 rotations
    T:        [[1,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,1]], // 4 rotations
    cross:    [[1,1,1,1]],
  };

  _initPuzzle() {
    this.puzzleAttempts = 0;
    this.grid = this._buildGrid();
    this._renderGrid();

    document.getElementById('w2-check-btn').onclick  = () => this._checkPuzzle();
    document.getElementById('w2-reset-btn').onclick  = () => {
      this.grid = this._buildGrid();
      this._renderGrid();
      document.getElementById('w2-puzzle-feedback').textContent = '';
    };
  }

  _buildGrid() {
    // 4×4 grid. We define a known-solvable solution path,
    // then shuffle rotations of non-path cells.
    const SIZE = 4;
    // Solution path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,3)→(3,3)
    const PATH = [
      [0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[3,3]
    ];
    const pathSet = new Set(PATH.map(([r,c]) => `${r},${c}`));

    const grid = [];
    for (let r = 0; r < SIZE; r++) {
      grid[r] = [];
      for (let c = 0; c < SIZE; c++) {
        const onPath = pathSet.has(`${r},${c}`);
        // Determine connections for path cells based on neighbours
        let connections = this._pathConnections(r, c, PATH);
        // Random elbow for off-path cells
        if (!onPath) {
          connections = World2.PIPE_TYPES.elbow[Math.floor(Math.random() * 4)];
        }
        // Shuffle rotation for all non-start/end cells
        const isFixed = (r === 0 && c === 0) || (r === 3 && c === 3);
        const rotation = isFixed ? 0 : Math.floor(Math.random() * 4) * 90;
        grid[r][c] = {
          connections,          // correct connections [top,right,bottom,left]
          rotation,             // current rotation (0,90,180,270)
          correctRotation: 0,   // always stored as 0 (connections are pre-rotated)
          onPath,
          fixed: isFixed,
        };
      }
    }
    return grid;
  }

  _pathConnections(r, c, path) {
    // Build connections based on where this cell connects to in the path
    const idx = path.findIndex(([pr,pc]) => pr===r && pc===c);
    if (idx < 0) return World2.PIPE_TYPES.elbow[0];
    const prev = path[idx - 1];
    const next = path[idx + 1];
    let top=0, right=0, bottom=0, left=0;
    const dirs = [prev, next].filter(Boolean);
    dirs.forEach(([nr,nc]) => {
      if (nr === r-1) top    = 1;
      if (nr === r+1) bottom = 1;
      if (nc === c-1) left   = 1;
      if (nc === c+1) right  = 1;
    });
    return [top, right, bottom, left];
  }

  _renderGrid() {
    const container = document.getElementById('w2-valve-grid');
    container.innerHTML = '';

    this.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        const el = document.createElement('div');
        el.className = 'pipe-cell' + (cell.fixed ? ' fixed' : '');
        el.dataset.r = r; el.dataset.c = c;

        // SVG pipe based on connections (ignoring current rotation for display — we rotate SVG)
        el.innerHTML = this._pipeSVG(cell.connections, cell.rotation);

        // Labels for start/end
        if (r===0 && c===0) {
          const lbl = document.createElement('div');
          lbl.style.cssText = 'position:absolute;top:2px;left:2px;font-size:9px;color:#00c853;font-weight:bold;';
          lbl.textContent = 'IN';
          el.appendChild(lbl);
        }
        if (r===3 && c===3) {
          const lbl = document.createElement('div');
          lbl.style.cssText = 'position:absolute;bottom:2px;right:2px;font-size:9px;color:#00c853;font-weight:bold;';
          lbl.textContent = 'OUT';
          el.appendChild(lbl);
        }

        if (!cell.fixed) {
          el.addEventListener('click', () => this._rotatePipe(r, c));
        }
        container.appendChild(el);
      });
    });
  }

  _pipeSVG(connections, rotation) {
    const [top, right, bottom, left] = connections;
    const cx = 35, cy = 35, r = 35;
    const pipeW = 10, half = pipeW / 2;
    let paths = '';

    // Centre square
    paths += `<rect x="${cx-half}" y="${cy-half}" width="${pipeW}" height="${pipeW}" fill="#ff9800"/>`;

    if (top)    paths += `<rect x="${cx-half}" y="0"        width="${pipeW}" height="${cy-half}" fill="#ff9800"/>`;
    if (bottom) paths += `<rect x="${cx-half}" y="${cy+half}" width="${pipeW}" height="${r-cy-half+r}" fill="#ff9800"/>`;
    if (left)   paths += `<rect x="0"        y="${cy-half}" width="${cx-half}" height="${pipeW}" fill="#ff9800"/>`;
    if(right)   paths += `<rect x="${cx+half}" y="${cy-half}" width="${r-cx-half+r}" height="${pipeW}" fill="#ff9800"/>`;

    // Fluid overlay (animated when connected)
    const fluid = `<div class="pipe-fluid"></div>`;

    return `<svg viewBox="0 0 70 70" style="transform:rotate(${rotation}deg);transition:transform 0.3s ease;">
      <rect width="70" height="70" fill="rgba(0,0,0,0.2)" rx="4"/>
      ${paths}
    </svg>${fluid}`;
  }

  _rotatePipe(r, c) {
    if (this.destroyed) return;
    const cell = this.grid[r][c];
    cell.rotation = (cell.rotation + 90) % 360;
    // Rotate the connections array: [top,right,bottom,left] → [left,top,right,bottom]
    const [top, right, bottom, left] = cell.connections;
    cell.connections = [left, top, right, bottom];

    // Re-render just this cell's SVG
    const el = document.querySelector(`.pipe-cell[data-r="${r}"][data-c="${c}"]`);
    if (el) {
      const lbl = el.querySelector('div');
      el.innerHTML = this._pipeSVG(cell.connections, 0); // rotation now baked in
      if (lbl) el.appendChild(lbl);
      if (!cell.fixed) el.addEventListener('click', () => this._rotatePipe(r, c));
    }

    document.getElementById('w2-puzzle-feedback').textContent = '';
  }

  _checkPuzzle() {
    if (this.destroyed) return;
    this.puzzleAttempts++;
    const feedback = document.getElementById('w2-puzzle-feedback');

    // BFS from (0,0) — check if (3,3) is reachable
    const reachable = this._bfsReachable();
    if (reachable) {
      const pts = Math.max(100, 500 - (this.puzzleAttempts - 1) * 50);
      this._addScore(pts);
      feedback.textContent = `✅ Connected! Fluid flows! +${pts} pts`;
      feedback.className = 'feedback correct';
      // Animate connected cells
      this._animateFlow();
      const t = setTimeout(() => {
        if (!this.destroyed) this.onComplete(this.score, 500);
      }, 2000);
      this._timers.push(t);
    } else {
      feedback.textContent = `❌ Not connected yet! Rotate more pipes. (Attempt ${this.puzzleAttempts})`;
      feedback.className = 'feedback wrong';
    }
  }

  _bfsReachable() {
    // Direction: [dr, dc, exitSide, entrySide]
    // exitSide:  which side of current cell the flow exits (0=top,1=right,2=bottom,3=left)
    // entrySide: which side of next cell the flow enters
    const DIRS = [
      [-1, 0, 0, 2],  // go up:    exit top,   enter bottom
      [ 0, 1, 1, 3],  // go right: exit right, enter left
      [ 1, 0, 2, 0],  // go down:  exit bottom,enter top
      [ 0,-1, 3, 1],  // go left:  exit left,  enter right
    ];
    const visited = new Set(['0,0']);
    const queue = [[0, 0]];

    while (queue.length) {
      const [r, c] = queue.shift();
      if (r === 3 && c === 3) return true;

      for (const [dr, dc, exitSide, entrySide] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr > 3 || nc < 0 || nc > 3) continue;
        if (visited.has(`${nr},${nc}`)) continue;
        const curr = this.grid[r][c];
        const next = this.grid[nr][nc];
        // Check: current cell must open on exitSide AND next cell must open on entrySide
        if (curr.connections[exitSide] && next.connections[entrySide]) {
          visited.add(`${nr},${nc}`);
          queue.push([nr, nc]);
        }
      }
    }
    return false;
  }

  _animateFlow() {
    document.querySelectorAll('.pipe-cell').forEach(el => {
      el.classList.add('connected');
    });
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 2 — VALVE SEQUENCE ARCADE
  //  A sequence of 5 valves lights up one at a time.
  //  Player must click them in order before each timer expires.
  // ══════════════════════════════════════════════════════════
  _initArcade() {
    this.arcadeStep    = 0;
    this.arcadeScore   = 0;
    this.arcadeRound   = 0;
    this.totalRounds   = 5;
    this.timePerStep   = 4000;  // ms to click each valve
    this.arcadeTimer   = null;

    const VALVES = [
      { id: 'P', label: 'Pressure Inlet (P)', color: '#f44336' },
      { id: 'A', label: 'Port A',             color: '#ff9800' },
      { id: 'B', label: 'Port B',             color: '#2196f3' },
      { id: 'T', label: 'Tank Return (T)',    color: '#4caf50' },
      { id: 'V', label: 'Valve Switch',       color: '#9c27b0' },
    ];

    // Each round: random sequence of 3 valve IDs
    this._arcadeSequences = Array.from({ length: this.totalRounds }, () =>
      [...VALVES].sort(() => Math.random() - 0.5).slice(0, 3).map(v => v.id)
    );

    this._arcadeValves = VALVES;
    this._renderArcadeRound();
  }

  _renderArcadeRound() {
    if (this.destroyed || this.arcadeRound >= this.totalRounds) {
      this._arcadeFinish();
      return;
    }

    const seq      = this._arcadeSequences[this.arcadeRound];
    const stepEl   = document.getElementById('w2-step');
    const totalEl  = document.getElementById('w2-total-steps');
    const feedback = document.getElementById('w2-arcade-feedback');
    const seqWrap  = document.getElementById('w2-valve-sequence');

    stepEl.textContent   = this.arcadeRound + 1;
    totalEl.textContent  = this.totalRounds;
    feedback.textContent = `Hit valve: ${seq[this.arcadeStep]} →`;
    feedback.className   = 'feedback neutral';

    seqWrap.innerHTML = '';
    this._arcadeValves.forEach(valve => {
      const btn = document.createElement('button');
      btn.className   = 'results-btn';
      btn.dataset.vid = valve.id;
      btn.style.cssText = `background:${valve.color};border:3px solid transparent;padding:14px 20px;font-size:1rem;min-width:80px;`;
      btn.innerHTML = `<strong>${valve.id}</strong><br><span style="font-size:0.7rem;">${valve.label}</span>`;
      btn.addEventListener('click', () => this._arcadeClick(valve.id, seq));
      seqWrap.appendChild(btn);
    });

    this._highlightTarget(seq[0]);
    this._startArcadeTimer(seq);
  }

  _highlightTarget(valveId) {
    document.querySelectorAll('#w2-valve-sequence button').forEach(btn => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = 'none';
      if (btn.dataset.vid === valveId) {
        btn.style.transform  = 'scale(1.15)';
        btn.style.boxShadow  = '0 0 20px white';
        btn.style.border     = '3px solid white';
      }
    });
  }

  _startArcadeTimer(seq) {
    clearInterval(this.arcadeTimer);
    const fill = document.getElementById('w2-timer-fill');
    let elapsed = 0;
    const interval = 50;
    fill.style.width = '100%';
    fill.style.transition = 'none';

    this.arcadeTimer = setInterval(() => {
      if (this.destroyed) { clearInterval(this.arcadeTimer); return; }
      elapsed += interval;
      const pct = Math.max(0, 100 - (elapsed / this.timePerStep) * 100);
      fill.style.width = pct + '%';
      if (pct <= 30) fill.style.background = 'linear-gradient(90deg,#f44336,#ff1744)';
      else           fill.style.background = 'linear-gradient(90deg,#ff9800,#ffcc02)';

      if (elapsed >= this.timePerStep) {
        clearInterval(this.arcadeTimer);
        this._arcadeMiss(seq);
      }
    }, interval);
    this._timers.push(this.arcadeTimer);
  }

  _arcadeClick(valveId, seq) {
    if (this.destroyed) return;
    const target = seq[this.arcadeStep];
    const feedback = document.getElementById('w2-arcade-feedback');

    if (valveId === target) {
      clearInterval(this.arcadeTimer);
      this._addScore(80);
      this.arcadeStep++;
      feedback.textContent = `✅ Correct! Step ${this.arcadeStep} of ${seq.length}`;
      feedback.className = 'feedback correct';

      if (this.arcadeStep >= seq.length) {
        // Round complete
        this._addScore(50); // round bonus
        feedback.textContent = `🎉 Round ${this.arcadeRound + 1} complete! +50 bonus`;
        this.arcadeStep  = 0;
        this.arcadeRound++;
        const t = setTimeout(() => {
          if (!this.destroyed) {
            document.getElementById('w2-timer-fill').style.width = '100%';
            this._renderArcadeRound();
          }
        }, 900);
        this._timers.push(t);
      } else {
        this._highlightTarget(seq[this.arcadeStep]);
        this._startArcadeTimer(seq);
        feedback.textContent = `✅ Now hit: ${seq[this.arcadeStep]}`;
      }
    } else {
      // Wrong valve — penalise
      feedback.textContent = `❌ Wrong! Hit: ${target}`;
      feedback.className = 'feedback wrong';
      this.score = Math.max(0, this.score - 20);
      document.getElementById('w2-score').textContent = this.score;
    }
  }

  _arcadeMiss(seq) {
    if (this.destroyed) return;
    const feedback = document.getElementById('w2-arcade-feedback');
    feedback.textContent = `⏱ Too slow! Moving to next round...`;
    feedback.className = 'feedback wrong';
    this.arcadeStep  = 0;
    this.arcadeRound++;
    const t = setTimeout(() => {
      if (!this.destroyed) this._renderArcadeRound();
    }, 1200);
    this._timers.push(t);
  }

  _arcadeFinish() {
    const feedback = document.getElementById('w2-arcade-feedback');
    feedback.textContent = `🏁 All rounds done! Score: ${this.score} pts`;
    feedback.className = 'feedback correct';
    const t = setTimeout(() => {
      if (!this.destroyed) this.onComplete(this.score, 650);
    }, 1800);
    this._timers.push(t);
  }

  // ─── Cleanup ────────────────────────────────────────────
  destroy() {
    this.destroyed = true;
    clearInterval(this.arcadeTimer);
    this._timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    this._timers = [];
  }
}
