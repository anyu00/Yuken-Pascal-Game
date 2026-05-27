/**
 * storage.js — Save/Load game progress via localStorage
 * Tracks: unlocked worlds, level scores, stars, total score, badges
 */

const STORAGE_KEY = 'pascal_adventure_save';

const DEFAULT_SAVE = {
  unlockedWorlds: [1],       // World 1 always unlocked
  worldProgress: {
    1: { completed: false, stars: 0, levelScores: [0, 0, 0] },
    2: { completed: false, stars: 0, levelScores: [0, 0, 0] },
    3: { completed: false, stars: 0, levelScores: [0, 0, 0] }
  },
  totalScore: 0,
  badges: [],
  engineerRank: null,
  lastPlayed: null
};

const Storage = {
  /** Load save data, or create fresh save if none exists */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this._deepClone(DEFAULT_SAVE);
      return JSON.parse(raw);
    } catch {
      return this._deepClone(DEFAULT_SAVE);
    }
  },

  /** Persist save data */
  save(data) {
    try {
      data.lastPlayed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage: could not save progress', e);
    }
  },

  /** Save score for a specific world + level (0-indexed level) */
  saveLevel(worldNum, levelIndex, score, maxScore) {
    const data = this.load();
    const world = data.worldProgress[worldNum];
    if (!world) return;

    // Keep best score per level
    if (score > world.levelScores[levelIndex]) {
      world.levelScores[levelIndex] = score;
    }

    // Calculate stars for the world (0–3 based on avg score %)
    const total = world.levelScores.reduce((a, b) => a + b, 0);
    const pct = total / (maxScore * 3);
    world.stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;

    // Mark world complete if all 3 levels have a score
    world.completed = world.levelScores.every(s => s > 0);

    // Unlock next world on completion
    if (world.completed && worldNum < 3) {
      if (!data.unlockedWorlds.includes(worldNum + 1)) {
        data.unlockedWorlds.push(worldNum + 1);
      }
    }

    // Update total score
    data.totalScore = Object.values(data.worldProgress)
      .flatMap(w => w.levelScores)
      .reduce((a, b) => a + b, 0);

    // Award rank if world 3 complete
    if (data.worldProgress[3].completed && !data.engineerRank) {
      data.engineerRank = this._calcRank(data.totalScore);
      this._awardBadge(data, 'Certified Yuken Engineer 🏆');
    }

    this.save(data);
    return data;
  },

  /** Get list of unlocked world numbers */
  getUnlockedWorlds() {
    return this.load().unlockedWorlds;
  },

  /** Get progress object for a specific world */
  getWorldProgress(worldNum) {
    return this.load().worldProgress[worldNum];
  },

  /** Get total score */
  getTotalScore() {
    return this.load().totalScore;
  },

  /** Get all earned badges */
  getBadges() {
    return this.load().badges;
  },

  /** Award a badge (no duplicates) */
  awardBadge(name) {
    const data = this.load();
    this._awardBadge(data, name);
    this.save(data);
  },

  /** Wipe all progress */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /** Check if game is complete (all 3 worlds done) */
  isGameComplete() {
    const data = this.load();
    return [1, 2, 3].every(w => data.worldProgress[w].completed);
  },

  // --- Private helpers ---
  _awardBadge(data, name) {
    if (!data.badges.includes(name)) {
      data.badges.push(name);
    }
  },

  _calcRank(totalScore) {
    if (totalScore >= 1350) return 'Master Engineer 🥇';
    if (totalScore >= 1000) return 'Senior Engineer 🥈';
    if (totalScore >= 600)  return 'Engineer 🥉';
    return 'Junior Engineer 🔧';
  },

  _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

export default Storage;
