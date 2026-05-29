/* ─── pages/process.js — Process Detail Page Renderer ───────────────────
   Security: All text content set via textContent. SVGs via DOMParser.
   No innerHTML used with dynamic data. Static HTML structure only.
   ────────────────────────────────────────────────────────────────────────── */

window.renderProcess = function(container, slug) {
  const data = window.SEMI_DATA;
  const step = data.steps.find(s => s.slug === slug);

  if (!step) {
    container.appendChild(render404('process', slug));
    return;
  }

  const stepIndex = data.steps.findIndex(s => s.slug === slug);
  const prevStep = stepIndex > 0 ? data.steps[stepIndex - 1] : null;
  const nextStep = stepIndex < data.steps.length - 1 ? data.steps[stepIndex + 1] : null;

  const frag = document.createDocumentFragment();

  /* ── HERO ──────────────────────────────────────────────────────────── */
  const hero = document.createElement('div');
  hero.className = 'process-hero';

  const heroInner = document.createElement('div');
  heroInner.className = 'process-hero-inner page-enter';

  // Breadcrumb nav
  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'process-nav-bar';
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const homeLink = document.createElement('a');
  homeLink.href = '#/';
  homeLink.textContent = 'Home';
  const sep1 = document.createElement('span');
  sep1.textContent = ' / ';
  const flowLink = document.createElement('a');
  flowLink.href = '#/process-flow';
  flowLink.textContent = 'Process Flow';
  const sep2 = document.createElement('span');
  sep2.textContent = ' / ';
  const current = document.createElement('span');
  current.style.color = 'rgba(255,255,255,0.7)';
  current.textContent = step.title;
  breadcrumb.append(homeLink, sep1, flowLink, sep2, current);

  // Hero grid
  const heroGrid = document.createElement('div');
  heroGrid.className = 'process-hero-grid';

  const heroLeft = document.createElement('div');

  const stepBadge = document.createElement('div');
  stepBadge.style.display = 'flex';
  stepBadge.style.gap = '0.5rem';
  stepBadge.style.alignItems = 'center';
  stepBadge.style.marginBottom = '1rem';

  const stepNumBadge = document.createElement('span');
  stepNumBadge.className = 'badge badge-accent';
  stepNumBadge.textContent = 'Step ' + step.stepNumber;
  const catBadge = document.createElement('span');
  catBadge.className = 'badge badge-white';
  catBadge.textContent = 'IC Fabrication';
  stepBadge.append(stepNumBadge, catBadge);

  const heroH1 = document.createElement('h1');
  heroH1.style.cssText = 'font-size:clamp(1.8rem,4vw,3rem); font-weight:900; letter-spacing:-0.025em; margin-bottom:1rem; line-height:1.1;';
  heroH1.textContent = step.title;

  const heroShort = document.createElement('p');
  heroShort.style.cssText = 'font-size:1.05rem; color:rgba(255,255,255,0.65); line-height:1.75; max-width:560px; margin-bottom:1.5rem;';
  heroShort.textContent = step.shortDesc;

  // Color accent bar
  const accentBar = document.createElement('div');
  accentBar.style.cssText = `width:48px; height:3px; border-radius:3px; background:${step.color}; margin-bottom:1.5rem;`;

  heroLeft.append(stepBadge, accentBar, heroH1, heroShort);

  // Hero image
  const heroRight = document.createElement('div');
  if (step.image) {
    const img = document.createElement('img');
    img.src = step.image;
    img.alt = step.title + ' — process image';
    img.className = 'process-hero-image';
    img.loading = 'lazy';
    heroRight.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'process-hero-image-placeholder';
    const emoji = getStepEmoji(step.slug);
    placeholder.textContent = emoji;
    heroRight.appendChild(placeholder);
  }

  heroGrid.append(heroLeft, heroRight);
  heroInner.append(breadcrumb, heroGrid);
  hero.appendChild(heroInner);
  frag.appendChild(hero);

  /* ── MAIN CONTENT ─────────────────────────────────────────────────── */
  const main = document.createElement('main');
  main.className = 'container page-enter';
  main.style.paddingTop = '3rem';
  main.setAttribute('id', 'main-content');

  /* ── SECTION: OVERVIEW ──────────────────────────────────────────── */
  appendSection(main, {
    label: 'Process Overview',
    title: 'Purpose & Principle',
    content: () => {
      const p = document.createElement('p');
      p.style.cssText = 'font-size:0.95rem; color:rgba(255,255,255,0.72); line-height:1.85;';
      p.textContent = step.overview;
      return p;
    }
  });

  /* ── SECTION: TECHNICAL DETAIL ─────────────────────────────────── */
  appendSection(main, {
    label: 'Technical Data',
    title: 'Process Parameters & Chemistry',
    content: () => {
      const box = document.createElement('pre');
      box.className = 'tech-box';
      box.textContent = step.technicalDetail;
      return box;
    }
  });

  /* ── SECTION: PROCESS FLOW ─────────────────────────────────────── */
  appendSection(main, {
    label: 'Step-by-Step',
    title: 'Process Flow Diagram',
    content: () => buildProcessFlow(step.processFlow, step.color)
  });

  /* ── SECTION: INSPECTION TOOLS ─────────────────────────────────── */
  const toolsForStep = data.tools.filter(t => step.inspectionTools.includes(t.id));
  if (toolsForStep.length > 0) {
    appendSection(main, {
      label: 'Metrology & Quality Control',
      title: 'Inspection & Metrology Tools',
      content: () => {
        const grid = document.createElement('div');
        grid.className = 'tools-grid';
        toolsForStep.forEach(tool => {
          const card = document.createElement('a');
          card.className = 'tool-card';
          card.href = '#/tool/' + tool.slug;
          card.setAttribute('aria-label', tool.name + ' — ' + tool.fullName);

          const icon = document.createElement('span');
          icon.className = 'tool-card-icon';
          icon.textContent = tool.icon;

          const name = document.createElement('div');
          name.className = 'tool-card-name';
          name.textContent = tool.name;

          const full = document.createElement('div');
          full.className = 'tool-card-full';
          full.textContent = tool.fullName;

          const processes = document.createElement('div');
          processes.style.marginTop = '0.6rem';
          const procBadge = document.createElement('span');
          procBadge.className = `badge ${tool.category === 'Inspection' ? 'badge-orange' : 'badge-cyan'}`;
          procBadge.textContent = tool.category;
          processes.appendChild(procBadge);

          card.append(icon, name, full, processes);
          grid.appendChild(card);
        });
        return grid;
      }
    });
  }

  /* ── SECTION: EQUIPMENT SUPPLIERS ──────────────────────────────── */
  if (step.companyDetails && step.companyDetails.length > 0) {
    appendSection(main, {
      label: 'Industry Ecosystem',
      title: 'Equipment Suppliers & Companies',
      content: () => {
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem;';

        step.companyDetails.forEach(co => {
          const card = document.createElement('div');
          card.className = 'company-card';

          const header = document.createElement('div');
          header.className = 'company-card-header';
          header.style.marginBottom = '0.75rem';

          const nameEl = document.createElement('div');
          nameEl.className = 'company-card-name';
          nameEl.textContent = co.name;

          const countryEl = document.createElement('div');
          countryEl.className = 'company-card-full';
          countryEl.textContent = co.country;

          header.append(nameEl, countryEl);

          const role = document.createElement('p');
          role.style.cssText = 'font-size:0.85rem; color:rgba(255,255,255,0.6); line-height:1.65;';
          role.textContent = co.role;

          card.append(header, role);
          grid.appendChild(card);
        });

        return grid;
      }
    });
  }

  /* ── PREV / NEXT NAVIGATION ─────────────────────────────────────── */
  const stepNavEl = document.createElement('nav');
  stepNavEl.className = 'step-nav';
  stepNavEl.setAttribute('aria-label', 'Step navigation');

  if (prevStep) {
    const prevBtn = document.createElement('a');
    prevBtn.className = 'step-nav-btn prev';
    prevBtn.href = '#/process/' + prevStep.slug;
    prevBtn.setAttribute('aria-label', 'Previous step: ' + prevStep.title);
    const prevLabel = document.createElement('span');
    prevLabel.className = 'step-nav-label';
    prevLabel.textContent = '← Previous';
    const prevTitle = document.createElement('span');
    prevTitle.className = 'step-nav-title';
    prevTitle.textContent = prevStep.title;
    prevBtn.append(prevLabel, prevTitle);
    stepNavEl.appendChild(prevBtn);
  } else {
    const spacer = document.createElement('div');
    stepNavEl.appendChild(spacer);
  }

  if (nextStep) {
    const nextBtn = document.createElement('a');
    nextBtn.className = 'step-nav-btn';
    nextBtn.href = '#/process/' + nextStep.slug;
    nextBtn.style.marginLeft = 'auto';
    nextBtn.style.textAlign = 'right';
    nextBtn.setAttribute('aria-label', 'Next step: ' + nextStep.title);
    const nextLabel = document.createElement('span');
    nextLabel.className = 'step-nav-label';
    nextLabel.textContent = 'Next →';
    const nextTitle = document.createElement('span');
    nextTitle.className = 'step-nav-title';
    nextTitle.textContent = nextStep.title;
    nextBtn.append(nextLabel, nextTitle);
    stepNavEl.appendChild(nextBtn);
  }

  main.appendChild(stepNavEl);
  main.style.paddingBottom = '4rem';

  frag.appendChild(main);
  frag.appendChild(window._buildFooter());

  container.appendChild(frag);
};

/* ─── Helper: Build animated process flow ─────────────────────────────── */
function buildProcessFlow(steps, color) {
  const container = document.createElement('div');
  container.className = 'flow-container';

  steps.forEach((s, i) => {
    const step = document.createElement('div');
    step.className = 'flow-step';
    step.style.animation = `fadeSlideUp 0.4s ${i * 0.07}s cubic-bezier(0.4,0,0.2,1) both`;

    const connector = document.createElement('div');
    connector.className = 'flow-connector';

    const dot = document.createElement('div');
    dot.className = 'flow-dot';
    dot.textContent = String(i + 1).padStart(2, '0');
    dot.style.setProperty('--step-color', color);

    const line = document.createElement('div');
    line.className = 'flow-line';

    connector.append(dot);
    if (i < steps.length - 1) connector.append(line);

    const content = document.createElement('div');
    content.className = 'flow-content';

    const h4 = document.createElement('h4');
    h4.textContent = s.step;

    const p = document.createElement('p');
    p.textContent = s.desc;

    content.append(h4, p);
    step.append(connector, content);
    container.appendChild(step);
  });

  return container;
}

/* ─── Helper: Append a section block ─────────────────────────────────── */
function appendSection(parent, { label, title, content }) {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom:3.5rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.06);';

  const lbl = document.createElement('span');
  lbl.className = 'section-label';
  lbl.textContent = label;

  const h2 = document.createElement('h2');
  h2.style.cssText = 'font-size:clamp(1.3rem,3vw,1.75rem); font-weight:800; letter-spacing:-0.02em; margin-bottom:1.5rem; color:#fff;';
  h2.textContent = title;

  const body = content();

  section.append(lbl, h2, body);
  parent.appendChild(section);
}

/* ─── Helper: 404 ────────────────────────────────────────────────────── */
function render404(type, slug) {
  const div = document.createElement('div');
  div.style.cssText = 'min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:4rem 1.5rem;';

  const code = document.createElement('div');
  code.style.cssText = 'font-family:var(--mono); font-size:4rem; font-weight:700; color:rgba(255,255,255,0.1); margin-bottom:1rem;';
  code.textContent = '404';

  const msg = document.createElement('p');
  msg.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.5); margin-bottom:1.5rem;';
  msg.textContent = type + ' "' + slug + '" not found';

  const link = document.createElement('a');
  link.className = 'btn btn-ghost';
  link.href = '#/';
  link.textContent = '← Back to Home';

  div.append(code, msg, link);
  return div;
}

/* ─── Helper: Step emoji ─────────────────────────────────────────────── */
function getStepEmoji(slug) {
  const map = {
    'wafer-preparation': '⬡', 'oxidation': '🔥', 'photolithography': '🎯',
    'etching': '⚗️', 'ion-implantation': '⚡', 'thin-film-deposition': '🔲',
    'cmp': '🔄', 'metallization': '🔌', 'wafer-inspection': '🔬',
    'die-testing': '📊', 'dicing': '✂️', 'packaging': '📦', 'final-testing': '✅'
  };
  return map[slug] || '🔬';
}
