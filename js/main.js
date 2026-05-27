/**
 * main.js — Game Router, State Manager, World Map
 * Entry point for Pascal's Law Adventure
 */

import Storage from './storage.js';
import { World1 } from './world1.js';
import { World2 } from './world2.js';
import { World3 } from './world3.js';
import { QuizEngine } from './quiz.js';

// ─── Game State ────────────────────────────────────────────────
const State = {
  currentScreen: 'menu',
  currentWorld: null,
  currentLevel: null,     // 1=puzzle, 2=arcade, 3=boss(w3)
  levelScores: { 1: [0,0,0], 2: [0,0,0], 3: [0,0,0] },
  activeWorld: null,      // world instance
  activeQuiz: null,
};

// ─── Screen Router ─────────────────────────────────────────────
export function navigateTo(screenId, data = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    State.currentScreen = screenId;
  }
  if (typeof data.worldNum !== 'undefined') State.currentWorld = data.worldNum;
  if (typeof data.levelNum !== 'undefined') State.currentLevel = data.levelNum;
}

// ─── MENU ──────────────────────────────────────────────────────
function initMenu() {
  buildStarfield();
  refreshWorldMap();

  // World card clicks
  document.querySelectorAll('.world-card').forEach(card => {
    card.addEventListener('click', () => {
      const w = parseInt(card.dataset.world);
      if (card.classList.contains('locked')) {
        card.classList.add('shake-anim');
        setTimeout(() => card.classList.remove('shake-anim'), 500);
        return;
      }
      State.currentWorld = w;
      if (w === 1) showStory(w);
      else showLevelSelect(w);
    });
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      Storage.reset();
      refreshWorldMap();
    }
  });
}

function refreshWorldMap() {
  const unlocked = Storage.getUnlockedWorlds();
  const data = Storage.load();

  [1, 2, 3].forEach(w => {
    const card = document.getElementById('card-world-' + w);
    const starsEl = document.getElementById('stars-world-' + w);
    if (!card) return;

    if (unlocked.includes(w)) {
      card.classList.remove('locked');
      card.classList.add('unlocked');
      // Hide lock wrap, show product image
      const lockWrap = card.querySelector('.world-lock-wrap') || card.querySelector('.lock-icon');
      if (lockWrap) lockWrap.style.display = 'none';
      const img = card.querySelector('.world-img');
      if (img) img.style.display = 'block';
    }

    const stars = data.worldProgress[w].stars;
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    starsEl.style.color = stars > 0 ? '#ffd700' : 'var(--color-muted)';
  });

  document.getElementById('menu-total-score').textContent = Storage.getTotalScore().toLocaleString();
  document.getElementById('menu-badge-count').textContent = Storage.getBadges().length;
}

// ─── STORY ─────────────────────────────────────────────────────
const STORY_TEXT = {
  1: {
    title: "World 1 — The Pump Village",
    text: `The village water tower has lost all pressure! The pumps have stopped working and the villagers are thirsty.\n\nPascal, you must learn how pumps create flow and restore pressure to the village!\n\nYour tools: Yuken Vane Pumps 💚`,
    img: 'assets/svg/vane-pump.svg'
  },
  2: {
    title: "World 2 — The Valve Factory",
    text: `The factory machines are moving the wrong way! The Blockage has scrambled all the directional valves.\n\nPascal, you must rotate and reconnect the valves to direct the pressure where it belongs!\n\nYour tools: Yuken Directional Valves 🟡`,
    img: 'assets/svg/directional-valve.svg'
  },
  3: {
    title: "World 3 — The Cylinder Fortress",
    text: `The Blockage is hiding in the fortress! Only by mastering Pascal's formula and building a complete hydraulic circuit can you defeat it!\n\nUse P = F ÷ A and the power of Yuken cylinders to win!\n\nFinal battle awaits! 🔴`,
    img: 'assets/svg/hydraulic-cylinder.svg'
  }
};

function showStory(worldNum) {
  const s = STORY_TEXT[worldNum] || STORY_TEXT[1];
  document.getElementById('story-title').textContent = s.title;
  document.getElementById('story-text').innerHTML = s.text.replace(/\n/g, '<br>');
  document.getElementById('story-img').src = s.img;
  navigateTo('story', { worldNum });
}

document.getElementById('story-btn').addEventListener('click', () => {
  showLevelSelect(State.currentWorld);
});

// ─── LEVEL SELECT ───────────────────────────────────────────────
const LEVEL_DATA = {
  1: [
    { icon: '🧩', name: 'Drag the Pump',     desc: 'Match each pump to the right pipe slot' },
    { icon: '⚡', name: 'Build Pressure!',   desc: 'Tap as fast as you can before time runs out' },
    { icon: '🧠', name: 'Pascal Quiz',       desc: 'Test your knowledge of pressure & pumps' },
  ],
  2: [
    { icon: '🔧', name: 'Rotate the Valves', desc: 'Connect the pipes by rotating pipe pieces' },
    { icon: '⚡', name: 'Switch Sequence',   desc: 'Hit valves in the right order under time pressure' },
    { icon: '🧠', name: 'Pascal Quiz',       desc: 'Test your knowledge of valves & Pascal\'s Law' },
  ],
  3: [
    { icon: '🧮', name: 'P = F ÷ A',         desc: 'Solve hydraulic pressure calculations' },
    { icon: '🔌', name: 'Build a Circuit',   desc: 'Arrange components in the correct order' },
    { icon: '⚔️', name: 'Boss Battle',       desc: 'Defeat The Blockage with pressure power!' },
  ]
};

function showLevelSelect(worldNum) {
  const levels = LEVEL_DATA[worldNum];
  const progress = Storage.getWorldProgress(worldNum);
  const cards = document.getElementById('level-cards');
  const worldNames = { 1: '🟢 Pump Village', 2: '🟡 Valve Factory', 3: '🔴 Cylinder Fortress' };

  document.getElementById('level-select-world-title').textContent = `World ${worldNum} — ${worldNames[worldNum].replace(/[🟢🟡🔴]\s/,'')}`;
  document.getElementById('level-select-heading').textContent = `World ${worldNum}: Choose a Level`;
  const stars = progress.stars;
  document.getElementById('level-select-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);

  cards.innerHTML = '';
  levels.forEach((lv, i) => {
    const lvNum = i + 1;
    const sc = progress.levelScores[i];
    const div = document.createElement('div');
    div.className = 'level-card';
    div.innerHTML = `
      <div class="level-icon">${lv.icon}</div>
      <div class="level-name">Level ${lvNum}: ${lv.name}</div>
      <div class="level-desc">${lv.desc}</div>
      <div class="level-stars">${sc > 0 ? '✅' : '○'} ${sc > 0 ? sc + ' pts' : 'Not played'}</div>
    `;
    div.addEventListener('click', () => startLevel(worldNum, lvNum));
    cards.appendChild(div);
  });

  document.getElementById('level-back-btn').onclick = () => navigateTo('menu');
  navigateTo('level-select', { worldNum });
}

// ─── START LEVEL ───────────────────────────────────────────────
function startLevel(worldNum, levelNum) {
  State.currentWorld = worldNum;
  State.currentLevel = levelNum;

  // Level 3 of any world = Quiz
  if (levelNum === 3) {
    startQuiz(worldNum);
    return;
  }

  // Otherwise load world screen
  const screenId = 'world' + worldNum;
  navigateTo(screenId, { worldNum, levelNum });

  if (worldNum === 1) {
    State.activeWorld = new World1(levelNum, onLevelComplete);
  } else if (worldNum === 2) {
    State.activeWorld = new World2(levelNum, onLevelComplete);
  } else if (worldNum === 3) {
    State.activeWorld = new World3(levelNum, onLevelComplete);
  }
}

// ─── QUIZ ──────────────────────────────────────────────────────
function startQuiz(worldNum) {
  navigateTo('quiz', { worldNum });
  State.activeQuiz = new QuizEngine({
    worldNum,
    onComplete: (score, maxScore) => {
      onLevelComplete(score, maxScore);
    }
  });
  State.activeQuiz.start();
}

// ─── LEVEL COMPLETE CALLBACK ───────────────────────────────────
function onLevelComplete(score, maxScore) {
  const w = State.currentWorld;
  const l = State.currentLevel;

  // Save to storage
  const updated = Storage.saveLevel(w, l - 1, score, maxScore);

  // Check for new badge
  let badge = null;
  if (l === 3 && updated.worldProgress[w].stars === 3) {
    badge = `World ${w} Master ⭐⭐⭐`;
    Storage.awardBadge(badge);
  }

  // Show results screen
  showResults(score, maxScore, w, l, badge);
}

// ─── RESULTS SCREEN ────────────────────────────────────────────
function showResults(score, maxScore, worldNum, levelNum, badge) {
  const pct = score / maxScore;
  const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;
  const worldNames = { 1: 'Pump Village', 2: 'Valve Factory', 3: 'Cylinder Fortress' };
  const levelNames = LEVEL_DATA[worldNum][levelNum - 1];

  document.getElementById('results-title').textContent =
    stars === 3 ? '🌟 Perfect!' : stars === 2 ? '🎉 Great Job!' : stars === 1 ? '👍 Level Complete!' : '💪 Keep Trying!';
  document.getElementById('results-world-label').textContent =
    `World ${worldNum} · Level ${levelNum}: ${levelNames.name}`;
  document.getElementById('results-score').textContent = score.toLocaleString();
  document.getElementById('results-max').textContent = `out of ${maxScore.toLocaleString()} pts`;

  // Animate stars
  ['star1','star2','star3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('earned');
    if (i < stars) {
      setTimeout(() => el.classList.add('earned'), i * 220);
    }
  });

  // Badge
  const badgeEl = document.getElementById('results-badge');
  if (badge) {
    badgeEl.textContent = '🏅 New Badge: ' + badge;
    badgeEl.classList.add('show');
  } else {
    badgeEl.classList.remove('show');
  }

  // Fire confetti if 3 stars
  if (stars === 3) spawnConfetti();

  // Next level button
  const nextBtn = document.getElementById('results-next-btn');
  const hasNext = levelNum < 3;
  const nextWorld = worldNum + 1;
  const worldUnlocked = Storage.getUnlockedWorlds().includes(nextWorld);

  if (levelNum === 3 && Storage.isGameComplete()) {
    nextBtn.textContent = '🏆 See Certificate!';
    nextBtn.onclick = showCertificate;
  } else if (hasNext) {
    nextBtn.textContent = `Level ${levelNum + 1} ➡`;
    nextBtn.onclick = () => startLevel(worldNum, levelNum + 1);
  } else if (worldUnlocked) {
    nextBtn.textContent = `World ${nextWorld} ➡`;
    nextBtn.onclick = () => showStory(nextWorld);
  } else {
    nextBtn.textContent = '🗺 World Map';
    nextBtn.onclick = () => { refreshWorldMap(); navigateTo('menu'); };
  }

  document.getElementById('results-map-btn').onclick = () => {
    refreshWorldMap();
    navigateTo('menu');
  };

  navigateTo('results');
}

// ─── CERTIFICATE ────────────────────────────────────────────────
function showCertificate() {
  const data = Storage.load();
  document.getElementById('cert-rank').textContent = data.engineerRank || 'Yuken Engineer 🔧';
  document.getElementById('cert-score').textContent = data.totalScore.toLocaleString();
  spawnConfetti();
  navigateTo('certificate');

  document.getElementById('cert-play-again-btn').onclick = () => {
    Storage.reset();
    refreshWorldMap();
    navigateTo('menu');
  };
  document.getElementById('cert-map-btn').onclick = () => {
    refreshWorldMap();
    navigateTo('menu');
  };
}

// ─── HUD BACK BUTTONS ───────────────────────────────────────────
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dest = btn.dataset.back;
    if (dest === 'level-select') {
      if (State.activeWorld) { State.activeWorld.destroy?.(); State.activeWorld = null; }
      showLevelSelect(State.currentWorld);
    } else {
      navigateTo(dest);
    }
  });
});

// ─── STARFIELD ─────────────────────────────────────────────────
function buildStarfield() {
  const container = document.getElementById('menu-stars');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'menu-star';
    star.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --d:${2 + Math.random()*4}s;
      --delay:${Math.random()*5}s;
      width:${1+Math.random()*3}px;
      height:${1+Math.random()*3}px;
    `;
    container.appendChild(star);
  }
}

// ─── CONFETTI ──────────────────────────────────────────────────
function spawnConfetti() {
  const colors = ['#ffd700','#00d4ff','#f44336','#4caf50','#ff9800','#e040fb'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random()*100}vw;
      top:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-delay:${Math.random()*1.5}s;
      animation-duration:${2+Math.random()*1.5}s;
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// ─── SHAKE ANIMATION HELPER ────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `.shake-anim { animation: shake 0.4s ease !important; }`;
document.head.appendChild(styleEl);

// ─── INIT ──────────────────────────────────────────────────────
initMenu();
