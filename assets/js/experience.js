import { experience } from "../../data/experience.js";

function renderTags(list = []) {
  if (!list.length) return "";
  return `<div class="tag-row exp-tags">${list
    .map(item => `<span class="tag">${item}</span>`)
    .join("")}</div>`;
}

function renderBullets(items = []) {
  if (!items.length) return "";
  return `<ul class="exp-bullets">${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function renderExperience() {
  const root = document.getElementById("experience-list");
  if (!root) return;

  root.setAttribute("role", "list");
  root.innerHTML = experience
    .map(
      item => `
      <article class="exp-row" role="listitem">
        <div class="exp-media-col">
          <div class="exp-media neu-inset inline-loader-wrap">
            <img src="./${item.image}" alt="${item.role}" loading="lazy" />
          </div>
        </div>
        <div class="exp-content-col">
          <div class="exp-header">
            <span class="period-badge">${item.period}</span>
            <h3 class="exp-role">${item.role}</h3>
            <p class="exp-company">${item.company}</p>
            <p class="exp-location">${item.location}</p>
          </div>
          ${renderBullets(item.bullets)}
          ${renderTags(item.techStack)}
        </div>
      </article>
    `
    )
    .join("");


  if (typeof window.monitorImageLoading === "function") {
    window.monitorImageLoading(root);
  }
}

renderExperience();