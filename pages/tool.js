/* ─── pages/tool.js — Inspection Tool Detail Page ───────────────────────
   Security: All dynamic text via textContent. No innerHTML with user data.
   ────────────────────────────────────────────────────────────────────────── */

window.renderTool = function(container, slug) {
  const data = window.SEMI_DATA;
  const tool = data.tools.find(t => t.slug === slug);

  if (!tool) {
    container.appendChild(render404Tool('tool', slug));
    return;
  }

  const toolIndex = data.tools.findIndex(t => t.slug === slug);
  const prevTool = toolIndex > 0 ? data.tools[toolIndex - 1] : null;
  const nextTool = toolIndex < data.tools.length - 1 ? data.tools[toolIndex + 1] : null;

  const frag = document.createDocumentFragment();

  /* ── HERO ──────────────────────────────────────────────────────────── */
  const hero = document.createElement('div');
  hero.style.cssText = 'padding:4rem 0 3rem; border-bottom:1px solid rgba(255,255,255,0.06);';

  const heroInner = document.createElement('div');
  heroInner.className = 'container page-enter';

  // Breadcrumb
  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'process-nav-bar';
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');
  const homeLink = document.createElement('a');
  homeLink.href = '#/';
  homeLink.textContent = 'Home';
  const s1 = document.createElement('span');
  s1.textContent = ' / ';
  const toolsLink = document.createElement('a');
  toolsLink.href = '#/tools';
  toolsLink.textContent = 'Tools';
  const s2 = document.createElement('span');
  s2.textContent = ' / ';
  const cur = document.createElement('span');
  cur.style.color = 'rgba(255,255,255,0.7)';
  cur.textContent = tool.name;
  breadcrumb.append(homeLink, s1, toolsLink, s2, cur);

  // Header row
  const headerRow = document.createElement('div');
  headerRow.style.cssText = 'display:flex; align-items:flex-start; gap:1.5rem; margin-top:1.5rem; flex-wrap:wrap;';

  const iconBox = document.createElement('div');
  iconBox.style.cssText = 'width:72px; height:72px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:2rem; flex-shrink:0;';
  iconBox.textContent = tool.icon;

  const headerText = document.createElement('div');
  headerText.style.flex = '1';

  const badges = document.createElement('div');
  badges.style.cssText = 'display:flex; gap:0.5rem; margin-bottom:0.75rem; flex-wrap:wrap;';
  const catBadge = document.createElement('span');
  catBadge.className = tool.category === 'Inspection' ? 'badge badge-orange' : 'badge badge-cyan';
  catBadge.textContent = tool.category;
  const processBadge = document.createElement('span');
  processBadge.className = 'badge badge-white';
  processBadge.textContent = (tool.processes || []).join(' · ');
  badges.append(catBadge, processBadge);

  const toolH1 = document.createElement('h1');
  toolH1.style.cssText = 'font-size:clamp(1.6rem,4vw,2.6rem); font-weight:900; letter-spacing:-0.025em; margin-bottom:0.5rem;';
  toolH1.textContent = tool.name;

  const toolFull = document.createElement('p');
  toolFull.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.5); margin-bottom:0;';
  toolFull.textContent = tool.fullName;

  headerText.append(badges, toolH1, toolFull);
  headerRow.append(iconBox, headerText);
  heroInner.append(breadcrumb, headerRow);
  hero.appendChild(heroInner);
  frag.appendChild(hero);

  /* ── MAIN CONTENT ─────────────────────────────────────────────────── */
  const main = document.createElement('main');
  main.className = 'container page-enter';
  main.style.cssText = 'padding-top:3rem; padding-bottom:4rem;';

  /* ── WORKING PRINCIPLE ─────────────────────────────────────────── */
  const principleSection = makeSection('Working Principle', 'How It Works');
  const principleText = document.createElement('p');
  principleText.style.cssText = 'font-size:0.95rem; color:rgba(255,255,255,0.72); line-height:1.85;';
  principleText.textContent = tool.principle;
  principleSection.appendChild(principleText);
  main.appendChild(principleSection);

  /* ── DIAGRAM PLACEHOLDER ───────────────────────────────────────── */
  const diagSection = makeSection('Visual Reference', 'Measurement Principle Diagram');
  const diagBox = buildDiagram(tool);
  diagSection.appendChild(diagBox);
  main.appendChild(diagSection);

  /* ── SPECS ─────────────────────────────────────────────────────── */
  const specsSection = makeSection('Technical Specifications', 'Key Parameters');
  const specsList = document.createElement('ul');
  specsList.className = 'tool-specs-list';
  (tool.specs || []).forEach(spec => {
    const li = document.createElement('li');
    li.textContent = spec;
    specsList.appendChild(li);
  });
  specsSection.appendChild(specsList);
  main.appendChild(specsSection);

  /* ── APPLICATIONS ──────────────────────────────────────────────── */
  const appSection = makeSection('Fab Applications', 'Real-World Use Cases');
  const appGrid = document.createElement('div');
  appGrid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:0.75rem;';
  (tool.applications || []).forEach(app => {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem;';
    const dot = document.createElement('div');
    dot.style.cssText = 'width:6px; height:6px; background:var(--accent); border-radius:50%; flex-shrink:0;';
    const txt = document.createElement('span');
    txt.style.cssText = 'font-size:0.87rem; color:rgba(255,255,255,0.7);';
    txt.textContent = app;
    card.append(dot, txt);
    appGrid.appendChild(card);
  });
  appSection.appendChild(appGrid);
  main.appendChild(appSection);

  /* ── PROS / CONS ──────────────────────────────────────────────── */
  const pcSection = makeSection('Performance Characteristics', 'Advantages & Limitations');
  const pcGrid = document.createElement('div');
  pcGrid.className = 'pros-cons-grid';

  const prosBox = document.createElement('div');
  prosBox.className = 'pros-box';
  const prosH = document.createElement('h4');
  prosH.textContent = '✓ Advantages';
  const prosList = document.createElement('ul');
  (tool.advantages || []).forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    prosList.appendChild(li);
  });
  prosBox.append(prosH, prosList);

  const consBox = document.createElement('div');
  consBox.className = 'cons-box';
  const consH = document.createElement('h4');
  consH.textContent = '✗ Limitations';
  const consList = document.createElement('ul');
  (tool.limitations || []).forEach(l => {
    const li = document.createElement('li');
    li.textContent = l;
    consList.appendChild(li);
  });
  consBox.append(consH, consList);

  pcGrid.append(prosBox, consBox);
  pcSection.appendChild(pcGrid);
  main.appendChild(pcSection);

  /* ── MANUFACTURERS ─────────────────────────────────────────────── */
  const mfgSection = makeSection('Industry Suppliers', 'Equipment Manufacturers');
  const mfgGrid = document.createElement('div');
  mfgGrid.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.75rem;';
  (tool.manufacturers || []).forEach(mfg => {
    const tag = document.createElement('div');
    tag.style.cssText = 'background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:0.6rem 1.1rem; font-size:0.87rem; font-weight:600; color:rgba(255,255,255,0.8);';
    tag.textContent = mfg;
    mfgGrid.appendChild(tag);
  });
  mfgSection.appendChild(mfgGrid);
  main.appendChild(mfgSection);

  /* ── USED IN PROCESSES ─────────────────────────────────────────── */
  if (tool.processes && tool.processes.length > 0) {
    const procSection = makeSection('Process Integration', 'Used In These Manufacturing Steps');
    const procGrid = document.createElement('div');
    procGrid.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.75rem;';

    const relatedSteps = window.SEMI_DATA.steps.filter(s => s.inspectionTools.includes(tool.id));
    relatedSteps.forEach(step => {
      const link = document.createElement('a');
      link.href = '#/process/' + step.slug;
      link.style.cssText = 'background:rgba(79,142,247,0.1); border:1px solid rgba(79,142,247,0.2); border-radius:10px; padding:0.6rem 1.1rem; font-size:0.87rem; font-weight:600; color:#93b8ff; text-decoration:none; transition:all 0.2s;';
      link.textContent = 'Step ' + step.stepNumber + ': ' + step.title;
      link.addEventListener('mouseenter', () => { link.style.background = 'rgba(79,142,247,0.2)'; });
      link.addEventListener('mouseleave', () => { link.style.background = 'rgba(79,142,247,0.1)'; });
      procGrid.appendChild(link);
    });

    procSection.appendChild(procGrid);
    main.appendChild(procSection);
  }

  /* ── PREV / NEXT ───────────────────────────────────────────────── */
  const stepNav = document.createElement('nav');
  stepNav.className = 'step-nav';
  stepNav.setAttribute('aria-label', 'Tool navigation');

  if (prevTool) {
    const prevBtn = document.createElement('a');
    prevBtn.className = 'step-nav-btn prev';
    prevBtn.href = '#/tool/' + prevTool.slug;
    prevBtn.setAttribute('aria-label', 'Previous tool: ' + prevTool.name);
    const pl = document.createElement('span');
    pl.className = 'step-nav-label';
    pl.textContent = '← Previous Tool';
    const pt = document.createElement('span');
    pt.className = 'step-nav-title';
    pt.textContent = prevTool.name;
    prevBtn.append(pl, pt);
    stepNav.appendChild(prevBtn);
  } else {
    stepNav.appendChild(document.createElement('div'));
  }

  if (nextTool) {
    const nextBtn = document.createElement('a');
    nextBtn.className = 'step-nav-btn';
    nextBtn.href = '#/tool/' + nextTool.slug;
    nextBtn.style.cssText = 'margin-left:auto; text-align:right;';
    nextBtn.setAttribute('aria-label', 'Next tool: ' + nextTool.name);
    const nl = document.createElement('span');
    nl.className = 'step-nav-label';
    nl.textContent = 'Next Tool →';
    const nt = document.createElement('span');
    nt.className = 'step-nav-title';
    nt.textContent = nextTool.name;
    nextBtn.append(nl, nt);
    stepNav.appendChild(nextBtn);
  }

  main.appendChild(stepNav);
  frag.appendChild(main);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};

/* ─── All Tools List Page ────────────────────────────────────────────── */
window.renderToolsList = function(container) {
  const data = window.SEMI_DATA;
  const frag = document.createDocumentFragment();

  const hero = document.createElement('div');
  hero.style.cssText = 'padding:5rem 0 3rem; border-bottom:1px solid rgba(255,255,255,0.06);';
  const heroInner = document.createElement('div');
  heroInner.className = 'container page-enter';
  const lbl = document.createElement('span');
  lbl.className = 'section-label';
  lbl.textContent = 'Metrology & Quality Control';
  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:clamp(2rem,5vw,3.5rem); font-weight:900; letter-spacing:-0.03em; margin-bottom:1rem;';
  h1.textContent = 'Inspection & Metrology Tools';
  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.55); max-width:560px; line-height:1.75;';
  sub.textContent = 'Every manufacturing step demands rigorous measurement and inspection. Explore the instruments that ensure sub-nanometer precision across a 300mm wafer.';
  heroInner.append(lbl, h1, sub);
  hero.appendChild(heroInner);
  frag.appendChild(hero);

  const main = document.createElement('main');
  main.className = 'container page-enter';
  main.style.cssText = 'padding-top:3rem; padding-bottom:4rem;';

  // Inspection group
  const inspLabel = document.createElement('h2');
  inspLabel.style.cssText = 'font-size:1.2rem; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:0.05em; text-transform:uppercase; font-size:0.8rem; font-family:var(--mono); margin-bottom:1rem;';
  inspLabel.textContent = '— Defect Inspection Systems';
  main.appendChild(inspLabel);

  const inspGrid = document.createElement('div');
  inspGrid.className = 'tools-grid';
  inspGrid.style.marginBottom = '3rem';

  data.tools.filter(t => t.category === 'Inspection').forEach(tool => {
    inspGrid.appendChild(buildToolCard(tool));
  });
  main.appendChild(inspGrid);

  const metrLabel = document.createElement('h2');
  metrLabel.style.cssText = 'font-size:0.8rem; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:0.05em; text-transform:uppercase; font-family:var(--mono); margin-bottom:1rem;';
  metrLabel.textContent = '— Metrology & Measurement Systems';
  main.appendChild(metrLabel);

  const metrGrid = document.createElement('div');
  metrGrid.className = 'tools-grid';
  data.tools.filter(t => t.category === 'Metrology').forEach(tool => {
    metrGrid.appendChild(buildToolCard(tool));
  });
  main.appendChild(metrGrid);

  frag.appendChild(main);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};

function buildToolCard(tool) {
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

  const badge = document.createElement('span');
  badge.className = tool.category === 'Inspection' ? 'badge badge-orange' : 'badge badge-cyan';
  badge.style.marginTop = '0.6rem';
  badge.textContent = tool.category;

  card.append(icon, name, full, badge);
  return card;
}

/* ─── Tool Diagram Builder ───────────────────────────────────────────── */
function buildDiagram(tool) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:2rem; display:flex; align-items:center; justify-content:center; gap:2rem; flex-wrap:wrap; min-height:200px;';

  // Build schematic SVG diagram based on tool type
  const diagrams = {
    'cd-sem': buildSEMDiagram,
    'ellipsometer': buildEllipsometerDiagram,
    'overlay-sem': buildOverlayDiagram,
    'optical-wafer-inspection': buildOpticalInspDiagram,
    'ebeam-inspection': buildEBeamDiagram,
    'xrd': buildXRDDiagram,
    'aoi': buildAOIDiagram,
    'profilometer': buildProfilometerDiagram,
    'xray-inspection': buildXRayDiagram,
    'dopant-profiler': buildSIMSDiagram,
  };

  const fn = diagrams[tool.id] || buildGenericDiagram;
  const svgEl = fn(tool);
  wrapper.appendChild(svgEl);

  const caption = document.createElement('p');
  caption.style.cssText = 'text-align:center; font-family:var(--mono); font-size:0.7rem; color:rgba(255,255,255,0.3); margin-top:1rem; letter-spacing:0.1em; text-transform:uppercase;';
  caption.textContent = tool.fullName + ' — Schematic';

  const outer = document.createElement('div');
  outer.append(wrapper, caption);
  return outer;
}

/* ─── SVG Diagram helpers (built safely via DOMParser) ──────────────── */
function parseSVG(svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  return document.importNode(doc.documentElement, true);
}

function buildSEMDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#4f8ef7"/></marker></defs>
    <rect width="320" height="180" fill="none"/>
    <!-- Electron gun -->
    <rect x="130" y="10" width="60" height="30" rx="6" fill="rgba(79,142,247,0.15)" stroke="#4f8ef7" stroke-width="1.5"/>
    <text x="160" y="30" text-anchor="middle" fill="#93b8ff" font-size="10" font-family="monospace">e⁻ GUN</text>
    <!-- Beam -->
    <line x1="155" y1="40" x2="140" y2="120" stroke="#4f8ef7" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#arr)"/>
    <line x1="165" y1="40" x2="180" y2="120" stroke="#4f8ef7" stroke-width="1.5" stroke-dasharray="4,2"/>
    <line x1="160" y1="40" x2="160" y2="120" stroke="#67e8f9" stroke-width="2" marker-end="url(#arr)"/>
    <!-- Lens -->
    <ellipse cx="160" cy="80" rx="30" ry="8" fill="rgba(103,232,249,0.1)" stroke="#67e8f9" stroke-width="1.5"/>
    <text x="200" y="83" fill="#67e8f9" font-size="9" font-family="monospace">OBJECTIVE LENS</text>
    <!-- Wafer surface -->
    <rect x="80" y="130" width="160" height="20" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="160" y="145" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10" font-family="monospace">WAFER SURFACE</text>
    <!-- Secondary electrons -->
    <line x1="155" y1="128" x2="100" y2="100" stroke="#f97316" stroke-width="1" stroke-dasharray="3,2" marker-end="url(#arr)"/>
    <text x="60" y="97" fill="#f97316" font-size="9" font-family="monospace">SE DETECTOR</text>
    <!-- CD measurement -->
    <line x1="105" y1="158" x2="215" y2="158" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="105" y1="153" x2="105" y2="163" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="215" y1="153" x2="215" y2="163" stroke="#22c55e" stroke-width="1.5"/>
    <text x="160" y="173" text-anchor="middle" fill="#22c55e" font-size="9" font-family="monospace">CD MEASUREMENT</text>
  </svg>`);
}

function buildEllipsometerDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <defs><marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#67e8f9"/></marker></defs>
    <rect width="320" height="180" fill="none"/>
    <!-- Light source -->
    <rect x="10" y="60" width="55" height="30" rx="6" fill="rgba(103,232,249,0.12)" stroke="#67e8f9" stroke-width="1.5"/>
    <text x="37" y="79" text-anchor="middle" fill="#67e8f9" font-size="9" font-family="monospace">LIGHT SOURCE</text>
    <!-- Polarizer -->
    <rect x="75" y="66" width="40" height="18" rx="4" fill="rgba(168,85,247,0.15)" stroke="#d8b4fe" stroke-width="1.5"/>
    <text x="95" y="78" text-anchor="middle" fill="#d8b4fe" font-size="8" font-family="monospace">POLARIZER</text>
    <!-- Incident beam -->
    <line x1="115" y1="75" x2="155" y2="110" stroke="#67e8f9" stroke-width="2" marker-end="url(#arr2)"/>
    <text x="120" y="85" fill="#67e8f9" font-size="8" font-family="monospace">ψ,Δ</text>
    <!-- Film stack -->
    <rect x="145" y="115" width="80" height="12" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    <rect x="145" y="127" width="80" height="20" rx="2" fill="rgba(79,142,247,0.15)" stroke="#4f8ef7" stroke-width="1"/>
    <text x="185" y="124" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8" font-family="monospace">SiO₂ FILM</text>
    <text x="185" y="141" text-anchor="middle" fill="#93b8ff" font-size="8" font-family="monospace">Si SUBSTRATE</text>
    <!-- Reflected beam -->
    <line x1="165" y1="113" x2="205" y2="78" stroke="#f97316" stroke-width="2" marker-end="url(#arr2)"/>
    <!-- Analyzer + Detector -->
    <rect x="208" y="66" width="40" height="18" rx="4" fill="rgba(249,115,22,0.15)" stroke="#fdba74" stroke-width="1.5"/>
    <text x="228" y="78" text-anchor="middle" fill="#fdba74" font-size="8" font-family="monospace">ANALYZER</text>
    <rect x="258" y="60" width="50" height="30" rx="6" fill="rgba(34,197,94,0.12)" stroke="#86efac" stroke-width="1.5"/>
    <text x="283" y="79" text-anchor="middle" fill="#86efac" font-size="9" font-family="monospace">DETECTOR</text>
    <!-- Thickness label -->
    <line x1="145" y1="108" x2="125" y2="108" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="145" y1="147" x2="125" y2="147" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="130" y1="108" x2="130" y2="147" stroke="#22c55e" stroke-width="1.5"/>
    <text x="110" y="132" fill="#22c55e" font-size="9" font-family="monospace" text-anchor="middle">t</text>
  </svg>`);
}

function buildOverlayDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="none"/>
    <!-- Layer 1 mark -->
    <rect x="80" y="60" width="70" height="70" fill="none" stroke="#4f8ef7" stroke-width="2"/>
    <text x="115" y="54" text-anchor="middle" fill="#4f8ef7" font-size="9" font-family="monospace">LAYER N-1</text>
    <!-- Layer 2 mark (offset) -->
    <rect x="90" y="70" width="50" height="50" fill="rgba(103,232,249,0.1)" stroke="#67e8f9" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="115" y="138" text-anchor="middle" fill="#67e8f9" font-size="9" font-family="monospace">LAYER N</text>
    <!-- Overlay vector -->
    <line x1="115" y1="95" x2="128" y2="95" stroke="#f97316" stroke-width="2"/>
    <line x1="115" y1="95" x2="115" y2="108" stroke="#f97316" stroke-width="2"/>
    <text x="138" y="99" fill="#f97316" font-size="10" font-family="monospace">Δx</text>
    <text x="108" y="120" fill="#f97316" font-size="10" font-family="monospace">Δy</text>
    <!-- Target -->
    <text x="230" y="55" fill="rgba(255,255,255,0.6)" font-size="9" font-family="monospace">SPEC: &lt;0.3nm</text>
    <circle cx="245" cy="90" r="35" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <circle cx="245" cy="90" r="20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <circle cx="245" cy="90" r="8" fill="none" stroke="#4f8ef7" stroke-width="1.5"/>
    <circle cx="248" cy="88" r="3" fill="#f97316"/>
    <text x="245" y="140" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">OVERLAY ERROR</text>
  </svg>`);
}

function buildOpticalInspDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="none"/>
    <!-- Laser source -->
    <rect x="20" y="20" width="60" height="28" rx="6" fill="rgba(103,232,249,0.12)" stroke="#67e8f9" stroke-width="1.5"/>
    <text x="50" y="33" text-anchor="middle" fill="#67e8f9" font-size="9" font-family="monospace">193nm LASER</text>
    <text x="50" y="43" text-anchor="middle" fill="#67e8f9" font-size="8" font-family="monospace">SOURCE</text>
    <!-- Beam splitter -->
    <rect x="98" y="25" width="24" height="18" rx="3" fill="rgba(168,85,247,0.15)" stroke="#d8b4fe" stroke-width="1.5" transform="rotate(-45,110,34)"/>
    <!-- Down beam to wafer -->
    <line x1="110" y1="42" x2="110" y2="110" stroke="#67e8f9" stroke-width="1.5" stroke-dasharray="4,2"/>
    <!-- Wafer -->
    <rect x="60" y="115" width="200" height="18" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="160" y="128" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9" font-family="monospace">300mm WAFER</text>
    <!-- Defect scatter -->
    <circle cx="140" cy="115" r="3" fill="#ef4444"/>
    <line x1="140" y1="112" x2="90" y2="80" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="140" y1="112" x2="200" y2="70" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="80" y="77" fill="#ef4444" font-size="8" font-family="monospace">DEFECT SCATTER</text>
    <!-- Detectors -->
    <rect x="200" y="55" width="70" height="28" rx="6" fill="rgba(34,197,94,0.12)" stroke="#86efac" stroke-width="1.5"/>
    <text x="235" y="68" text-anchor="middle" fill="#86efac" font-size="9" font-family="monospace">DARKFIELD</text>
    <text x="235" y="78" text-anchor="middle" fill="#86efac" font-size="8" font-family="monospace">DETECTOR</text>
    <!-- Scan arrow -->
    <line x1="60" y1="148" x2="260" y2="148" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="160" y="165" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="9" font-family="monospace">SCAN DIRECTION →</text>
  </svg>`);
}

function buildEBeamDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="180" viewBox="0 0 280 180">
    <rect width="280" height="180" fill="none"/>
    <rect x="105" y="5" width="70" height="28" rx="6" fill="rgba(79,142,247,0.15)" stroke="#4f8ef7" stroke-width="1.5"/>
    <text x="140" y="22" text-anchor="middle" fill="#93b8ff" font-size="9" font-family="monospace">e⁻ COLUMN</text>
    <polygon points="130,33 150,33 145,100 135,100" fill="rgba(79,142,247,0.1)" stroke="#4f8ef7" stroke-width="1"/>
    <line x1="140" y1="33" x2="140" y2="100" stroke="#4f8ef7" stroke-width="2"/>
    <rect x="70" y="105" width="140" height="20" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <rect x="100" y="100" width="12" height="8" rx="2" fill="rgba(239,68,68,0.4)" stroke="#fca5a5" stroke-width="1"/>
    <text x="113" y="96" fill="#fca5a5" font-size="8" font-family="monospace">DEFECT</text>
    <line x1="100" y1="103" x2="40" y2="80" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="112" y1="100" x2="60" y2="65" stroke="#f97316" stroke-width="1" stroke-dasharray="3,2"/>
    <rect x="10" y="52" width="55" height="22" rx="4" fill="rgba(249,115,22,0.15)" stroke="#fdba74" stroke-width="1.5"/>
    <text x="37" y="67" text-anchor="middle" fill="#fdba74" font-size="8" font-family="monospace">SE DETECTOR</text>
    <text x="140" y="140" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">VOLTAGE CONTRAST IMAGING</text>
    <text x="140" y="152" text-anchor="middle" fill="rgba(239,68,68,0.6)" font-size="8" font-family="monospace">Detects open/short circuits</text>
  </svg>`);
}

function buildXRDDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="none"/>
    <rect x="10" y="55" width="55" height="28" rx="5" fill="rgba(239,68,68,0.12)" stroke="#fca5a5" stroke-width="1.5"/>
    <text x="37" y="67" text-anchor="middle" fill="#fca5a5" font-size="9" font-family="monospace">X-RAY</text>
    <text x="37" y="77" text-anchor="middle" fill="#fca5a5" font-size="8" font-family="monospace">SOURCE</text>
    <line x1="65" y1="69" x2="130" y2="100" stroke="#fca5a5" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="82" y="78" fill="#fca5a5" font-size="8" font-family="monospace">θ</text>
    <rect x="100" y="105" width="140" height="16" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="170" y="118" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9" font-family="monospace">CRYSTAL PLANES (d-spacing)</text>
    <line x1="140" y1="103" x2="215" y2="65" stroke="#4f8ef7" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="190" y="78" fill="#4f8ef7" font-size="8" font-family="monospace">2θ</text>
    <rect x="215" y="50" width="55" height="28" rx="5" fill="rgba(79,142,247,0.12)" stroke="#4f8ef7" stroke-width="1.5"/>
    <text x="242" y="62" text-anchor="middle" fill="#93b8ff" font-size="9" font-family="monospace">DETECTOR</text>
    <text x="242" y="72" text-anchor="middle" fill="#93b8ff" font-size="8" font-family="monospace">2θ-scan</text>
    <text x="140" y="140" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">Bragg's Law: nλ = 2d·sinθ</text>
  </svg>`);
}

function buildAOIDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="none"/>
    <rect x="90" y="5" width="100" height="28" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="140" y="23" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="10" font-family="monospace">CAMERA ARRAY</text>
    <line x1="110" y1="33" x2="110" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="140" y1="33" x2="140" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="170" y1="33" x2="170" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
    <rect x="50" y="80" width="200" height="22" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <circle cx="100" cy="91" r="4" fill="#ef4444"/>
    <text x="100" y="115" text-anchor="middle" fill="#ef4444" font-size="8" font-family="monospace">DEFECT</text>
    <circle cx="180" cy="91" r="3" fill="#22c55e"/>
    <text x="180" y="115" text-anchor="middle" fill="#22c55e" font-size="8" font-family="monospace">OK</text>
    <rect x="90" y="5" width="20" height="10" rx="2" fill="rgba(103,232,249,0.3)" stroke="#67e8f9" stroke-width="1"/>
    <text x="140" y="145" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">5-15 μm/pixel resolution</text>
  </svg>`);
}

function buildProfilometerDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="none"/>
    <line x1="40" y1="30" x2="150" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <line x1="150" y1="30" x2="150" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <line x1="150" y1="80" x2="240" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <text x="160" y="140" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9" font-family="monospace">SURFACE PROFILE</text>
    <circle cx="110" cy="25" r="5" fill="#4f8ef7"/>
    <line x1="110" y1="10" x2="110" y2="25" stroke="#4f8ef7" stroke-width="2"/>
    <rect x="90" y="2" width="40" height="10" rx="3" fill="rgba(79,142,247,0.2)" stroke="#4f8ef7" stroke-width="1"/>
    <text x="110" y="10" text-anchor="middle" fill="#93b8ff" font-size="7" font-family="monospace">STYLUS</text>
    <line x1="40" y1="30" x2="40" y2="80" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="150" y1="80" x2="40" y2="80" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="28" y="57" fill="#22c55e" font-size="10" font-family="monospace">h</text>
    <text x="95" y="100" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8" font-family="monospace">Step height measurement</text>
    <text x="95" y="112" text-anchor="middle" fill="#22c55e" font-size="8" font-family="monospace">±1 nm accuracy</text>
  </svg>`);
}

function buildXRayDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="none"/>
    <rect x="10" y="40" width="60" height="35" rx="6" fill="rgba(239,68,68,0.12)" stroke="#fca5a5" stroke-width="1.5"/>
    <text x="40" y="57" text-anchor="middle" fill="#fca5a5" font-size="9" font-family="monospace">X-RAY</text>
    <text x="40" y="67" text-anchor="middle" fill="#fca5a5" font-size="8" font-family="monospace">SOURCE</text>
    <line x1="70" y1="57" x2="130" y2="57" stroke="#fca5a5" stroke-width="2" stroke-dasharray="5,2"/>
    <rect x="115" y="42" width="70" height="90" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <rect x="125" y="55" width="50" height="12" rx="2" fill="rgba(79,142,247,0.2)" stroke="#4f8ef7" stroke-width="1"/>
    <rect x="125" y="70" width="50" height="8" rx="2" fill="rgba(103,232,249,0.15)" stroke="#67e8f9" stroke-width="1"/>
    <rect x="125" y="82" width="50" height="25" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="150" y="100" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="7" font-family="monospace">PACKAGE</text>
    <line x1="185" y1="57" x2="245" y2="57" stroke="#4f8ef7" stroke-width="2" stroke-dasharray="5,2"/>
    <rect x="245" y="40" width="30" height="35" rx="5" fill="rgba(79,142,247,0.12)" stroke="#4f8ef7" stroke-width="1.5"/>
    <text x="260" y="61" text-anchor="middle" fill="#93b8ff" font-size="8" font-family="monospace">DET</text>
    <text x="150" y="148" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">Non-destructive internal inspection</text>
  </svg>`);
}

function buildSIMSDiagram() {
  return parseSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
    <rect width="280" height="160" fill="none"/>
    <rect x="10" y="45" width="55" height="28" rx="5" fill="rgba(249,115,22,0.12)" stroke="#fdba74" stroke-width="1.5"/>
    <text x="37" y="57" text-anchor="middle" fill="#fdba74" font-size="9" font-family="monospace">Cs⁺ PRIMARY</text>
    <text x="37" y="67" text-anchor="middle" fill="#fdba74" font-size="8" font-family="monospace">ION BEAM</text>
    <line x1="65" y1="59" x2="130" y2="90" stroke="#fdba74" stroke-width="2"/>
    <rect x="100" y="95" width="140" height="40" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <line x1="120" y1="95" x2="120" y2="72" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="140" y1="95" x2="160" y2="62" stroke="#4f8ef7" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="160" y1="95" x2="200" y2="55" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3,2"/>
    <rect x="220" y="40" width="55" height="28" rx="5" fill="rgba(34,197,94,0.12)" stroke="#86efac" stroke-width="1.5"/>
    <text x="247" y="52" text-anchor="middle" fill="#86efac" font-size="9" font-family="monospace">MASS</text>
    <text x="247" y="62" text-anchor="middle" fill="#86efac" font-size="8" font-family="monospace">SPECTROMETER</text>
    <text x="170" y="148" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="monospace">Secondary ions analyzed by mass/charge</text>
  </svg>`);
}

function buildGenericDiagram(tool) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '120');
  svg.setAttribute('viewBox', '0 0 200 120');
  const iconEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  iconEl.setAttribute('x', '100');
  iconEl.setAttribute('y', '65');
  iconEl.setAttribute('text-anchor', 'middle');
  iconEl.setAttribute('font-size', '48');
  iconEl.textContent = tool.icon;
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', '100');
  label.setAttribute('y', '95');
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('fill', 'rgba(255,255,255,0.3)');
  label.setAttribute('font-size', '10');
  label.setAttribute('font-family', 'monospace');
  label.textContent = tool.name;
  svg.append(iconEl, label);
  return svg;
}

/* ─── Section helper ─────────────────────────────────────────────────── */
function makeSection(label, title) {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom:3.5rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.06);';
  const lbl = document.createElement('span');
  lbl.className = 'section-label';
  lbl.textContent = label;
  const h2 = document.createElement('h2');
  h2.style.cssText = 'font-size:clamp(1.2rem,3vw,1.6rem); font-weight:800; letter-spacing:-0.02em; margin-bottom:1.5rem; color:#fff;';
  h2.textContent = title;
  section.append(lbl, h2);
  return section;
}

function render404Tool(type, slug) {
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
