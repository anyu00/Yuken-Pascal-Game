/**
 * world3.js — Cylinder Fortress
 * Level 1: Math puzzle  (P = F ÷ A)
 * Level 2: Circuit builder (drag components into correct order)
 * Level 3: Boss battle   (quiz-style, each correct answer damages boss)
 */

export class World3 {
  constructor(levelNum, onComplete) {
    this.levelNum   = levelNum;
    this.onComplete = onComplete;
    this.score      = 0;
    this.destroyed  = false;
    this._timers    = [];

    this._updateHUD();
    if (levelNum === 1) this._initMath();
    if (levelNum === 2) this._initCircuit();
    if (levelNum === 3) this._initBoss();
  }

  // ─── HUD ────────────────────────────────────────────────
  _updateHUD() {
    const titles = {
      1: 'Level 1 · Pascal\'s Formula',
      2: 'Level 2 · Build a Circuit',
      3: 'Level 3 · Boss Battle ⚔️'
    };
    document.getElementById('w3-level-title').textContent = titles[this.levelNum] || '';
    document.getElementById('w3-score').textContent = this.score;
    document.getElementById('w3-math-area').style.display    = this.levelNum === 1 ? 'block' : 'none';
    document.getElementById('w3-circuit-area').style.display = this.levelNum === 2 ? 'block' : 'none';
    document.getElementById('w3-boss-area').style.display    = this.levelNum === 3 ? 'block' : 'none';
  }

  _addScore(pts) {
    this.score += pts;
    document.getElementById('w3-score').textContent = this.score;
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 1 — MATH PUZZLE  P = F ÷ A
  // ══════════════════════════════════════════════════════════
  _initMath() {
    this.mathRound    = 0;
    this.mathProblems = this._buildMathProblems();
    this._renderMathRound();

    document.getElementById('w3-math-check-btn').onclick = () => this._checkMath();
  }

  _buildMathProblems() {
    // Six problems: mix of solve-for-P, solve-for-F, solve-for-A
    return [
      {
        question: 'A force of <strong>200 N</strong> is applied to a piston with area <strong>10 cm²</strong>.<br>What is the pressure? <em>(P = F ÷ A)</em>',
        inputs: [
          { label: 'F (Force, N)',  id: 'inp_F', value: '200',  editable: false },
          { label: 'A (Area, cm²)', id: 'inp_A', value: '10',   editable: false },
          { label: 'P (Pressure) = ?', id: 'inp_P', value: '',  editable: true  },
        ],
        answer: { id: 'inp_P', val: 20 },
        hint: 'P = 200 ÷ 10 = 20 Pa'
      },
      {
        question: 'Pressure is <strong>50 Pa</strong> and area is <strong>5 cm²</strong>.<br>What is the Force? <em>(F = P × A)</em>',
        inputs: [
          { label: 'P (Pressure, Pa)', id: 'inp_P', value: '50', editable: false },
          { label: 'A (Area, cm²)',    id: 'inp_A', value: '5',  editable: false },
          { label: 'F (Force) = ?',    id: 'inp_F', value: '',   editable: true  },
        ],
        answer: { id: 'inp_F', val: 250 },
        hint: 'F = P × A = 50 × 5 = 250 N'
      },
      {
        question: 'Force = <strong>300 N</strong>, Pressure = <strong>30 Pa</strong>.<br>What is the Area? <em>(A = F ÷ P)</em>',
        inputs: [
          { label: 'F (Force, N)',     id: 'inp_F', value: '300', editable: false },
          { label: 'P (Pressure, Pa)', id: 'inp_P', value: '30',  editable: false },
          { label: 'A (Area) = ?',     id: 'inp_A', value: '',    editable: true  },
        ],
        answer: { id: 'inp_A', val: 10 },
        hint: 'A = F ÷ P = 300 ÷ 30 = 10 cm²'
      },
      {
        question: 'A hydraulic lift uses a piston of area <strong>25 cm²</strong>.<br>You push with <strong>500 N</strong>. What pressure is transmitted?',
        inputs: [
          { label: 'F (Force, N)',  id: 'inp_F', value: '500', editable: false },
          { label: 'A (Area, cm²)', id: 'inp_A', value: '25',  editable: false },
          { label: 'P = ?',         id: 'inp_P', value: '',    editable: true  },
        ],
        answer: { id: 'inp_P', val: 20 },
        hint: 'P = 500 ÷ 25 = 20 Pa. Same pressure acts on BOTH pistons!'
      },
      {
        question: 'The large piston has area <strong>100 cm²</strong> and pressure = <strong>20 Pa</strong>.<br>What force does it output? (Hydraulic multiplication!)',
        inputs: [
          { label: 'P (Pressure, Pa)', id: 'inp_P', value: '20',  editable: false },
          { label: 'A (Area, cm²)',    id: 'inp_A', value: '100', editable: false },
          { label: 'F (Output Force) = ?', id: 'inp_F', value: '', editable: true },
        ],
        answer: { id: 'inp_F', val: 2000 },
        hint: 'F = P × A = 20 × 100 = 2000 N! 4× the input force!'
      },
    ];
  }

  _renderMathRound() {
    if (this.mathRound >= this.mathProblems.length) {
      this._setFact('🎉 All math problems solved! You\'re a hydraulics genius!');
      const t = setTimeout(() => { if (!this.destroyed) this.onComplete(this.score, 600); }, 1500);
      this._timers.push(t);
      return;
    }

    const prob = this.mathProblems[this.mathRound];
    document.getElementById('w3-math-question').innerHTML =
      `Problem ${this.mathRound + 1} of ${this.mathProblems.length}:<br>${prob.question}`;

    const inputsEl = document.getElementById('w3-formula-inputs');
    inputsEl.innerHTML = '';
    prob.inputs.forEach(inp => {
      const grp = document.createElement('div');
      grp.className = 'formula-input-group';
      grp.innerHTML = `
        <label>${inp.label}</label>
        <input type="number" id="${inp.id}" value="${inp.value}"
          ${inp.editable ? '' : 'readonly style="opacity:0.6;cursor:not-allowed;"'}
          placeholder="${inp.editable ? '?' : ''}" />
      `;
      inputsEl.appendChild(grp);
    });

    document.getElementById('w3-math-feedback').textContent = '';
    document.getElementById('w3-math-feedback').className = 'feedback neutral';
  }

  _checkMath() {
    if (this.destroyed) return;
    const prob = this.mathProblems[this.mathRound];
    const input = document.getElementById(prob.answer.id);
    const feedback = document.getElementById('w3-math-feedback');

    if (!input) return;
    const val = parseFloat(input.value);

    if (isNaN(val)) {
      feedback.textContent = '⚠️ Please enter a number!';
      feedback.className = 'feedback wrong';
      return;
    }

    if (Math.abs(val - prob.answer.val) < 0.01) {
      const pts = this.mathRound === 0 ? 150 : 100;
      this._addScore(pts);
      feedback.textContent = `✅ Correct! ${prob.hint} +${pts} pts`;
      feedback.className = 'feedback correct';
      this.mathRound++;

      const t = setTimeout(() => {
        if (!this.destroyed) this._renderMathRound();
      }, 1600);
      this._timers.push(t);
    } else {
      feedback.textContent = `❌ Not quite. Hint: ${prob.hint}`;
      feedback.className = 'feedback wrong';
      input.style.borderColor = 'var(--color-danger)';
      setTimeout(() => { if (input) input.style.borderColor = ''; }, 800);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 2 — CIRCUIT BUILDER
  //  Drag 4 components into the correct order:
  //  Tank → Pump → Valve → Cylinder
  // ══════════════════════════════════════════════════════════
  _initCircuit() {
    this.circuitAttempts = 0;

    const COMPONENTS = [
      { id: 'pump',     label: 'Pump',     src: 'assets/svg/piston-pump.svg' },
      { id: 'valve',    label: 'Valve',    src: 'assets/svg/directional-valve.svg' },
      { id: 'cylinder', label: 'Cylinder', src: 'assets/svg/hydraulic-cylinder.svg' },
      { id: 'tank',     label: 'Tank',     src: 'assets/svg/power-unit.svg' },
    ];
    this.correctOrder = ['tank', 'pump', 'valve', 'cylinder'];
    this.circuitSlots = [null, null, null, null];
    this._components  = COMPONENTS;

    this._renderCircuit();

    document.getElementById('w3-circuit-check-btn').onclick  = () => this._checkCircuit();
    document.getElementById('w3-circuit-reset-btn').onclick  = () => {
      this.circuitSlots = [null, null, null, null];
      this._renderCircuit();
    };
  }

  _renderCircuit() {
    const palette  = document.getElementById('w3-palette');
    const slots    = document.getElementById('w3-drop-slots');
    const feedback = document.getElementById('w3-circuit-feedback');

    // Show order hint after 2 attempts
    const hintEl = document.getElementById('w3-order-hint');
    hintEl.textContent = this.circuitAttempts >= 2
      ? 'Tank → Pump → Valve → Cylinder'
      : '???  (figure it out!)';

    feedback.textContent = '';
    feedback.className = 'feedback neutral';

    // Palette — only unplaced components
    const placed = new Set(this.circuitSlots.filter(Boolean));
    palette.innerHTML = '';
    this._components.forEach(comp => {
      if (placed.has(comp.id)) return;
      const el = document.createElement('div');
      el.className  = 'component-item';
      el.draggable  = true;
      el.dataset.id = comp.id;
      el.innerHTML  = `
        <img src="${comp.src}" alt="${comp.label}" />
        <span>${comp.label}</span>
      `;
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('compId', comp.id);
        el.style.opacity = '0.4';
      });
      el.addEventListener('dragend', () => el.style.opacity = '1');
      // Touch
      el.addEventListener('touchstart', () => { this._touchComp = comp.id; }, { passive: true });
      palette.appendChild(el);
    });

    // 4 drop slots
    slots.innerHTML = '';
    this.circuitSlots.forEach((slotComp, i) => {
      const slot = document.createElement('div');
      slot.style.cssText = `
        min-width:90px; min-height:90px; border:2px dashed rgba(244,67,54,0.5);
        border-radius:10px; display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:4px;
        background:rgba(244,67,54,0.04); cursor:pointer; padding:6px;
        transition:border-color 0.2s, background 0.2s;
        font-size:0.75rem; color:var(--color-muted);
      `;
      slot.dataset.slot = i;

      if (slotComp) {
        const comp = this._components.find(c => c.id === slotComp);
        slot.innerHTML = `
          <img src="${comp.src}" style="width:64px;height:44px;object-fit:contain;" />
          <span style="color:var(--color-text);">${comp.label}</span>
          <span style="font-size:0.65rem;color:var(--color-danger);cursor:pointer;" data-remove="${i}">✕ remove</span>
        `;
        slot.style.borderColor = 'rgba(244,67,54,0.8)';
        slot.style.background  = 'rgba(244,67,54,0.1)';
        slot.querySelector('[data-remove]').addEventListener('click', (e) => {
          e.stopPropagation();
          this.circuitSlots[i] = null;
          this._renderCircuit();
        });
      } else {
        slot.textContent = `Slot ${i + 1}`;
      }

      slot.addEventListener('dragover',  e => { e.preventDefault(); slot.style.borderColor = 'var(--w3-primary)'; });
      slot.addEventListener('dragleave', () => { slot.style.borderColor = ''; });
      slot.addEventListener('drop',      e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('compId');
        this._placeComponent(id, i);
      });
      slot.addEventListener('touchend', () => {
        if (this._touchComp) { this._placeComponent(this._touchComp, i); this._touchComp = null; }
      });

      // Arrow between slots
      if (i < 3) {
        const arrow = document.createElement('div');
        arrow.style.cssText = 'font-size:1.8rem;color:var(--w3-primary);flex-shrink:0;';
        arrow.textContent = '→';
        slots.appendChild(slot);
        slots.appendChild(arrow);
      } else {
        slots.appendChild(slot);
      }
    });
  }

  _placeComponent(compId, slotIdx) {
    // Remove from other slots if already placed
    this.circuitSlots = this.circuitSlots.map(s => s === compId ? null : s);
    this.circuitSlots[slotIdx] = compId;
    this._renderCircuit();
  }

  _checkCircuit() {
    if (this.destroyed) return;
    this.circuitAttempts++;
    const feedback = document.getElementById('w3-circuit-feedback');

    const isComplete = this.circuitSlots.every(s => s !== null);
    if (!isComplete) {
      feedback.textContent = '⚠️ Fill all 4 slots first!';
      feedback.className = 'feedback wrong';
      return;
    }

    const correct = this.circuitSlots.every((s, i) => s === this.correctOrder[i]);
    if (correct) {
      const pts = Math.max(100, 400 - (this.circuitAttempts - 1) * 60);
      this._addScore(pts);
      feedback.textContent = `✅ Perfect circuit! Tank→Pump→Valve→Cylinder +${pts} pts`;
      feedback.className = 'feedback correct';
      this._animateCircuit();
      const t = setTimeout(() => { if (!this.destroyed) this.onComplete(this.score, 400); }, 2200);
      this._timers.push(t);
    } else {
      feedback.textContent = `❌ Wrong order! Think about how fluid must flow. (Attempt ${this.circuitAttempts})`;
      feedback.className = 'feedback wrong';
    }
  }

  _animateCircuit() {
    document.querySelectorAll('#w3-drop-slots > div').forEach((slot, i) => {
      setTimeout(() => {
        slot.style.borderColor = 'var(--color-success)';
        slot.style.boxShadow   = '0 0 12px rgba(76,175,80,0.5)';
      }, i * 200);
    });
  }

  // ══════════════════════════════════════════════════════════
  //  LEVEL 3 — BOSS BATTLE
  //  Answer questions correctly to drain the boss HP.
  //  Wrong answers restore some HP.
  // ══════════════════════════════════════════════════════════
  _initBoss() {
    this.bossHP      = 100;
    this.bossMaxHP   = 100;
    this.bossRound   = 0;
    this.bossDefeated = false;

    this.bossQuestions = [
      {
        q: 'Pascal\'s Law says pressure in a fluid is transmitted...',
        opts: ['Only downward', 'Equally in all directions', 'Only to the right', 'It disappears'],
        ans: 1, dmg: 20,
        fact: 'Pascal (1647): confined fluid pressure spreads EQUALLY in ALL directions!'
      },
      {
        q: 'What unit is pressure measured in?',
        opts: ['Newtons (N)', 'Metres (m)', 'Pascals (Pa)', 'Kilograms (kg)'],
        ans: 2, dmg: 20,
        fact: 'Pressure is measured in Pascals (Pa), named after Blaise Pascal himself!'
      },
      {
        q: 'In a hydraulic system, what happens to force when fluid moves from a SMALL piston to a LARGE piston?',
        opts: ['Force decreases', 'Force stays the same', 'Force increases', 'Force vanishes'],
        ans: 2, dmg: 25,
        fact: 'Larger area = larger output force at same pressure. This is hydraulic force multiplication!'
      },
      {
        q: 'Which Yuken product converts hydraulic pressure into LINEAR motion?',
        opts: ['Vane Pump', 'Directional Valve', 'Hydraulic Cylinder', 'Pressure Gauge'],
        ans: 2, dmg: 20,
        fact: 'Yuken hydraulic cylinders convert fluid pressure into powerful pushing or pulling motion!'
      },
      {
        q: 'Complete: P = F ÷ ?',
        opts: ['Volume', 'Area', 'Speed', 'Time'],
        ans: 1, dmg: 15,
        fact: 'P = F ÷ A. Force ÷ Area = Pressure. This is the most important formula in hydraulics!'
      },
    ];

    this._renderBossQuestion();
  }

  _renderBossQuestion() {
    if (this.destroyed) return;
    const feedback = document.getElementById('boss-feedback');

    if (this.bossRound >= this.bossQuestions.length || this.bossHP <= 0) {
      this._bossDefeated();
      return;
    }

    const q = this.bossQuestions[this.bossRound];
    document.getElementById('boss-question').textContent = q.q;

    const optsEl = document.getElementById('boss-options');
    optsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.style.textAlign = 'left';
      btn.addEventListener('click', () => this._bossAnswer(i, q, btn, optsEl));
      optsEl.appendChild(btn);
    });

    feedback.textContent = '';
    feedback.className = 'feedback neutral';
  }

  _bossAnswer(selected, q, btn, optsEl) {
    if (this.destroyed || this.bossDefeated) return;
    const feedback = document.getElementById('boss-feedback');
    const allBtns  = optsEl.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selected === q.ans) {
      btn.classList.add('correct');
      this.bossHP = Math.max(0, this.bossHP - q.dmg);
      this._addScore(100);
      feedback.textContent = `💥 Hit! -${q.dmg} HP  |  💡 ${q.fact}`;
      feedback.className = 'feedback correct';
      this._updateBossHP();

      // Shake boss
      const bossImg = document.getElementById('boss-img');
      if (bossImg) {
        bossImg.style.animation = 'none';
        bossImg.style.filter    = 'drop-shadow(0 0 30px #f44336) brightness(2)';
        setTimeout(() => {
          bossImg.style.filter    = 'drop-shadow(0 0 20px rgba(244,67,54,0.7))';
          bossImg.style.animation = 'bossFloat 2s ease-in-out infinite';
        }, 400);
      }
    } else {
      allBtns[q.ans].classList.add('correct');
      btn.classList.add('wrong');
      const restore = Math.floor(q.dmg * 0.3);
      this.bossHP = Math.min(this.bossMaxHP, this.bossHP + restore);
      feedback.textContent = `❌ Miss! Boss restored +${restore} HP. ${q.fact}`;
      feedback.className = 'feedback wrong';
      this._updateBossHP();
    }

    if (this.bossHP <= 0) {
      const t = setTimeout(() => { if (!this.destroyed) this._bossDefeated(); }, 1000);
      this._timers.push(t);
    } else {
      this.bossRound++;
      const t = setTimeout(() => { if (!this.destroyed) this._renderBossQuestion(); }, 2000);
      this._timers.push(t);
    }
  }

  _updateBossHP() {
    const bar     = document.getElementById('boss-hp-bar');
    const hpText  = document.getElementById('boss-hp-text');
    const pct     = (this.bossHP / this.bossMaxHP) * 100;
    if (bar)    bar.style.width = pct + '%';
    if (hpText) hpText.textContent = this.bossHP;
    // Change bar colour as HP drops
    if (bar) {
      if (pct <= 25)      bar.style.background = 'linear-gradient(90deg,#9c27b0,#e040fb)';
      else if (pct <= 50) bar.style.background = 'linear-gradient(90deg,#ff9800,#f44336)';
      else                bar.style.background = 'linear-gradient(90deg,#f44336,#ff5722)';
    }
  }

  _bossDefeated() {
    if (this.destroyed) return;
    this.bossDefeated = true;
    this.bossHP = 0;
    this._updateBossHP();

    const feedback = document.getElementById('boss-feedback');
    feedback.textContent = '🎉 THE BLOCKAGE IS DEFEATED! Yukentopia is saved!';
    feedback.className = 'feedback correct';

    // Fade out boss
    const bossImg = document.getElementById('boss-img');
    if (bossImg) {
      bossImg.style.transition = 'opacity 1s ease, transform 1s ease';
      bossImg.style.opacity    = '0';
      bossImg.style.transform  = 'scale(0) rotate(180deg)';
    }

    this._addScore(200); // victory bonus
    this._setFact('🏆 You defeated The Blockage using Pascal\'s Law! Yukentopia is saved!');

    const t = setTimeout(() => {
      if (!this.destroyed) this.onComplete(this.score, 700);
    }, 2500);
    this._timers.push(t);
  }

  _setFact(text) {
    const el = document.getElementById('w3-fun-fact');
    if (el) el.innerHTML = `💡 <strong>Fun Fact:</strong> ${text}`;
  }

  // ─── Cleanup ────────────────────────────────────────────
  destroy() {
    this.destroyed = true;
    this._timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    this._timers = [];
  }
}
