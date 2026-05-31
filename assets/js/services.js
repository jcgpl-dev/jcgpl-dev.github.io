
import { initScrollReveal } from './reveal.js';
import { servicesData } from '../../data/services.js'; 

export function initServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

servicesGrid.innerHTML = servicesData.map((service) => `
    <div class="service-card sharp-raised">
      <div class="service-icon-wrap">
        <img 
          src="./assets/images/svg/icons/${service.icon}" 
          alt="${service.title} Icon" 
          class="service-icon"
          loading="lazy"
        />
      </div>
      <h5 class="service-title">${service.title}</h5>
      <p class="service-description">${service.description}</p>
      <div class="tag-row service-tags">
        ${service.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initServices);