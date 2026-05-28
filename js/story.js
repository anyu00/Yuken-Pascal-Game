/**
 * story.js — Cartoon Story Scene Engine
 * Handles scene progression, character animations, speech bubbles
 */
import { SCENES, CHARACTERS } from './content.js';
import { getLang, applyLang } from './lang.js';

let currentScene = 0;
let currentLine  = 0;
let isAnimating  = false;
let onStoryComplete = null;

// Character SVG face expressions
const FACES = {
  normal:     '😊',
  scared:     '😱',
  excited:    '🤩',
  confused:   '🤔',
  triumphant: '😎',
};

// Background themes per scene bg key
const BG_THEMES = {
  city:    { color: '#0d1b4b', accent: '#ffd700', icon: '🏙️' },
  lab:     { color: '#0a2e1a', accent: '#00ff99', icon: '🔬' },
  formula: { color: '#1a0a2e', accent: '#d400ff', icon: '✨' },
  battle:  { color: '#2e0a0a', accent: '#ff4400', icon: '⚔️' },
};

export function initStory(completeCallback) {
  onStoryComplete = completeCallback;
  currentScene = 0;
  currentLine  = 0;

  document.getElementById('btn-next-line').addEventListener('click', advanceLine);
  document.getElementById('btn-skip-story').addEventListener('click', () => {
    if (onStoryComplete) onStoryComplete();
  });
  document.addEventListener('langchange', () => renderCurrentLine());

  renderScene();
}

function getScenes() {
  return SCENES[getLang()];
}

function renderScene() {
  const scenes = getScenes();
  const scene  = scenes[currentScene];
  currentLine  = 0;

  // Update progress dots
  const dotsEl = document.getElementById('story-dots');
  dotsEl.innerHTML = scenes.map((_, i) =>
    `<span class="story-dot ${i === currentScene ? 'active' : i < currentScene ? 'done' : ''}"></span>`
  ).join('');

  // Set background theme
  const theme = BG_THEMES[scene.bg] || BG_THEMES.city;
  const storyScreen = document.getElementById('screen-story');
  storyScreen.style.setProperty('--scene-color', theme.color);
  storyScreen.style.setProperty('--scene-accent', theme.accent);

  // Animate scene bg icon
  document.getElementById('scene-bg-icon').textContent = theme.icon;

  // Scene title
  const titleEl = document.getElementById('story-scene-title');
  titleEl.textContent = scene.title;
  titleEl.classList.remove('pop-in');
  void titleEl.offsetWidth;
  titleEl.classList.add('pop-in');

  renderCurrentLine();
}

function renderCurrentLine() {
  if (isAnimating) return;
  const scenes = getScenes();
  const scene  = scenes[currentScene];
  const line   = scene.lines[currentLine];
  if (!line) return;

  const char   = CHARACTERS[line.speaker];
  const isNarrator = line.speaker === 'narrator';

  // Speaker name
  const nameEl = document.getElementById('story-speaker-name');
  nameEl.textContent = isNarrator ? '' :
    (getLang() === 'ja' ? char?.nameja : char?.nameen) || line.speaker;
  nameEl.style.color = char?.color || '#ffffff';

  // Character visual
  renderCharacter(line.speaker, line.mood || 'normal');

  // Typewriter effect for speech
  typeText(document.getElementById('story-speech'), line.text, 30, () => {
    isAnimating = false;
    updateNextBtn();
  });

  isAnimating = true;
  updateNextBtn();
}

function typeText(el, text, speed, onDone) {
  el.textContent = '';
  el.classList.remove('text-pop');
  void el.offsetWidth;
  el.classList.add('text-pop');

  let i = 0;
  // Split by emoji-aware method
  const chars = [...text];
  function tick() {
    if (i < chars.length) {
      el.textContent += chars[i++];
      setTimeout(tick, speed);
    } else {
      if (onDone) onDone();
    }
  }
  tick();
}

function renderCharacter(speaker, mood) {
  const stage = document.getElementById('character-stage');
  stage.innerHTML = '';

  if (speaker === 'narrator') {
    stage.innerHTML = `<div class="narrator-visual">📜</div>`;
    return;
  }

  const char = CHARACTERS[speaker];
  const face = FACES[mood] || FACES.normal;
  const color = char?.color || '#ffffff';

  const charEl = document.createElement('div');
  charEl.className = `character-sprite char-${speaker} mood-${mood}`;
  charEl.innerHTML = buildCharacterSVG(speaker, color, face);
  stage.appendChild(charEl);

  // Entrance animation class
  charEl.classList.add('char-enter');
  setTimeout(() => charEl.classList.remove('char-enter'), 600);

  // Continuous idle animation
  charEl.classList.add(`idle-${speaker}`);
}

function buildCharacterSVG(speaker, color, face) {
  if (speaker === 'squish') {
    return `
      <div class="squish-body" style="background:${color}">
        <div class="squish-face">${face}</div>
        <div class="squish-jiggle-arm left">🫸</div>
        <div class="squish-jiggle-arm right">🫷</div>
      </div>`;
  }
  if (speaker === 'cat') {
    return `
      <div class="cat-body" style="background:${color}">
        <div class="cat-face">${face}</div>
        <div class="cat-ears">🐱</div>
      </div>`;
  }
  // Pascal (default hero)
  return `
    <div class="pascal-body">
      <div class="pascal-helmet" style="background:${color}">🪖</div>
      <div class="pascal-face">${face}</div>
      <div class="pascal-torso" style="border-color:${color}">
        <span class="pascal-badge">P</span>
      </div>
      <div class="pascal-legs">🦵🦵</div>
    </div>`;
}

function advanceLine() {
  if (isAnimating) {
    // Skip typewriter — show full text immediately
    const scenes = getScenes();
    const line = scenes[currentScene].lines[currentLine];
    document.getElementById('story-speech').textContent = line.text;
    isAnimating = false;
    updateNextBtn();
    return;
  }

  const scenes = getScenes();
  const scene  = scenes[currentScene];

  if (currentLine < scene.lines.length - 1) {
    currentLine++;
    renderCurrentLine();
  } else if (currentScene < scenes.length - 1) {
    currentScene++;
    renderScene();
  } else {
    // Story complete
    if (onStoryComplete) onStoryComplete();
  }
}

function updateNextBtn() {
  const scenes   = getScenes();
  const scene    = scenes[currentScene];
  const isLast   = currentScene === scenes.length - 1 && currentLine === scene.lines.length - 1;
  const btn      = document.getElementById('btn-next-line');
  const lang     = getLang();

  if (isAnimating) {
    btn.textContent = '⏩ Skip';
  } else if (isLast) {
    btn.textContent = lang === 'ja' ? '🔬 実験室へ！' : '🔬 To the Lab!';
    btn.classList.add('pulse-btn');
  } else {
    btn.textContent = lang === 'ja' ? '次へ →' : 'Next →';
    btn.classList.remove('pulse-btn');
  }
}
