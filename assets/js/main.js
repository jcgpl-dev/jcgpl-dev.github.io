// Core Page Boot Loader Event
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  const mainContent = document.getElementById('main-content');

  if (loader) {
    loader.classList.add('fade-out');
    if (mainContent) {
      mainContent.style.opacity = '1';
    }

    loader.addEventListener('transitionend', () => {
      loader.remove();
    }, { once: true }); 
  }
});

/**
 * Dynamic Branded Image Loader Engine
 * Monitors image elements and handles cross-fading loading states.
 * Supports any custom layouts using our utility classes.
 */
export function monitorImageLoading(container = document.body) {
  // Balanced selector matching all global portfolio sections (projects, heatmaps, experiences, etc.)
  const images = container.querySelectorAll(
    '.inline-loader-wrap img, .project-image-wrap img, .modal-media-wrap img'
  );

  images.forEach(img => {
    const parent = img.parentElement;
    if (!parent) return;

    // Clear loading state triggers if re-used during async rendering cycles
    parent.classList.remove('img-loaded');

    // Check caching status: If asset is ready in browser cache, immediately mount layout
    if (img.complete) {
      parent.classList.add('img-loaded');
    } else {
      // Otherwise, wire network interception events cleanly
      img.addEventListener('load', () => {
        parent.classList.add('img-loaded');
      }, { once: true });
      
      img.addEventListener('error', () => {
        // Fallback safety layer: ensures broken links don't trap layout with infinite spinners
        parent.classList.add('img-loaded'); 
      }, { once: true });
    }
  });
}


window.monitorImageLoading = monitorImageLoading;


monitorImageLoading();