/* ─── pages/companies.js — Companies Directory Page ─────────────────────
   Security: All text via textContent. No user input reflected.
   ────────────────────────────────────────────────────────────────────────── */

window.renderCompanies = function(container) {
  const data = window.SEMI_DATA;
  const frag = document.createDocumentFragment();

  /* ── HERO ──────────────────────────────────────────────────────────── */
  const hero = document.createElement('div');
  hero.style.cssText = 'padding:5rem 0 3rem; border-bottom:1px solid rgba(255,255,255,0.06);';
  const heroInner = document.createElement('div');
  heroInner.className = 'container page-enter';

  const lbl = document.createElement('span');
  lbl.className = 'section-label';
  lbl.textContent = 'Global Industry Ecosystem';

  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:clamp(2rem,5vw,3.5rem); font-weight:900; letter-spacing:-0.03em; margin-bottom:1rem; line-height:1.1;';
  h1.textContent = 'Semiconductor Companies & Equipment Suppliers';

  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.55); max-width:600px; line-height:1.8; margin-bottom:2rem;';
  sub.textContent = 'The semiconductor industry is a $500B+ global ecosystem requiring extreme specialization. Total capital equipment market exceeds $120B annually. Explore the foundries that manufacture chips and the equipment companies that make fabrication possible.';

  // Market stat cards
  const statsRow = document.createElement('div');
  statsRow.style.cssText = 'display:flex; flex-wrap:wrap; gap:1.25rem; margin-top:1rem;';

  [
    { v: '$500B+', l: 'Global Industry Size' },
    { v: '$120B+', l: 'Equipment Market' },
    { v: '55%', l: 'TSMC Market Share' },
    { v: '40M', l: 'Wafers/Month Capacity' },
  ].forEach(s => {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1rem 1.5rem; min-width:130px;';
    const val = document.createElement('div');
    val.style.cssText = 'font-family:var(--mono); font-size:1.5rem; font-weight:700; color:#fff; letter-spacing:-0.02em;';
    val.textContent = s.v;
    const lbl2 = document.createElement('div');
    lbl2.style.cssText = 'font-size:0.78rem; color:rgba(255,255,255,0.4); margin-top:0.2rem;';
    lbl2.textContent = s.l;
    card.append(val, lbl2);
    statsRow.appendChild(card);
  });

  heroInner.append(lbl, h1, sub, statsRow);
  hero.appendChild(heroInner);
  frag.appendChild(hero);

  /* ── MAIN ─────────────────────────────────────────────────────────── */
  const main = document.createElement('main');
  main.className = 'container page-enter';
  main.style.cssText = 'padding-top:3.5rem; padding-bottom:4rem;';

  /* ── FOUNDRIES ─────────────────────────────────────────────────── */
  const foundryLabel = document.createElement('span');
  foundryLabel.className = 'section-label';
  foundryLabel.textContent = 'Chip Manufacturers';
  const foundryTitle = document.createElement('h2');
  foundryTitle.style.cssText = 'font-size:clamp(1.4rem,3vw,2rem); font-weight:800; letter-spacing:-0.02em; color:#fff; margin-bottom:0.5rem;';
  foundryTitle.textContent = 'Semiconductor Foundries & IDMs';
  const foundryDesc = document.createElement('p');
  foundryDesc.style.cssText = 'font-size:0.9rem; color:rgba(255,255,255,0.5); margin-bottom:2rem; line-height:1.7;';
  foundryDesc.textContent = 'Pure-play foundries manufacture chips for fabless companies, while Integrated Device Manufacturers (IDMs) design and fabricate their own chips.';
  main.append(foundryLabel, foundryTitle, foundryDesc);

  const foundryGrid = document.createElement('div');
  foundryGrid.className = 'companies-grid';
  foundryGrid.style.marginBottom = '4rem';

  data.companies.foundries.forEach(co => {
    foundryGrid.appendChild(buildCompanyCard(co, 'foundry'));
  });
  main.appendChild(foundryGrid);

  // Divider
  const divider = document.createElement('hr');
  divider.style.cssText = 'border:none; border-top:1px solid rgba(255,255,255,0.06); margin-bottom:3.5rem;';
  main.appendChild(divider);

  /* ── EQUIPMENT SUPPLIERS ───────────────────────────────────────── */
  const eqLabel = document.createElement('span');
  eqLabel.className = 'section-label';
  eqLabel.textContent = 'Equipment & Materials';
  const eqTitle = document.createElement('h2');
  eqTitle.style.cssText = 'font-size:clamp(1.4rem,3vw,2rem); font-weight:800; letter-spacing:-0.02em; color:#fff; margin-bottom:0.5rem;';
  eqTitle.textContent = 'Inspection & Equipment Manufacturers';
  const eqDesc = document.createElement('p');
  eqDesc.style.cssText = 'font-size:0.9rem; color:rgba(255,255,255,0.5); margin-bottom:2rem; line-height:1.7;';
  eqDesc.textContent = 'Semiconductor equipment companies supply the tools that enable chip fabrication. Without ASML\'s EUV scanners or KLA\'s inspection systems, advanced chip manufacturing would be impossible.';
  main.append(eqLabel, eqTitle, eqDesc);

  const eqGrid = document.createElement('div');
  eqGrid.className = 'companies-grid';

  data.companies.equipment.forEach(co => {
    eqGrid.appendChild(buildCompanyCard(co, 'equipment'));
  });
  main.appendChild(eqGrid);

  /* ── SUPPLY CHAIN SECTION ──────────────────────────────────────── */
  const scDivider = document.createElement('hr');
  scDivider.style.cssText = 'border:none; border-top:1px solid rgba(255,255,255,0.06); margin:3.5rem 0;';
  main.appendChild(scDivider);

  const scLabel = document.createElement('span');
  scLabel.className = 'section-label';
  scLabel.textContent = 'Industry Economics';
  const scTitle = document.createElement('h2');
  scTitle.style.cssText = 'font-size:clamp(1.4rem,3vw,2rem); font-weight:800; letter-spacing:-0.02em; color:#fff; margin-bottom:0.5rem;';
  scTitle.textContent = 'Fab Economics & Cost Structure';
  main.append(scLabel, scTitle);

  const fabEcon = document.createElement('div');
  fabEcon.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.25rem; margin-top:2rem;';

  const econData = [
    { icon: '🏭', title: 'EUV Lithography Tool', value: '$150–200M', desc: 'Single ASML EUV scanner — most complex machine ever built, 100,000+ components' },
    { icon: '🔬', title: 'Complete Fab Equipment', value: '$15–25B', desc: 'Full set of equipment for a leading-edge 300mm wafer fab' },
    { icon: '🏗️', title: 'Fab Construction', value: '$5–15B', desc: 'Cleanroom facility construction cost for a greenfield semiconductor fab' },
    { icon: '💎', title: 'Cost Per 300mm Wafer', value: '$500–1,500', desc: 'All-in manufacturing cost including equipment, chemicals, labor, utilities' },
    { icon: '📊', title: 'Mature Node Yield', value: '80–95%', desc: 'Percentage of dies passing all electrical tests at nodes above 28nm' },
    { icon: '⚡', title: 'Advanced Node Yield', value: '30–60%', desc: 'Cutting-edge ≤5nm node yield during ramp; improves to 80%+ at maturity' },
    { icon: '⏱️', title: 'Design-to-Production', value: '2–3 years', desc: 'Time from chip design tape-out to production-ready manufacturing process' },
    { icon: '🔄', title: 'Manufacturing Lead Time', value: '12–16 weeks', desc: 'Time from wafer start to finished packaged chip ready for shipment' },
  ];

  econData.forEach(item => {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.25rem;';
    const iconEl = document.createElement('div');
    iconEl.style.cssText = 'font-size:1.5rem; margin-bottom:0.75rem;';
    iconEl.textContent = item.icon;
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size:0.78rem; color:rgba(255,255,255,0.4); letter-spacing:0.05em; margin-bottom:0.3rem; text-transform:uppercase; font-family:var(--mono);';
    titleEl.textContent = item.title;
    const valueEl = document.createElement('div');
    valueEl.style.cssText = 'font-size:1.4rem; font-weight:800; font-family:var(--mono); color:#fff; margin-bottom:0.5rem; letter-spacing:-0.02em;';
    valueEl.textContent = item.value;
    const descEl = document.createElement('p');
    descEl.style.cssText = 'font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.6;';
    descEl.textContent = item.desc;
    card.append(iconEl, titleEl, valueEl, descEl);
    fabEcon.appendChild(card);
  });
  main.appendChild(fabEcon);

  frag.appendChild(main);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};

/* ─── Company Card Builder ───────────────────────────────────────────── */
function buildCompanyCard(co, type) {
  const card = document.createElement('div');
  card.className = 'company-card';
  card.style.cssText = 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:1.5rem; transition:all 0.3s ease; position:relative; overflow:hidden;';

  // Top accent line
  const accent = document.createElement('div');
  accent.style.cssText = 'position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, rgba(79,142,247,0.4), transparent); opacity:0; transition:opacity 0.3s;';
  card.appendChild(accent);

  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'rgba(255,255,255,0.18)';
    card.style.background = 'rgba(255,255,255,0.07)';
    card.style.transform = 'translateY(-3px)';
    card.style.boxShadow = '0 12px 48px rgba(0,0,0,0.6)';
    accent.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = 'rgba(255,255,255,0.1)';
    card.style.background = 'rgba(255,255,255,0.04)';
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
    accent.style.opacity = '0';
  });

  const header = document.createElement('div');
  header.style.cssText = 'display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;';

  const flagEl = document.createElement('div');
  flagEl.style.cssText = 'font-size:2rem; line-height:1; flex-shrink:0;';
  flagEl.textContent = co.flag || '🏢';

  const info = document.createElement('div');
  info.style.flex = '1';

  const nameEl = document.createElement('div');
  nameEl.style.cssText = 'font-size:1.1rem; font-weight:700; color:#fff; margin-bottom:0.2rem;';
  nameEl.textContent = co.name;

  const fullEl = document.createElement('div');
  fullEl.style.cssText = 'font-size:0.78rem; color:rgba(255,255,255,0.4);';
  fullEl.textContent = co.fullName || co.country;

  if (co.marketCap) {
    const mcap = document.createElement('span');
    mcap.className = 'badge badge-white';
    mcap.style.marginTop = '0.4rem';
    mcap.textContent = co.marketCap;
    info.append(nameEl, fullEl, mcap);
  } else {
    info.append(nameEl, fullEl);
  }

  header.append(flagEl, info);

  const countryEl = document.createElement('div');
  countryEl.style.cssText = 'font-family:var(--mono); font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:0.75rem;';
  countryEl.textContent = co.country;

  const descEl = document.createElement('p');
  descEl.style.cssText = 'font-size:0.85rem; color:rgba(255,255,255,0.6); line-height:1.7; margin-bottom:1rem;';
  descEl.textContent = co.description;

  const tagsEl = document.createElement('div');
  tagsEl.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.4rem;';

  const specTag = document.createElement('span');
  specTag.className = 'chip';
  specTag.textContent = co.specialization;
  tagsEl.appendChild(specTag);

  if (co.keyProducts) {
    co.keyProducts.slice(0, 2).forEach(kp => {
      const t = document.createElement('span');
      t.className = 'chip';
      t.textContent = kp;
      tagsEl.appendChild(t);
    });
  }

  card.append(header, countryEl, descEl, tagsEl);
  return card;
}
