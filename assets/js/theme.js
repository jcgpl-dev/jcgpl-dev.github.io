// assets/js/theme.js

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
}


updateHeatmap();

// 2. Toggle theme on button click
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    
    // Swap the heatmap color style
    updateHeatmap();
  });
}