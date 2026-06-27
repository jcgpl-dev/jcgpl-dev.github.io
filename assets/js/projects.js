import { projects } from "../../data/projects.js";

function renderLinks(project) {
  const links = [];

  if (project.githubUrl) {
    links.push(
     `<a 
  href="${project.githubUrl}" 
  class="txt-btn live-demo-btn" 
  target="_blank" 
  rel="noopener noreferrer"
>
  Github
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    fill="none" 
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path 
      d="M7 17L17 7M9 7h8v8" 
      stroke="currentColor" 
      stroke-width="2.4" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</a>`
    );
  }
  if (project.liveUrl) {
    links.push(
      `<a 
  href="${project.liveUrl}" 
  class="txt-btn live-demo-btn" 
  target="_blank" 
  rel="noopener noreferrer"
>
  Live Demo
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    fill="none" 
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path 
      d="M7 17L17 7M9 7h8v8" 
      stroke="currentColor" 
      stroke-width="2.4" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</a>`
    );
  }

  if (!links.length) return "";

  return `<div class="project-actions btn-row">${links.join("")}</div>`;
}

function renderTags(techStack = []) {
  if (!techStack.length) return "";
  const tags = techStack.map(t => `<span class="tag">${t}</span>`).join("");
  return `<div class="tag-row project-tags">${tags}</div>`;
}

function renderPlainTags(techStack = []) {
  return techStack.map(t => `<span class="tag">${t}</span>`).join("");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderFilterBar() {
  const section = document.getElementById('projects-grid')?.parentElement;
  if (!section) return;

  const categoryCounts = projects.reduce((acc, p) => {
    const cat = p.category;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const bar = document.createElement('div');
  bar.className = 'projects-filter-bar';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Filter projects by category');

  bar.innerHTML = categories.map((cat, i) => {
    const count = cat === 'All' ? projects.length : (categoryCounts[cat] || 0);
return `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat}">
  ${cat} (${count})
</button>`;
  }).join('');

  const grid = document.getElementById('projects-grid');
  section.insertBefore(bar, grid);

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const index = Number(card.querySelector('[data-project-index]')?.dataset.projectIndex);
      const project = projects[index];
      const match = filter === 'All' || project?.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.setAttribute("role", "list");

  grid.innerHTML = projects
    .map(
      (project, projectIndex) => `
      <article class="project-card" role="listitem">
        <div class="project-image-wrap">
          <button
            type="button"
            class="project-view-btn"
            data-project-index="${projectIndex}"
            aria-label="View ${project.title} full image"
          >
            <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <line x1="14" y1="10" x2="21" y2="3" />
            
            <polyline points="9 21 3 21 3 15" />
            <line x1="10" y1="14" x2="3" y2="21" />
          </svg>

          </button>
          <img
            src="./${project.image}"
            alt="${project.title}"
            loading="lazy"
          />
        </div>
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          ${renderTags(project.techStack)}
          ${renderLinks(project)}
        </div>
      </article>
    `
    )
    .join("");
  
  // monitor newly injected grid items
  if (typeof monitorImageLoading === 'function') {
    monitorImageLoading(grid);
  } else if (window.monitorImageLoading) {
    window.monitorImageLoading(grid);
  }
}

function setupProjectModal() {
  const modal = document.getElementById("project-modal");
  const modalImage = document.getElementById("project-modal-image");
  const modalTitle = document.getElementById("project-modal-title");
  const modalSummary = document.getElementById("project-modal-summary");
  const modalTags = document.getElementById("project-modal-tags");
  const modalMeta = document.getElementById("project-modal-meta");
  const modalDetails = document.getElementById("project-modal-details");
  const modalActions = document.getElementById("project-modal-actions");
  const modalCounter = document.getElementById("project-modal-counter");
  const prevBtn = document.getElementById("project-modal-prev");
  const nextBtn = document.getElementById("project-modal-next");
  const closeBtn = document.getElementById("project-modal-close");
  const grid = document.getElementById("projects-grid");
  if (
    !modal ||
    !modalImage ||
    !modalTitle ||
    !modalSummary ||
    !modalTags ||
    !modalMeta ||
    !modalDetails ||
    !modalActions ||
    !modalCounter ||
    !prevBtn ||
    !nextBtn ||
    !closeBtn ||
    !grid 
  ) {
    return;
  }

  let lastTrigger = null;
  let activeImages = [];
  let activeTitle = "";
  let activeIndex = 0;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");

  const getProjectImages = project => {
    if (!project) return [];
    if (Array.isArray(project.images) && project.images.length) return project.images;
    return project.image ? [project.image] : [];
  };

// chat toggle and modal
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');

const renderCodeSnippet = codeSnippet => {
  if (!codeSnippet) return "";

  // 1. First, safely escape the HTML
  let content = escapeHtml(codeSnippet);

  // 2. Temporarily extract comments to protect them from other regex matchers
  const savedComments = [];
  content = content.replace(/(\/\/.*)/g, (match) => {
    savedComments.push(match);
    // Insert a unique placeholder token
    return `__COMMENT_PLACEHOLDER_${savedComments.length - 1}__`;
  });

  // 3. Apply color tokens safely to the code logic only
  content = content
    // Keywords & Types: void, int, const, final, static, return, for, class, import, Uint8List
    .replace(/\b(void|int|const|final|static|return|for|class|import|Uint8List)\b/g, '<span class="code-keyword">$1</span>')
    // Hex and Numerical Values: 8, 16, 0xFF, 0x03, 4
    .replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, '<span class="code-number">$1</span>')
    // Function Names and built-in operations
    .replace(/\b(_dynamicShiftRows|lfsrMixColumns|invLfsrMixColumns|_xtime|_gfMult|setAll)\b/g, '<span class="code-function">$1</span>');

  // 4. Restore the comments, wrapping each cleanly in a single uniform span element
  content = content.replace(/__COMMENT_PLACEHOLDER_(\d+)__/g, (match, index) => {
    return `<span class="code-comment">${savedComments[index]}</span>`;
  });

  // 5. Output the exact same layout shell structure
  return `<div class="modal-code-window">
      <div class="code-window-header">
        <span class="control-dot close"></span>
        <span class="control-dot minimize"></span>
        <span class="control-dot maximize"></span>
        <span class="code-window-title">Source Code (Dart)</span>
      </div>
      <pre class="modal-code-block"><code>${content}</code></pre>
    </div>`;
};

  const renderParagraphs = content =>
    (Array.isArray(content) ? content : [content])
      .filter(Boolean)
      .map(item => `<p>${item}</p>`)
      .join("");

  const renderNotes = items => {
    if (!Array.isArray(items) || !items.length) return "";

    return `
      <div class="modal-two-col">
        ${items
          .map(
            item => `
              <article class="modal-note">
                <span>${item.label}</span>
                <p>${item.content}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  };

  

  const renderLabeledParagraphs = items => {
    if (!Array.isArray(items) || !items.length) return "";

    return items
      .map(item => `<p><strong>${item.label}:</strong> ${item.content}</p>`)
      .join("");
  };

  const renderList = items => {
    if (!Array.isArray(items) || !items.length) return "";

    return `
      <ul class="modal-highlight-list">
        ${items.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;
  };

  const renderCaseSectionBody = section => {
    const renderers = {
      paragraphs: () => renderParagraphs(section.content),
      notes: () => renderNotes(section.items),
      "labeled-paragraphs": () => renderLabeledParagraphs(section.items),
      list: () => renderList(section.items),
    };

    const render = renderers[section.type] || renderers.paragraphs;
    return `${render()}${renderCodeSnippet(section.codeSnippet)}`;
  };

  const renderCaseSections = sections => {
    if (!Array.isArray(sections) || !sections.length) return "";

    return sections
      .map(
        section => `
          <section class="modal-case-section">
            <h4>${section.title}</h4>
            ${renderCaseSectionBody(section)}
          </section>
        `
      )
      .join("");
  };

  const getProjectMeta = project => {
    const meta = Array.isArray(project?.meta) ? [...project.meta] : [];

    if (project?.type) {
      meta.push({ label: "Type", value: project.type });
    }

    if (project?.role) {
      meta.push({ label: "Role", value: project.role });
    }

    meta.push({
      label: "Gallery",
      value: `${activeImages.length} screen${activeImages.length === 1 ? "" : "s"}`,
    });

    return meta;
  };

  const renderProjectMeta = project =>
    getProjectMeta(project)
      .map(
        item => `
          <div class="modal-meta-item">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </div>
        `
      )
      .join("");

  const renderModalActions = project => {
    const links = [];

    if (project?.githubUrl) {
      links.push(
        `<a href="${project.githubUrl}" class="txt-btn live-demo-btn" target="_blank" rel="noopener noreferrer">GitHub <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
            <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg></a>`
      );
    }

    if (project?.liveUrl) {
      links.push(`
        <a href="${project.liveUrl}" class="txt-btn live-demo-btn" target="_blank" rel="noopener noreferrer">
          Live Demo
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
            <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      `);
    }

    return links.join("");
  };

  const renderCaseStudy = project => {
    const caseStudy = project?.caseStudy || {};
    const hasRichCaseStudy = Object.keys(caseStudy).length > 0;
    modalTitle.textContent = caseStudy.title || project?.title || "Project Preview";
    modalSummary.textContent = caseStudy.subtitle || project?.description || "";
    modalTags.innerHTML = renderPlainTags(project?.techStack || []);
    modalMeta.innerHTML = renderProjectMeta(project);
    modalMeta.hidden = hasRichCaseStudy;
   modalDetails.innerHTML =
  hasRichCaseStudy
    ? `${renderCaseSections(caseStudy.sections)}`
    : "";
    modalActions.innerHTML = renderModalActions(project);
    modalActions.hidden = !modalActions.innerHTML.trim();
  };

 const updateNavState = () => {
  const hasMultiple = activeImages.length > 1;
  prevBtn.disabled = !hasMultiple;
  nextBtn.disabled = !hasMultiple;
  const counterText = activeImages.length
    ? `${activeIndex + 1} / ${activeImages.length}`
    : "0 / 0";
  modalCounter.textContent = counterText;

  const mirror = document.getElementById('project-modal-counter-mirror');
  if (mirror) mirror.textContent = counterText;
};
  const animateImageChange = direction => {
    modalImage.classList.remove("is-animating", "from-next", "from-prev");
    void modalImage.offsetWidth;
    modalImage.classList.add(
      "is-animating",
      direction === "prev" ? "from-prev" : "from-next"
    );
  };

  const renderImage = ({ animate = false, direction = "next" } = {}) => {
    const src = activeImages[activeIndex];
    if (!src) return;
    modalImage.src = `./${src}`;
    modalImage.alt = activeTitle
      ? `${activeTitle} (${activeIndex + 1}/${activeImages.length})`
      : "Project full preview";
    if (animate) animateImageChange(direction);
    updateNavState();

    // trigger the logo loader whenever a user hits Next/Prev
    const mediaWrap = modalImage.parentElement;
    if (mediaWrap) {
      mediaWrap.classList.remove('img-loaded');
      if (typeof monitorImageLoading === 'function') monitorImageLoading(mediaWrap);
    }
  };

  const openModal = ({ projectIndex, trigger }) => {
    const project = projects[projectIndex];
    activeImages = getProjectImages(project);
    if (!activeImages.length) return;

    activeIndex = 0;
    activeTitle = project?.title || "Project Preview";
    lastTrigger = trigger || null;
    renderCaseStudy(project);
    renderImage();

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    chatToggle.style.display = 'none';
    chatWindow.style.display =  'none';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
    modalImage.classList.remove("is-animating", "from-next", "from-prev");
    modalTitle.textContent = "";
    modalSummary.textContent = "";
    modalTags.innerHTML = "";
    modalMeta.innerHTML = "";
    modalMeta.hidden = false;
    modalDetails.innerHTML = "";
    modalActions.innerHTML = "";
    modalActions.hidden = false;
    modalCounter.textContent = "0 / 0";
    activeImages = [];
    activeIndex = 0;
    activeTitle = "";
    document.body.classList.remove("modal-open");
    chatToggle.style.display = 'flex';
    if (lastTrigger) lastTrigger.focus();
  };

  const goNext = () => {
    if (activeImages.length < 2) return;
    activeIndex = (activeIndex + 1) % activeImages.length;
    renderImage({ animate: true, direction: "next" });
  };

  const goPrev = () => {
    if (activeImages.length < 2) return;
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    renderImage({ animate: true, direction: "prev" });
  };

  grid.addEventListener("click", e => {
    const btn = e.target.closest(".project-view-btn");
    if (!btn) return;
    const projectIndex = Number(btn.dataset.projectIndex);
    if (!Number.isInteger(projectIndex) || projectIndex < 0) return;
    openModal({
      projectIndex,
      trigger: btn,
    });
  });

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);

// mobile nav bar buttons
const prevBtnMobile = document.getElementById("project-modal-prev-mobile");
const nextBtnMobile = document.getElementById("project-modal-next-mobile");
if (prevBtnMobile) prevBtnMobile.addEventListener("click", goPrev);
if (nextBtnMobile) nextBtnMobile.addEventListener("click", goNext);

closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", e => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });
}



renderProjects();
renderFilterBar(); 
setupProjectModal();
