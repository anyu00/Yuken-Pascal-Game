/**
 * world1.js — Pump Village
 * Level 1: Drag-the-pump puzzle
 * Level 2: Tap arcade (build pressure)
 */

export class World1 {
  constructor(levelNum, onComplete) {
    this.levelNum   = levelNum;
    this.onComplete = onComplete;   // callback(score, maxScore)
    this.score      = 0;
    this.destroyed  = false;
    this._timers    = [];

    this._updateHUD();
    if (levelNum === 1) this._initDrag();
    if (levelNum === 2) this._initTap();
  }

  // ─── HUD ───────────────────────────────────────────────────
  _updateHUD() {
    const titles = { 1: 'Level 1 · Drag the Pump', 2: 'Level 2 · Build Pressure!' };
    document.getElementById('w1-level-title').textContent = titles[this.levelNum] || '';
    document.getElementById('w1-score').textContent = this.score;
    // Show correct game panel
    document.getElementById('w1-drag-area').style.display = this.levelNum === 1 ? 'block' : 'none';
    document.getElementById('w1-tap-area').style.display  = this.levelNum === 2 ? 'block' : 'none';
  }

  _addScore(pts) {
    this.score += pts;
    document.getElementById('w1-score').textContent = this.score;
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 1 — DRAG-THE-PUMP PUZZLE
  // ══════════════════════════════════════════════════════════
  _initDrag() {
    // 4 rounds: drag correct pump to slot
    this.dragRound   = 0;
    this.dragCorrect = 0;

    const PUMPS = [
      { id: 'vane',    label: 'Vane Pump',   src: 'assets/svg/vane-pump.svg' },
      { id: 'piston',  label: 'Piston Pump', src: 'assets/svg/piston-pump.svg' },
      { id: 'power',   label: 'Power Unit',  src: 'assets/svg/power-unit.svg' },
      { id: 'valve',   label: 'Valve',       src: 'assets/svg/directional-valve.svg' },
    ];

    // Each round asks player to drop a specific pump
    this.dragRounds = [
      { answer: 'vane',   prompt: 'Drop the VANE PUMP into the slot!' },
      { answer: 'piston', prompt: 'Drop the PISTON PUMP into the slot!' },
      { answer: 'power',  prompt: 'Drop the POWER UNIT into the slot!' },
      { answer: 'vane',   prompt: 'Which pump creates smooth, steady flow? Drop it!' },
    ];

    this._renderDragRound(PUMPS);
  }

  _renderDragRound(pumps) {
    const round = this.dragRounds[this.dragRound];
    const itemsEl = document.getElementById('w1-drag-items');
    const zonesEl = document.getElementById('w1-drop-zones');
    const feedback = document.getElementById('w1-drag-feedback');

    document.getElementById('w1-drag-instruction').textContent =
      `🎯 Round ${this.dragRound + 1} of ${this.dragRounds.length}: ${round.prompt}`;
    feedback.textContent = '';
    feedback.className = 'feedback neutral';

    // Shuffled pump items
    const shuffled = [...pumps].sort(() => Math.random() - 0.5);
    itemsEl.innerHTML = '';
    shuffled.forEach(pump => {
      const el = document.createElement('div');
      el.className = 'drag-item';
      el.draggable = true;
      el.dataset.id = pump.id;
      el.innerHTML = `
        <img src="${pump.src}" alt="${pump.label}"
             style="width:80px;height:80px;object-fit:contain;display:block;" />
        <div style="text-align:center;font-size:0.75rem;color:var(--color-muted);margin-top:4px;">${pump.label}</div>
      `;
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('pumpId', pump.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));

      // Touch support
      el.addEventListener('touchstart', e => this._touchStart(e, pump.id), { passive: true });
      itemsEl.appendChild(el);
    });

    // Drop zone
    zonesEl.innerHTML = '';
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.id = 'w1-main-drop';
    zone.innerHTML = `<span style="font-size:2rem;">⬇️</span><br><span>Drop Here</span>`;

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id = e.dataTransfer.getData('pumpId');
      this._checkDrop(id, zone, pumps);
    });
    // Touch drop
    zone.id = 'w1-main-drop';
    zonesEl.appendChild(zone);
  }

  _checkDrop(pumpId, zone, pumps) {
    const round = this.dragRounds[this.dragRound];
    const feedback = document.getElementById('w1-drag-feedback');

    if (pumpId === round.answer) {
      zone.classList.add('correct');
      zone.innerHTML = `<img src="assets/svg/${pumpId === 'power' ? 'power-unit' : pumpId + '-pump'}.svg"
        style="width:90px;height:90px;object-fit:contain;" />`;
      feedback.textContent = '✅ Correct! +150 pts';
      feedback.className = 'feedback correct';
      this._addScore(150);
      this.dragCorrect++;

      const t = setTimeout(() => {
        if (this.destroyed) return;
        this.dragRound++;
        zone.classList.remove('correct');
        if (this.dragRound < this.dragRounds.length) {
          this._renderDragRound(pumps);
        } else {
          // All rounds done
          const bonus = this.dragCorrect === this.dragRounds.length ? 200 : 0;
          if (bonus) this._addScore(bonus);
          feedback.textContent = `🎉 Level 1 Complete! ${bonus ? '+200 bonus!' : ''} Final: ${this.score} pts`;
          feedback.className = 'feedback correct';
          const t2 = setTimeout(() => {
            if (!this.destroyed) this.onComplete(this.score, 800);
          }, 1800);
          this._timers.push(t2);
        }
      }, 1000);
      this._timers.push(t);

    } else {
      zone.classList.add('wrong');
      feedback.textContent = '❌ Wrong pump! Try again.';
      feedback.className = 'feedback wrong';
      setTimeout(() => zone.classList.remove('wrong'), 500);
    }
  }

  // Touch drag helpers (simplified touch-to-click)
  _touchStart(e, pumpId) {
    this._touchPumpId = pumpId;
    const zone = document.getElementById('w1-main-drop');
    if (zone) {
      zone.addEventListener('touchend', this._boundTouchEnd = () => {
        this._checkDrop(this._touchPumpId, zone,
          [
            { id:'vane',   src:'assets/svg/vane-pump.svg'  },
            { id:'piston', src:'assets/svg/piston-pump.svg'},
            { id:'power',  src:'assets/svg/power-unit.svg' },
            { id:'valve',  src:'assets/svg/directional-valve.svg'},
          ]
        );
        zone.removeEventListener('touchend', this._boundTouchEnd);
      }, { once: true });
    }
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 2 — TAP ARCADE
  // ══════════════════════════════════════════════════════════
  _initTap() {
    this.tapPressure = 0;
    this.tapTarget   = 100;
    this.tapTime     = 15;     // seconds
    this.tapActive   = false;

    const btn      = document.getElementById('w1-tap-btn');
    const timerEl  = document.getElementById('w1-tap-timer');
    const barEl    = document.getElementById('w1-pressure-bar');
    const pressEl  = document.getElementById('w1-tap-pressure');
    const feedback = document.getElementById('w1-tap-feedback');

    feedback.textContent = 'Tap the pump to start!';
    feedback.className = 'feedback neutral';

    let countdown = null;

    btn.addEventListener('click', () => {
      if (this.destroyed) return;

      // Start timer on first tap
      if (!this.tapActive) {
        this.tapActive = true;
        feedback.textContent = 'Keep going!';
        countdown = setInterval(() => {
          if (this.destroyed) { clearInterval(countdown); return; }
          this.tapTime--;
          timerEl.textContent = this.tapTime;

          if (this.tapTime <= 5) timerEl.style.color = '#f44336';
          if (this.tapTime <= 0) {
            clearInterval(countdown);
            this._tapFinish();
          }
        }, 1000);
        this._timers.push(countdown);
      }

      if (!this.tapActive || this.tapTime <= 0) return;

      // Each tap +4 pressure (up to target)
      this.tapPressure = Math.min(this.tapTarget, this.tapPressure + 4);
      pressEl.textContent = this.tapPressure;
      barEl.style.width = (this.tapPressure / this.tapTarget * 100) + '%';

      // Pump animation
      btn.classList.add('pumping');
      setTimeout(() => btn.classList.remove('pumping'), 200);

      // Update fun fact dynamically
      if (this.tapPressure >= 25  && this.tapPressure < 30)  this._setFact('Keep pumping! You\'re building real hydraulic pressure! 💪');
      if (this.tapPressure >= 50  && this.tapPressure < 55)  this._setFact('Halfway there! This is how Yuken pumps build system pressure! ⚡');
      if (this.tapPressure >= 75  && this.tapPressure < 80)  this._setFact('Almost there! Real pumps can reach 350 bar of pressure! 🚀');
      if (this.tapPressure >= this.tapTarget) {
        clearInterval(countdown);
        this._timers = this._timers.filter(t => t !== countdown);
        this._tapFinish(true);
      }
    });
  }

  _tapFinish(maxed = false) {
    if (this.destroyed) return;
    const feedback = document.getElementById('w1-tap-feedback');
    const pct = this.tapPressure / this.tapTarget;

    let pts = 0;
    if (maxed)        { pts = 500; feedback.textContent = '🌟 MAX PRESSURE! Perfect! +500 pts'; }
    else if (pct >= 0.8) { pts = 400; feedback.textContent = '🎉 Great pressure! +400 pts'; }
    else if (pct >= 0.5) { pts = 250; feedback.textContent = '👍 Good effort! +250 pts'; }
    else                  { pts = 100; feedback.textContent = '💪 Keep practicing! +100 pts'; }

    feedback.className = pts >= 400 ? 'feedback correct' : 'feedback neutral';
    this._addScore(pts);

    // Disable button
    const btn = document.getElementById('w1-tap-btn');
    if (btn) btn.style.pointerEvents = 'none';

    const t = setTimeout(() => {
      if (!this.destroyed) this.onComplete(this.score, 500);
    }, 1800);
    this._timers.push(t);
  }

  _setFact(text) {
    const el = document.getElementById('w1-fun-fact');
    if (el) el.innerHTML = `💡 <strong>Fun Fact:</strong> ${text}`;
  }

  // ─── Cleanup ─────────────────────────────────────────────
  destroy() {
    this.destroyed = true;
    this._timers.forEach(t => clearTimeout(t));
    this._timers = [];
  }
}
