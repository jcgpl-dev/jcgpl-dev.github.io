import { initScrollReveal } from './reveal.js';
import { servicesData } from '../../data/services.js'; 

export async function initServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  const cardTemplates = await Promise.all(
    servicesData.map(async (service) => {
      let svgContent = '';
      try {
        const response = await fetch(`./assets/images/svg/icons/${service.icon}`);
        if (response.ok) svgContent = await response.text();
      } catch (err) {
        console.error("Failed to load icon:", service.icon);
      }

      // Map the array configurations out to scoped local styles
      const styleBlock = `
        --card-accent: ${service.accent}; 
        --card-bg: ${service.bg}; 
        --card-bg-dark: ${service.bgDark};
      `.replace(/\s+/g, ' ');

      return `
        <div class="service-card sharp-raised" style="${styleBlock}">
          <div class="service-icon-wrap">
            ${svgContent}
          </div>
          <h5 class="service-title">${service.title}</h5>
          <p class="service-description">${service.description}</p>
          <div class="tag-row service-tags">
            ${service.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </div>
      `;
    })
  );

  servicesGrid.innerHTML = cardTemplates.join('');
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', initServices);