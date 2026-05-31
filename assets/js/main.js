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
 */
export function monitorImageLoading(container = document.body) {
  // Balanced selector matching all global portfolio sections (projects, heatmaps, experiences, etc.)
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
  
      img.addEventListener('load', () => {
        parent.classList.add('img-loaded');
      }, { once: true });
      
      img.addEventListener('error', () => {
  
        parent.classList.add('img-loaded'); 
      }, { once: true });
    }
  });
}


window.monitorImageLoading = monitorImageLoading;


monitorImageLoading();