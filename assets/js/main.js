
import { initLoader, notifyModulesLoaded, notifyAssetsLoaded } from './loader.js';

// 1. Kick off the visual terminal structure immediately
initLoader();

// 2. Triggered when HTML is fully parsed and DOM elements are ready
document.addEventListener('DOMContentLoaded', () => {
  notifyModulesLoaded();
  monitorImageLoading();
});

// 3. Triggered when all global media, images, and embedded assets finish downloading
window.addEventListener('load', () => {
  notifyAssetsLoaded();
});

//  Security Controls & Restrictive Shortcuts 
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'F12') {
    event.preventDefault();
    return false;
  }
  if (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    (event.key === 'I' || event.key === 'i' ||
      event.key === 'J' || event.key === 'j' ||
      event.key === 'C' || event.key === 'c')
  ) {
    event.preventDefault();
    return false;
  }
  if ((event.ctrlKey || event.metaKey) && (event.key === 'U' || event.key === 'u')) {
    event.preventDefault();
  }
});

//  Image Tracker Framework 
export function monitorImageLoading(container = document.body) {
  const images = container.querySelectorAll(
    '.inline-loader-wrap img, .project-image-wrap img, .modal-media-wrap img'
  );

  images.forEach(img => {
    const parent = img.parentElement;
    if (!parent) return;

    parent.classList.remove('img-loaded');
    if (img.complete) {
      parent.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => parent.classList.add('img-loaded'), { once: true });
      img.addEventListener('error', () => parent.classList.add('img-loaded'), { once: true });
    }
  });
}
window.monitorImageLoading = monitorImageLoading;