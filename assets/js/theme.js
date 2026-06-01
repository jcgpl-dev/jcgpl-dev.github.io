
import {
  playForward,
  playBackward,
  setDarkFrame,
  setLightFrame,
} from './avatar.js';
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const heatmapImg = document.getElementById('github-heatmap-img');

// Helper function to update the heatmap source color
function updateHeatmap() {
  if (!heatmapImg) return;
  
  if (body.classList.contains('dark-mode')) {
    heatmapImg.src = heatmapImg.getAttribute('data-dark');
  } else {
    heatmapImg.src = heatmapImg.getAttribute('data-light');
  }
}

// 1. Check local storage or system preference on initial load
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  body.classList.add('dark-mode');
  setDarkFrame();
} else {
  setLightFrame();
}


updateHeatmap();

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');

    if (isDark) {
      localStorage.setItem('theme', 'dark');
      playForward();
    } else {
      localStorage.setItem('theme', 'light');
      playBackward();
    }

    updateHeatmap();
  });
}