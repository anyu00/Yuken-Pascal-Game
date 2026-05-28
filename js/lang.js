/**
 * lang.js — Language Toggle (EN ↔ JA)
 * Reads data-key attributes and swaps text from content.js
 */
import { UI, BRAND } from './content.js';

let currentLang = localStorage.getItem('pascal_lang') || 'en';

export function getLang() { return currentLang; }

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pascal_lang', lang);
  applyLang();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function applyLang() {
  const strings = UI[currentLang];
  // Update all elements with data-key attributes
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (strings[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = strings[key];
      } else {
        el.textContent = strings[key];
      }
    }
  });
  // Update lang toggle button
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = strings.langBtn;
  // Update html lang attribute
  document.documentElement.lang = currentLang;
  // Update brand tagline
  const taglineEl = document.getElementById('brand-tagline');
  if (taglineEl) taglineEl.textContent = BRAND.tagline[currentLang];
}

export function toggleLang() {
  setLang(currentLang === 'en' ? 'ja' : 'en');
}

// Init on first load
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('lang-btn');
  if (btn) btn.addEventListener('click', toggleLang);
  applyLang();
});
