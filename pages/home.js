/* ─── pages/home.js — Landing page renderer ─────────────────────────────
   Security: All dynamic content uses textContent or createElement — no innerHTML
   with user-supplied data. Static HTML built with secure DOM patterns.
   ────────────────────────────────────────────────────────────────────────── */

window.renderHome = function(container) {
  const data = window.SEMI_DATA;

  // Build page using secure DOM construction
  // Security: No innerHTML used with user-controlled data
  const frag = document.createDocumentFragment();

  /* ── HERO ────────────────────────────────────────────────────────────── */
  const hero = document.createElement('section');
  hero.className = 'hero-section';
  hero.setAttribute('aria-label', 'Hero section');

  // Canvas wafer bg
  const canvasEl = document.createElement('canvas');
  canvasEl.id = 'wafer-canvas';
  canvasEl.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvasEl);

  // Particles
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.setAttribute('aria-hidden', 'true');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${Math.random() > 0.5 ? 'rgba(79,142,247,0.6)' : 'rgba(103,232,249,0.5)'};
      animation-duration:${8 + Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
    `;
    hero.appendChild(p);
  }

  const heroInner = document.createElement('div');
  heroInner.className = 'container';
  heroInner.style.position = 'relative';
  heroInner.style.zIndex = '1';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'hero-eyebrow anim-fade-up';
  eyebrow.textContent = 'IC Fabrication Educational Platform';

  const h1 = document.createElement('h1');
  h1.className = 'hero-title anim-fade-up-d1';
  h1.textContent = 'Semiconductor Manufacturing & Inspection System';

  const subtitle = document.createElement('p');
  subtitle.className = 'hero-subtitle anim-fade-up-d2';
  subtitle.textContent = 'Interactive Educational Platform for IC Fabrication Processes — from silicon sand to packaged chip.';

  const cta = document.createElement('div');
  cta.className = 'hero-cta anim-fade-up-d3';

  const btnExplore = document.createElement('a');
  btnExplore.className = 'btn btn-primary';
  btnExplore.href = '#/process-flow';
  btnExplore.setAttribute('aria-label', 'Explore manufacturing process');
  btnExplore.textContent = 'Explore Process Flow';
  cta.appendChild(btnExplore);

  const btnCompanies = document.createElement('a');
  btnCompanies.className = 'btn btn-ghost';
  btnCompanies.href = '#/companies';
  btnCompanies.setAttribute('aria-label', 'View companies');
  btnCompanies.textContent = 'View Companies';
  cta.appendChild(btnCompanies);

  // Stats
  const statsRow = document.createElement('div');
  statsRow.className = 'stats-row anim-fade-up-d4';

  const stats = [
    { value: '13', label: 'Process Steps' },
    { value: '10+', label: 'Inspection Tools' },
    { value: '30+', label: 'Industry Companies' },
    { value: '500+', label: 'Billion $ Market' },
  ];

  stats.forEach(s => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    const val = document.createElement('span');
    val.className = 'stat-value';
    val.textContent = s.value;
    const lbl = document.createElement('div');
    lbl.className = 'stat-label';
    lbl.textContent = s.label;
    item.append(val, lbl);
    statsRow.appendChild(item);
  });

  heroInner.append(eyebrow, h1, subtitle, cta, statsRow);
  hero.appendChild(heroInner);

  const scrollCue = document.createElement('div');
  scrollCue.className = 'scroll-cue';
  scrollCue.setAttribute('aria-hidden', 'true');
  const scrollSpan = document.createElement('span');
  scrollSpan.textContent = 'scroll';
  const scrollArr = document.createElement('div');
  scrollArr.className = 'scroll-arrow';
  scrollCue.append(scrollSpan, scrollArr);
  hero.appendChild(scrollCue);

  frag.appendChild(hero);

  /* ── PROCESS FLOW SECTION ──────────────────────────────────────────── */
  const processSection = document.createElement('section');
  processSection.id = 'process-flow';
  processSection.className = 'page-enter';

  const procInner = document.createElement('div');
  procInner.className = 'container';

  const procLabel = document.createElement('span');
  procLabel.className = 'section-label';
  procLabel.textContent = 'IC Fabrication Journey';

  const procTitle = document.createElement('h2');
  procTitle.className = 'section-title';
  procTitle.textContent = 'Manufacturing Process Flow';

  const procDivider = document.createElement('div');
  procDivider.className = 'section-divider';

  const procSub = document.createElement('p');
  procSub.style.cssText = 'color:rgba(255,255,255,0.55); font-size:0.95rem; max-width:620px; line-height:1.75; margin-bottom:2.5rem;';
  procSub.textContent = 'Modern semiconductor manufacturing requires 300–500 individual process steps across 13 major phases. Click any step to explore detailed technical content, inspection tools, and industry suppliers.';

  const timeline = document.createElement('div');
  timeline.className = 'process-timeline';
  timeline.setAttribute('role', 'list');

  data.steps.forEach((step, i) => {
    const card = document.createElement('a');
    card.className = 'timeline-card';
    card.href = '#/process/' + step.slug;
    card.style.setProperty('--card-color', step.color);
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', 'Step ' + step.stepNumber + ': ' + step.title);

    // Animate with delay
    card.style.animation = `fadeSlideUp 0.5s ${i * 0.05}s cubic-bezier(0.4,0,0.2,1) both`;

    const num = document.createElement('span');
    num.className = 'timeline-card-num';
    num.textContent = 'Step ' + step.stepNumber;

    const title = document.createElement('div');
    title.className = 'timeline-card-title';
    title.textContent = step.title;

    const desc = document.createElement('div');
    desc.className = 'timeline-card-desc';
    desc.textContent = step.shortDesc;

    const arrow = document.createElement('div');
    arrow.className = 'timeline-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    // Use DOMParser for SVG to avoid innerHTML security concerns
    const svgDoc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'image/svg+xml'
    );
    arrow.appendChild(document.importNode(svgDoc.documentElement, true));

    card.append(num, title, desc, arrow);
    timeline.appendChild(card);
  });

  procInner.append(procLabel, procTitle, procDivider, procSub, timeline);
  processSection.appendChild(procInner);
  frag.appendChild(processSection);

  /* ── INSPECTION TOOLS PREVIEW ──────────────────────────────────────── */
  const toolsSection = document.createElement('section');
  toolsSection.style.borderTop = '1px solid rgba(255,255,255,0.06)';

  const toolsInner = document.createElement('div');
  toolsInner.className = 'container';

  const toolsLabel = document.createElement('span');
  toolsLabel.className = 'section-label';
  toolsLabel.textContent = 'Metrology & Quality Control';

  const toolsTitle = document.createElement('h2');
  toolsTitle.className = 'section-title';
  toolsTitle.textContent = 'Inspection & Metrology Tools';

  const toolsDivider = document.createElement('div');
  toolsDivider.className = 'section-divider';

  const toolsGrid = document.createElement('div');
  toolsGrid.className = 'tools-grid';

  data.tools.forEach(tool => {
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

    const cat = document.createElement('div');
    cat.className = 'tool-card-cat';
    cat.textContent = tool.category;

    const badge = document.createElement('span');
    badge.className = 'badge badge-white';
    badge.style.marginTop = '0.75rem';
    badge.textContent = tool.category;

    card.append(icon, name, full, badge);
    toolsGrid.appendChild(card);
  });

  toolsInner.append(toolsLabel, toolsTitle, toolsDivider, toolsGrid);
  toolsSection.appendChild(toolsInner);
  frag.appendChild(toolsSection);

  /* ── COMPANIES PREVIEW ─────────────────────────────────────────────── */
  const coSection = document.createElement('section');
  coSection.style.borderTop = '1px solid rgba(255,255,255,0.06)';

  const coInner = document.createElement('div');
  coInner.className = 'container';

  const coLabel = document.createElement('span');
  coLabel.className = 'section-label';
  coLabel.textContent = 'Industry Ecosystem';

  const coTitle = document.createElement('h2');
  coTitle.className = 'section-title';
  coTitle.textContent = 'Major Foundries & Equipment Suppliers';

  const coDivider = document.createElement('div');
  coDivider.className = 'section-divider';

  const coGrid = document.createElement('div');
  coGrid.className = 'companies-grid';

  const preview = [...data.companies.foundries.slice(0,3), ...data.companies.equipment.slice(0,3)];
  preview.forEach(co => {
    const card = document.createElement('div');
    card.className = 'company-card glass-card';

    const header = document.createElement('div');
    header.className = 'company-card-header';

    const flag = document.createElement('div');
    flag.className = 'company-flag';
    flag.textContent = co.flag;

    const info = document.createElement('div');
    const coName = document.createElement('div');
    coName.className = 'company-card-name';
    coName.textContent = co.name;
    const coFull = document.createElement('div');
    coFull.className = 'company-card-full';
    coFull.textContent = co.country + ' · ' + (co.marketCap || '');
    info.append(coName, coFull);
    header.append(flag, info);

    const desc = document.createElement('p');
    desc.className = 'company-card-desc';
    desc.textContent = co.description.substring(0, 120) + '…';

    const spec = document.createElement('div');
    spec.className = 'company-tags';
    const sp = document.createElement('span');
    sp.className = 'chip';
    sp.textContent = co.specialization;
    spec.appendChild(sp);

    card.append(header, desc, spec);
    coGrid.appendChild(card);
  });

  const coBtn = document.createElement('div');
  coBtn.style.cssText = 'text-align:center; margin-top:2rem;';
  const coLink = document.createElement('a');
  coLink.className = 'btn btn-ghost';
  coLink.href = '#/companies';
  coLink.textContent = 'View All Companies →';
  coBtn.appendChild(coLink);

  coInner.append(coLabel, coTitle, coDivider, coGrid, coBtn);
  coSection.appendChild(coInner);
  frag.appendChild(coSection);

  /* ── GLOSSARY PREVIEW ──────────────────────────────────────────────── */
  const glossSection = document.createElement('section');
  glossSection.style.borderTop = '1px solid rgba(255,255,255,0.06)';

  const glossInner = document.createElement('div');
  glossInner.className = 'container';

  const glossLabel = document.createElement('span');
  glossLabel.className = 'section-label';
  glossLabel.textContent = 'Quick Reference';

  const glossTitle = document.createElement('h2');
  glossTitle.className = 'section-title';
  glossTitle.textContent = 'Semiconductor Glossary';

  const glossDivider = document.createElement('div');
  glossDivider.className = 'section-divider';

  const glossGrid = document.createElement('div');
  glossGrid.className = 'two-col';
  glossGrid.style.gap = '0.75rem';

  data.glossary.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'glass-card';
    item.style.padding = '1rem 1.25rem';
    item.style.cursor = 'pointer';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'Definition of ' + entry.term);

    const term = document.createElement('div');
    term.className = 'glossary-trigger';
    term.style.cssText = 'font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:0.35rem;';
    term.textContent = entry.term;

    const def = document.createElement('div');
    def.style.cssText = 'font-size:0.82rem; color:rgba(255,255,255,0.55); line-height:1.6;';
    def.textContent = entry.definition.substring(0, 90) + '…';

    item.append(term, def);

    // Security: Event listener instead of inline onclick
    const openGloss = () => window.openGlossary(entry.term, entry.definition);
    item.addEventListener('click', openGloss);
    item.addEventListener('keypress', e => { if (e.key === 'Enter') openGloss(); });
    glossGrid.appendChild(item);
  });

  glossInner.append(glossLabel, glossTitle, glossDivider, glossGrid);
  glossSection.appendChild(glossInner);
  frag.appendChild(glossSection);

  // ─── FOOTER ────────────────────────────────────────────────────────────
  const footer = buildFooter();
  frag.appendChild(footer);

  container.appendChild(frag);

  // Initialize wafer canvas animation
  requestAnimationFrame(() => {
    window.initWaferCanvas('wafer-canvas');
  });
};

function buildFooter() {
  const footer = document.createElement('footer');
  const inner = document.createElement('div');
  inner.className = 'footer-inner container';

  // Brand
  const brand = document.createElement('div');
  const brandName = document.createElement('span');
  brandName.className = 'footer-brand';
  brandName.textContent = 'ELCHIP';
  const brandDesc = document.createElement('p');
  brandDesc.className = 'footer-desc';
  brandDesc.textContent = 'Interactive educational platform for semiconductor manufacturing and IC fabrication processes.';
  brand.append(brandName, brandDesc);

  // Quick links
  const links = document.createElement('div');
  const linksHeading = document.createElement('span');
  linksHeading.className = 'footer-heading';
  linksHeading.textContent = 'Navigation';
  const linksList = document.createElement('ul');
  linksList.className = 'footer-links';
  [['Process Flow', '#/process-flow'], ['Inspection Tools', '#/tools'], ['Companies', '#/companies'], ['Glossary', '#/glossary']].forEach(([text, href]) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    li.appendChild(a);
    linksList.appendChild(li);
  });
  links.append(linksHeading, linksList);

  // References
  const refs = document.createElement('div');
  const refsHeading = document.createElement('span');
  refsHeading.className = 'footer-heading';
  refsHeading.textContent = 'References';
  const refsList = document.createElement('ul');
  refsList.className = 'footer-links';
  ['JEDEC Standards', 'SEMI Equipment Reports', 'ITRS/IRDS Roadmap', 'IEEE Transactions on Semiconductor Mfg'].forEach(ref => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.style.cssText = 'font-size:0.85rem; color:rgba(255,255,255,0.4);';
    span.textContent = ref;
    li.appendChild(span);
    refsList.appendChild(li);
  });
  const disclaimer = document.createElement('p');
  disclaimer.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.25); margin-top:0.75rem; line-height:1.6;';
  disclaimer.textContent = 'Educational purposes only. Technical data sourced from industry references.';
  refs.append(refsHeading, refsList, disclaimer);

  inner.append(brand, links, refs);

  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom container';
  const copy = document.createElement('span');
  copy.textContent = '© 2026 Akshith Mandapally — Semiconductor Manufacturing Platform';
  const credit = document.createElement('span');
  credit.textContent = 'Built with precision • Based in India • Open to Relocation';
  bottom.append(copy, credit);

  footer.append(inner, bottom);
  return footer;
}

window._buildFooter = buildFooter;
