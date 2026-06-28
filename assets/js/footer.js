import { servicesData } from "../../data/services.js";
import { contactData } from "../../data/contact.js";

const SOCIAL_ICONS = {
  github:   `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.01c-3.34.73-4.04-1.41-4.04-1.41-.54-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.3c1.01 0 2.03.13 2.98.38 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.23v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12"/></svg>`,
  email:    `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`,
};

const NAV_LINKS = [
  { href: "#about",      label: "About"      },
  { href: "#skills",     label: "Skills"     },
  { href: "#projects",   label: "Projects"   },
  { href: "#experience", label: "Experience" },
];

function renderBrandSocials() {
  const root = document.getElementById("footer-brand-socials");
  if (!root) return;

  const picks = ["github", "facebook", "email"];
  const links = picks
    .map(key => contactData.socials.find(s => s.icon === key))
    .filter(Boolean);

  root.innerHTML = links
    .map(s => `
      <a
        href="${s.href}"
        aria-label="${s.label}"
        ${s.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      >${SOCIAL_ICONS[s.icon]}</a>
    `)
    .join("");
}

function renderQuickLinks() {
  const root = document.getElementById("footer-nav");
  if (!root) return;

  root.innerHTML = `
    <p class="footer-col-heading">Quick Links</p>
    <nav class="footer-links" aria-label="Footer navigation">
      ${NAV_LINKS.map(({ href, label }) => `<a href="${href}">${label}</a>`).join("")}
    </nav>
  `;
}

function renderFooterServices() {
  const root = document.getElementById("footer-services");
  if (!root || !servicesData?.length) return;

  root.innerHTML = `
    <p class="footer-col-heading">Services</p>
    <ul class="footer-services-list" aria-label="Services offered">
      ${servicesData
        .map(({ title, accent }) => `
          <li class="footer-service-item">
           
            <a href="#services">${title}</a>
          </li>
        `)
        .join("")}
    </ul>
  `;
}

function setCopyrightYear() {
  const el = document.getElementById("footer-copyright");
  if (!el) return;
  el.textContent = `© ${new Date().getFullYear()} Jesie Gapol. All rights reserved.`;
}

function setupBackToTop() {
  const btn = document.getElementById("footer-top-btn");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

renderBrandSocials();
renderQuickLinks();
renderFooterServices();
setCopyrightYear();
setupBackToTop();