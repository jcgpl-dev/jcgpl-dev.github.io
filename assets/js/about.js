import { profile } from "../../data/profile.js";
import { education } from "../../data/education.js";
import { aboutDetails } from "../../data/about.js";
import { stats } from "../../data/stats.js";

const ICONS = {
  "user-check": `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.31 0-6 2.02-6 4.5V20a1 1 0 0 0 1 1h7.1a6.96 6.96 0 0 1-.1-1.2c0-2.11.93-4 2.4-5.28A8.5 8.5 0 0 0 9 13Zm12.71 3.29a1 1 0 0 0-1.42 0L17 19.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l2 2a1 1 0 0 0 1.42 0l4-4a1 1 0 0 0 0-1.42Z"/></svg>`,
  location: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`,
  status: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 14.5V11H8v-2h3V7.5l4.5 4.5-4.5 4.5z"/></svg>`,
};

function renderTimeline() {
  const root = document.getElementById("about-timeline");
  if (!root) return;

  root.innerHTML = education
    .map((entry, i) => {
      const isLast = i === education.length - 1;
      const logo = entry.logo
        ? `<div class="timeline-logo icon-box icon-box-md">
            <img src="./${entry.logo}" alt="" loading="lazy" />
          </div>`
        : "";

      const desc = entry.description
        ? `<p class="timeline-desc">${entry.description}</p>`
        : "";

      return `
        <div class="timeline-entry">
          <div class="timeline-spine" aria-hidden="true">
            <span class="timeline-dot"></span>
            ${isLast ? "" : '<span class="timeline-line"></span>'}
          </div>
          <article class="timeline-card">
            <div class="timeline-card-inner">
              ${logo}
              <div class="timeline-body">
                <span class="period-badge">${entry.period}</span>
                <h3 class="timeline-degree">${entry.degree}</h3>
                <p class="timeline-school">${entry.school}</p>
                ${desc}
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

function renderBio() {
  const root = document.getElementById("about-bio");
  if (!root) return;
  root.innerHTML = profile.bio;
}

function renderDetails() {
  const root = document.getElementById("about-details");
  if (!root) return;

  root.innerHTML = aboutDetails
    .map(d => {
      const icon = ICONS[d.icon] || "";
      const value = d.href
        ? `<a href="${d.href}" class="detail-value">${d.value}</a>`
        : `<span class="detail-value">${d.value}</span>`;

      return `
        <div class="detail-card">
          <div class="detail-icon icon-box icon-box-md" aria-hidden="true">${icon}</div>
          <div class="detail-text">
            <span class="detail-label">${d.label}</span>
            ${value}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderStats() {
  const root = document.getElementById("about-stats");
  if (!root) return;

  root.innerHTML = stats
    .map(
      s => `
      <div class="stat-card sharp-raised">
        <span class="stat-count">${s.count}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `
    )
    .join("");
}

renderTimeline();
renderBio();
renderDetails();
renderStats();
