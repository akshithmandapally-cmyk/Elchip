/* ─── app.js — Hash Router, Navigation, Search, AI Assistant ─────────────
   Security:
   - All user search input rendered via textContent only (XSS safe)
   - No innerHTML with user-controlled data
   - Event listeners used instead of inline handlers
   - Navigation uses hash-based routing to avoid server-side concerns
   ────────────────────────────────────────────────────────────────────────── */

(function() {
  'use strict';

  /* ─── ROUTER ────────────────────────────────────────────────────────── */
  const routes = {
    '/':            () => window.renderHome(getApp()),
    '/process-flow':() => {
      window.renderHome(getApp());
      setTimeout(() => {
        const el = document.getElementById('process-flow');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    },
    '/process/:slug': (params) => window.renderProcess(getApp(), params.slug),
    '/tool/:slug':  (params) => window.renderTool(getApp(), params.slug),
    '/tools':       () => window.renderToolsList(getApp()),
    '/companies':   () => window.renderCompanies(getApp()),
    '/glossary':    () => render404Page(getApp()), // Glossary page removed
  };

  function getApp() {
    const app = document.getElementById('app');
    app.replaceChildren(); // Security: safe DOM clear
    return app;
  }

  function matchRoute(hash) {
    const path = hash.replace(/^#/, '') || '/';

    for (const pattern in routes) {
      if (pattern === path) {
        return { handler: routes[pattern], params: {} };
      }
      // Parametric match
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');
      if (patternParts.length !== pathParts.length) continue;

      const params = {};
      let matched = true;
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
        } else if (patternParts[i] !== pathParts[i]) {
          matched = false;
          break;
        }
      }
      if (matched) return { handler: routes[pattern], params };
    }
    return null;
  }

  function navigate() {
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close assistant panel upon route change to keep layout clean
    if (typeof toggleAssistPanel === 'function') {
      toggleAssistPanel(false);
    }

    // Page transition fade
    const app = document.getElementById('app');
    app.style.opacity = '0';
    app.style.transform = 'translateY(8px)';

    setTimeout(() => {
      const match = matchRoute(hash);
      if (match) {
        match.handler(match.params);
      } else {
        render404Page(getApp());
      }
      app.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      app.style.opacity = '1';
      app.style.transform = 'translateY(0)';

      // Update nav active state
      updateNavActive(hash);
    }, 120);
  }

  window.addEventListener('hashchange', navigate);
  window.addEventListener('load', navigate);

  /* ─── NAVIGATION BUILDER ────────────────────────────────────────────── */
  function buildNav() {
    const shell = document.getElementById('nav-shell');
    if (!shell) return;
    shell.replaceChildren();

    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    shell.appendChild(backdrop);

    const navEl = document.createElement('nav');
    navEl.setAttribute('role', 'navigation');
    navEl.setAttribute('aria-label', 'Main navigation');

    // Logo
    const logo = document.createElement('a');
    logo.className = 'nav-logo';
    logo.href = '#/';
    logo.setAttribute('aria-label', 'ELCHIP home');
    logo.textContent = 'ELCHIP';
    navEl.appendChild(logo);

    // Links (Glossary link removed)
    const ul = document.createElement('ul');
    ul.className = 'nav-links';
    ul.id = 'nav-links';

    const navItems = [
      { label: 'Process Flow', href: '#/process-flow' },
      { label: 'Tools', href: '#/tools' },
      { label: 'Companies', href: '#/companies' }
    ];

    navItems.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      a.setAttribute('data-href', item.href);
      li.appendChild(a);
      ul.appendChild(li);
    });
    navEl.appendChild(ul);

    // ── SEARCH ── redesigned as a prominent centered search bar
    const searchWrap = document.createElement('div');
    searchWrap.className = 'nav-search';
    searchWrap.setAttribute('role', 'search');

    // Search icon (static SVG via DOMParser)
    const svgDoc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'image/svg+xml'
    );
    searchWrap.appendChild(document.importNode(svgDoc.documentElement, true));

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'nav-search-input';

    // Rotate funny placeholders
    const navPlaceholders = [
      'Query Semiconductor Knowledge Base...',
      'Ask about photolithography...',
      'Search EUV, wafers, transistors...',
      'What is CMP or ALD?',
      'Find TSMC, ASML, KLA...',
      'Why does silicon need to be so pure?',
    ];
    let _navPlIdx = 0;
    searchInput.placeholder = navPlaceholders[0];
    setInterval(() => {
      _navPlIdx = (_navPlIdx + 1) % navPlaceholders.length;
      searchInput.placeholder = navPlaceholders[_navPlIdx];
    }, 4000);

    searchInput.setAttribute('aria-label', 'Search the platform');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('spellcheck', 'false');
    searchWrap.appendChild(searchInput);

    // Keyboard shortcut hint
    const kbHint = document.createElement('span');
    kbHint.className = 'nav-search-kb';
    kbHint.textContent = '⌘K';
    kbHint.setAttribute('aria-hidden', 'true');
    searchWrap.appendChild(kbHint);

    const resultsDropdown = document.createElement('div');
    resultsDropdown.className = 'search-results';
    resultsDropdown.id = 'search-results';
    resultsDropdown.setAttribute('role', 'listbox');
    searchWrap.appendChild(resultsDropdown);

    navEl.appendChild(searchWrap);

    // Mobile Search Button
    const mobileSearchBtn = document.createElement('button');
    mobileSearchBtn.className = 'mobile-search-btn';
    mobileSearchBtn.id = 'mobile-search-btn';
    mobileSearchBtn.setAttribute('aria-label', 'Open search');
    const searchIconDoc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'image/svg+xml'
    );
    mobileSearchBtn.appendChild(document.importNode(searchIconDoc.documentElement, true));
    mobileSearchBtn.addEventListener('click', () => {
      openSearchOverlay('');
    });
    navEl.appendChild(mobileSearchBtn);

    // Hamburger
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle mobile menu');
    hamburger.setAttribute('aria-expanded', 'false');
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      hamburger.appendChild(span);
    }
    navEl.appendChild(hamburger);

    shell.appendChild(navEl);

    // Mobile nav
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobile-nav';
    mobileNav.setAttribute('role', 'dialog');
    mobileNav.setAttribute('aria-label', 'Mobile navigation');

    navItems.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      // Security: Event listener not inline onclick
      a.addEventListener('click', closeMobileNav);
      mobileNav.appendChild(a);
    });
    document.body.insertBefore(mobileNav, document.body.firstChild);

    // Hamburger toggle
    hamburger.addEventListener('click', toggleMobileNav);

    // Keyboard shortcut ⌘K / Ctrl+K
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    // Search handler — Security: renders only textContent, never innerHTML with input
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => performSearch(searchInput.value, resultsDropdown), 280);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length > 0) {
        resultsDropdown.classList.add('visible');
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchWrap.contains(e.target)) {
        resultsDropdown.classList.remove('visible');
      }
    });

    // Keyboard navigation in search
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        resultsDropdown.classList.remove('visible');
        searchInput.blur();
      } else if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q.length > 0) {
          resultsDropdown.classList.remove('visible');
          searchInput.value = '';
          openSearchOverlay(q);
        }
      }
    });

    updateNavActive(window.location.hash || '#/');
  }

  /* ── Wikipedia snippet fetch ───────────────────────────────────────── */
  async function fetchWikipediaResults(query) {
    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search' +
        '&srsearch=' + encodeURIComponent(query) +
        '&format=json&origin=*&utf8=1&srlimit=3';
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.query && data.query.search) || [];
    } catch (_e) {
      return [];
    }
  }

  /* ─── SEARCH ENGINE ─────────────────────────────────────────────────── */
  function performSearch(rawQuery, dropdown) {
    const query = rawQuery.trim().toLowerCase();

    if (query.length < 1) {
      dropdown.classList.remove('visible');
      return;
    }

    const data = window.SEMI_DATA;
    const internalResults = [];

    // Search processes
    data.steps.forEach(step => {
      if (
        step.title.toLowerCase().includes(query) ||
        step.shortDesc.toLowerCase().includes(query) ||
        step.slug.toLowerCase().includes(query)
      ) {
        internalResults.push({
          type: 'Process Step', icon: '⚙️',
          name: step.title,
          sub: 'Step ' + step.stepNumber,
          href: '#/process/' + step.slug
        });
      }
    });

    // Search tools
    data.tools.forEach(tool => {
      if (
        tool.name.toLowerCase().includes(query) ||
        tool.fullName.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query)
      ) {
        internalResults.push({
          type: 'Inspection Tool', icon: tool.icon || '🔬',
          name: tool.name,
          sub: tool.fullName,
          href: '#/tool/' + tool.slug
        });
      }
    });

    // Search companies
    [...data.companies.foundries, ...data.companies.equipment].forEach(co => {
      if (
        co.name.toLowerCase().includes(query) ||
        co.specialization.toLowerCase().includes(query) ||
        co.country.toLowerCase().includes(query)
      ) {
        internalResults.push({
          type: 'Company', icon: co.flag || '🏢',
          name: co.name,
          sub: co.country + ' · ' + (co.specialization || ''),
          href: '#/companies'
        });
      }
    });

    // Search glossary
    data.glossary.forEach(entry => {
      if (
        entry.term.toLowerCase().includes(query) ||
        entry.definition.toLowerCase().includes(query)
      ) {
        internalResults.push({
          type: 'Glossary', icon: '📖',
          name: entry.term,
          sub: entry.definition.substring(0, 52) + '…',
          glossaryTerm: entry.term,
          glossaryDef: entry.definition
        });
      }
    });

    // Curated videos matching query
    const matchedVideos = CURATED_VIDEOS.filter(v => {
      const q = query.toLowerCase();
      return v.title.toLowerCase().includes(q) ||
             v.desc.toLowerCase().includes(q) ||
             v.tags.some(tag => tag.includes(q));
    }).slice(0, 2).map(v => ({
      type: 'Video Guide', icon: '▶',
      name: v.title,
      sub: v.channel,
      videoId: v.videoId,
      videoTitle: v.title,
      videoChannel: v.channel
    }));

    let combined = [...internalResults, ...matchedVideos];

    // Show initial local results immediately
    renderHeaderDropdown(combined.slice(0, 7), dropdown, rawQuery, true);

    // Fetch Wikipedia asynchronously to augment dropdown
    const token = query;
    fetchWikipediaResults(query).then(wikiHits => {
      const live = document.getElementById('nav-search-input')?.value.trim().toLowerCase();
      if (live !== token) return;
      wikiHits.forEach(hit => {
        combined.push({
          type: 'Wikipedia', icon: '📖',
          name: hit.title,
          sub: 'Read encyclopedia article',
          wikiTitle: hit.title
        });
      });
      renderHeaderDropdown(combined.slice(0, 8), dropdown, rawQuery, false);
    });
  }

  function renderHeaderDropdown(results, dropdown, query, isLoading) {
    dropdown.replaceChildren();

    if (results.length === 0 && !isLoading) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No results. Press Enter to search everywhere.';
      dropdown.appendChild(empty);
      dropdown.classList.add('visible');
      return;
    }

    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '0');

      const iconEl = document.createElement('span');
      iconEl.className = 'search-result-icon';
      iconEl.textContent = result.icon;

      const text = document.createElement('div');
      text.className = 'search-result-text';

      const name = document.createElement('div');
      name.className = 'search-result-name';
      name.textContent = result.name;

      const sub = document.createElement('div');
      sub.className = 'search-result-type';
      sub.textContent = result.type + (result.sub ? ' · ' + result.sub : '');

      text.append(name, sub);
      item.append(iconEl, text);

      const handleSelect = () => {
        dropdown.classList.remove('visible');
        const input = document.getElementById('nav-search-input');
        if (input) input.value = '';

        if (result.href) {
          window.location.hash = result.href;
        } else if (result.glossaryTerm) {
          window.openGlossary(result.glossaryTerm, result.glossaryDef);
        } else if (result.wikiTitle) {
          openSearchOverlay(query);
          setTimeout(() => _openWikiReaderInUnified(result.wikiTitle), 350);
        } else if (result.videoId) {
          openSearchOverlay(query);
          setTimeout(() => _playVideoInApp(result.videoId, result.videoTitle, result.videoChannel), 350);
        }
      };

      item.addEventListener('click', handleSelect);
      item.addEventListener('keydown', e => { if (e.key === 'Enter') handleSelect(); });
      dropdown.appendChild(item);
    });

    if (isLoading) {
      const loader = document.createElement('div');
      loader.className = 'dropdown-external-loader';
      loader.textContent = 'Also searching Wikipedia...';
      dropdown.appendChild(loader);
    }

    const evBtn = document.createElement('div');
    evBtn.className = 'search-everywhere-btn';
    evBtn.setAttribute('role', 'button');
    evBtn.setAttribute('tabindex', '0');

    const evLabel = document.createElement('span');
    evLabel.textContent = 'Search everything for';

    const evQ = document.createElement('strong');
    evQ.style.cssText = 'margin-left:4px; color:#fff;';
    evQ.textContent = '"' + query + '"';

    const arr = document.createElement('span');
    arr.style.marginLeft = '4px';
    arr.textContent = '→';

    evBtn.append(evLabel, evQ, arr);
    evBtn.addEventListener('click', () => {
      dropdown.classList.remove('visible');
      const input = document.getElementById('nav-search-input');
      if (input) input.value = '';
      openSearchOverlay(query);
    });
    evBtn.addEventListener('keypress', e => { if (e.key === 'Enter') evBtn.click(); });
    dropdown.appendChild(evBtn);

    dropdown.classList.add('visible');
  }

  /* ─── NAV ACTIVE STATE ──────────────────────────────────────────────── */
  function updateNavActive(hash) {
    const links = document.querySelectorAll('#nav-links a');
    links.forEach(link => {
      const href = link.getAttribute('data-href');
      const isActive = hash === href ||
        (href === '#/process-flow' && hash.startsWith('#/process')) ||
        (href === '#/tools' && hash.startsWith('#/tool'));
      link.classList.toggle('active', isActive);
    });
  }

  /* ─── MOBILE NAV ────────────────────────────────────────────────────── */
  function toggleMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const btn = document.getElementById('hamburger');
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const btn = document.getElementById('hamburger');
    if (!nav) return;
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }



  /* ─── 404 PAGE ──────────────────────────────────────────────────────── */
  function render404Page(container) {
    const div = document.createElement('div');
    div.style.cssText = 'min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:4rem 1.5rem;';

    const code = document.createElement('div');
    code.style.cssText = 'font-family:var(--mono); font-size:6rem; font-weight:900; background:linear-gradient(135deg,#fff 30%,var(--cyan) 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:1rem; line-height:1;';
    code.textContent = '404';

    const msg = document.createElement('h1');
    msg.style.cssText = 'font-size:1.5rem; font-weight:700; color:#fff; margin-bottom:0.75rem;';
    msg.textContent = 'Page Not Found';

    const sub = document.createElement('p');
    sub.style.cssText = 'color:rgba(255,255,255,0.5); margin-bottom:2rem;';
    sub.textContent = 'The page you are looking for does not exist.';

    const link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.href = '#/';
    link.textContent = '← Return Home';

    div.append(code, msg, sub, link);
    container.appendChild(div);
    container.appendChild(window._buildFooter());
  }

  /* ─── LOADING SCREEN ────────────────────────────────────────────────── */
  function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 600);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     UNIFIED SEARCH OVERLAY
     One scrollable panel: Site Results → Wikipedia Snippets → Video Library
     Security: all user input inserted via textContent only
     ═══════════════════════════════════════════════════════════════════════ */

  let _searchOverlayEl = null;
  let _currentQuery = '';

  const FUNNY_PLACEHOLDERS = [
    "Why does my code compile but my wafer has defects?",
    "How to explain EUV lithography to a 5-year-old without crying",
    "Can I clean my processor with soap?",
    "Is sand really that expensive or are we just paying for the spice?",
    "Will AI replace chip designers or just make them drink more coffee?",
    "How to get into a cleanroom if I have a beard?",
    "Why ASML machines look like time travel devices",
    "Can I run Crysis on a silicon wafer?",
    "Looking for silicon valley but found actual silicon",
    "Is photoresist edible? (No, absolutely not)",
    "What happens if a dust particle lands on a wafer?",
    "How many transistors can fit on a pinhead?"
  ];

  const CURATED_VIDEOS = [
    {
      title: "How Microchips are Made",
      videoId: "g8SCA-3_p_0",
      channel: "Branch Education",
      desc: "A highly detailed, 3D animated walkthrough of the entire semiconductor fabrication process, explaining photolithography, deposition, and etching.",
      tags: ["process", "fabrication", "how", "made", "transistor", "lithography", "silicon", "microchip", "overview", "chip", "semiconductor", "manufacture", "what is"]
    },
    {
      title: "The Extreme Physics of EUV Lithography",
      videoId: "5Ge2R8l8oJk",
      channel: "Asianometry",
      desc: "An in-depth look at ASML's Extreme Ultraviolet (EUV) lithography systems, explaining how liquid tin droplets and lasers create 13.5nm light.",
      tags: ["euv", "lithography", "asml", "light", "exposure", "physics", "lens", "mirror", "extreme ultraviolet", "duv", "what is duv", "what is euv"]
    },
    {
      title: "How does a Transistor Work?",
      videoId: "IcrBqCFLHIY",
      channel: "Veritasium",
      desc: "A clear and visual explanation of semiconductors, p-n junctions, and how silicon transistors act as electronic switches.",
      tags: ["transistor", "semiconductor", "pn junction", "physics", "silicon", "switch", "mosfet", "how transistor works"]
    },
    {
      title: "Inside a Silicon Wafer Fab: Cleanroom Tour",
      videoId: "gXN-7rLp66w",
      channel: "Intel Corporation",
      desc: "Take a look inside Intel's state-of-the-art D1X factory in Oregon, showing the automated transport systems (AMHS) and cleanroom clothing.",
      tags: ["fab", "cleanroom", "intel", "wafer", "factory", "automation", "tour", "inside fab"]
    },
    {
      title: "Silicon Wafer Production: How Sand Becomes Wafers",
      videoId: "AMg4mX368L0",
      channel: "Shin-Etsu Silicon",
      desc: "Shows the step-by-step process of growing a single-crystal silicon ingot (Czochralski process) and slicing it into 300mm wafers.",
      tags: ["wafer", "silicon", "ingot", "czochralski", "slicing", "polishing", "crystal", "sand", "wafer preparation", "wafer making"]
    },
    {
      title: "What is Photolithography? Semiconductor Manufacturing 101",
      videoId: "7qJ4n3b_V8k",
      channel: "Applied Materials",
      desc: "A foundational introduction to the photolithography process: photoresist spin-coating, exposure through a photomask, and development.",
      tags: ["lithography", "photolithography", "photoresist", "mask", "exposure", "spin coating", "what is lithography", "what is photolithography"]
    },
    {
      title: "Chemical Mechanical Planarization (CMP) Explained",
      videoId: "3rR_rWc9T7s",
      channel: "Applied Materials",
      desc: "An educational animation demonstrating how chemical slurries and polishing pads planarize wafer surfaces to atomic flatness.",
      tags: ["cmp", "planarization", "polishing", "slurry", "chemical mechanical planarization", "what is cmp"]
    },
    {
      title: "Dry Etching and Wet Etching Processes",
      videoId: "T4bL8B4SjX0",
      channel: "Lam Research",
      desc: "A detailed breakdown of isotropic wet etching and anisotropic dry plasma etching processes used to carve microchip patterns.",
      tags: ["etching", "etch", "plasma", "dry etching", "wet etching", "anisotropic", "isotropic", "what is etching"]
    },
    {
      title: "Chemical Vapor Deposition (CVD) and Atomic Layer Deposition (ALD)",
      videoId: "kO3Q_JbE_bA",
      channel: "Lam Research",
      desc: "Explains how gaseous precursors react at wafer surfaces to deposit ultra-thin, conformal oxide and metal layers down to the atomic scale.",
      tags: ["deposition", "cvd", "ald", "thin film", "atomic layer deposition", "chemical vapor deposition", "what is ald", "what is cvd"]
    },
    {
      title: "Semiconductor Metrology & Inspection Systems",
      videoId: "9H5H3rXy6sQ",
      channel: "KLA Corporation",
      desc: "How optical and electron beam inspection systems detect sub-nanometer defects in high-volume semiconductor manufacturing.",
      tags: ["metrology", "inspection", "defect", "kla", "optical", "e-beam", "measuring", "what is metrology", "sem"]
    },
    {
      title: "Advanced IC Packaging & Heterogeneous Integration",
      videoId: "u9S0e4Uv4a0",
      channel: "ASE Group",
      desc: "Explains advanced packaging methods like system-in-package (SiP), 2.5D/3D stacking, and micro-bumps that connect multiple chiplets.",
      tags: ["packaging", "package", "chiplet", "wire bonding", "die", "stacking", "3d", "sip", "ic packaging", "what is packaging"]
    },
    {
      title: "How ASML Builds the World's Most Complex Machines",
      videoId: "dqV5U2iP514",
      channel: "CNBC",
      desc: "A documentary on the supply chain, precision engineering, and business strategy behind ASML's monopoly on lithography equipment.",
      tags: ["asml", "lithography", "euv", "duv", "company", "supply chain", "monopoly", "what is asml"]
    },
    {
      title: "Taiwan Semiconductor Manufacturing Company (TSMC) Fab Tour",
      videoId: "y1vA7W2O2Jk",
      channel: "TSMC",
      desc: "A look inside TSMC's GigaFabs, highlighting cleanroom automation, robotic wafer routing, and the scale of modern contract manufacturing.",
      tags: ["tsmc", "foundry", "fab", "gigafab", "taiwan", "contract manufacturing", "what is tsmc"]
    },
    {
      title: "Ion Implantation in Semiconductor Manufacturing",
      videoId: "Xc2QyHVnTis",
      channel: "Applied Materials",
      desc: "How ions of dopant atoms are accelerated and implanted into silicon wafers to create P-type and N-type regions for transistor formation.",
      tags: ["ion implantation", "doping", "dopant", "boron", "phosphorus", "arsenic", "implant", "what is ion implantation"]
    },
    {
      title: "Thermal Oxidation: Growing SiO2 on Silicon",
      videoId: "KMbGEuC0jIA",
      channel: "NPTEL",
      desc: "Explains the dry and wet thermal oxidation process to grow silicon dioxide (SiO2) layers — essential for gate oxides and isolation.",
      tags: ["oxidation", "thermal oxidation", "sio2", "oxide", "silicon dioxide", "gate oxide", "what is oxidation"]
    }
  ];

  const FUNNY_SUBTITLES = [
    "⚡ Silicon Query Processor v2.0 · Do not drop the wafer",
    "🔬 Aligning EUV lasers to 13.5nm accuracy...",
    "🧪 Scanning photoresist chemical formulations...",
    "📊 Calculating wafer yield... please do not sneeze in the cleanroom",
    "🏢 Querying ASML's secret database of EUV mirrors...",
    "⚙️ Polishing global topography with CMP slurry...",
    "⚡ Dopant energy levels set to 150 keV. Stand back.",
    "🔬 Defects detected: 0. Yield: 99.8%. Coffee level: Critical."
  ];

  function openSearchOverlay(query) {
    if (!_searchOverlayEl) _buildSearchOverlay();
    _currentQuery = query;

    // Pre-fill input
    const input = _searchOverlayEl.querySelector('#overlay-search-input');
    if (input) {
      input.value = query;
      const rand = FUNNY_PLACEHOLDERS[Math.floor(Math.random() * FUNNY_PLACEHOLDERS.length)];
      input.placeholder = rand;
    }

    // Set funny tagline
    const tagline = _searchOverlayEl.querySelector('#search-overlay-tagline');
    if (tagline) {
      const randSub = FUNNY_SUBTITLES[Math.floor(Math.random() * FUNNY_SUBTITLES.length)];
      tagline.textContent = randSub;
    }

    _searchOverlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (input) input.focus();

    if (query && query.trim().length > 0) {
      _runUnifiedSearch(query.trim());
    } else {
      _showSuggestions();
    }
  }

  function _closeSearchOverlay() {
    if (_searchOverlayEl) {
      _searchOverlayEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function _buildSearchOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search ELCHIP');

    /* ── Header ────────────────────────────────────────────────────── */
    const header = document.createElement('div');
    header.className = 'search-overlay-header';

    // Tagline
    const tagline = document.createElement('div');
    tagline.className = 'search-overlay-tagline';
    tagline.id = 'search-overlay-tagline';
    tagline.textContent = '⚡ Silicon Query Processor v2.0 · Do not drop the wafer';
    header.appendChild(tagline);

    // Search bar
    const bar = document.createElement('div');
    bar.className = 'search-overlay-bar';

    const svgDoc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'image/svg+xml'
    );
    bar.appendChild(document.importNode(svgDoc.documentElement, true));

    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'overlay-search-input';
    input.className = 'search-overlay-input';
    input.placeholder = 'Search everything about semiconductors…';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Search query');

    let _overlayDebounce;
    input.addEventListener('input', () => {
      clearTimeout(_overlayDebounce);
      _overlayDebounce = setTimeout(() => {
        _currentQuery = input.value.trim();
        if (_currentQuery.length > 0) {
          _runUnifiedSearch(_currentQuery);
        } else {
          _showSuggestions();
        }
      }, 350);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') _closeSearchOverlay();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'search-overlay-close';
    closeBtn.setAttribute('aria-label', 'Close search');
    
    const closeText = document.createElement('span');
    closeText.className = 'search-close-text';
    closeText.textContent = 'Close';
    
    const closeIcon = document.createElement('span');
    closeIcon.className = 'search-close-icon';
    closeIcon.textContent = '✕';
    
    closeBtn.append(closeText, closeIcon);
    closeBtn.addEventListener('click', _closeSearchOverlay);

    bar.append(input, closeBtn);

    // Status bar (shows what's loading/loaded)
    const statusBar = document.createElement('div');
    statusBar.className = 'search-status-bar';
    statusBar.id = 'search-status-bar';

    header.append(bar, statusBar);

    /* ── Unified result panel ──────────────────────────────────────── */
    const body = document.createElement('div');
    body.className = 'search-overlay-body';

    const unifiedPanel = document.createElement('div');
    unifiedPanel.id = 'unified-panel';
    unifiedPanel.className = 'unified-panel';
    body.appendChild(unifiedPanel);

    overlay.append(header, body);

    // Backdrop click
    overlay.addEventListener('click', e => {
      if (e.target === overlay) _closeSearchOverlay();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) _closeSearchOverlay();
    });

    document.body.appendChild(overlay);
    _searchOverlayEl = overlay;
  }

  /* ─── UNIFIED SEARCH — shows all results in one scrollable view ────── */
  async function _runUnifiedSearch(query) {
    const panel = document.getElementById('unified-panel');
    if (!panel) return;

    // Set status
    _setStatus('Searching...');

    // Build panel with sections
    panel.replaceChildren();

    // ── SECTION 1: Internal site results (instant) ──────────────────────
    const siteSection = _buildSiteResultsSection(query);
    panel.appendChild(siteSection);

    // ── SECTION 2: Web Summary, Literature & Papers ─────────────────────
    const webSection = document.createElement('div');
    webSection.className = 'unified-section';
    webSection.id = 'section-web';
    const webLabel = _makeSectionLabel('🌐 Web Knowledge & Research');
    const webContent = document.createElement('div');
    webContent.id = 'web-section-content';
    _setLoadingInEl(webContent, 'Gathering web data, literature, and papers...');
    webSection.append(webLabel, webContent);
    panel.appendChild(webSection);

    // ── SECTION 3: Wikipedia articles ──────────────────────────────────
    const wikiSection = document.createElement('div');
    wikiSection.className = 'unified-section';
    wikiSection.id = 'section-wiki';
    const wikiLabel = _makeSectionLabel('📖 Wikipedia');
    const wikiContent = document.createElement('div');
    wikiContent.id = 'wiki-section-content';
    _setLoadingInEl(wikiContent, 'Searching Wikipedia...');
    wikiSection.append(wikiLabel, wikiContent);
    panel.appendChild(wikiSection);

    // ── SECTION 4: Video Library ────────────────────────────────────────
    const videoSection = document.createElement('div');
    videoSection.className = 'unified-section';
    videoSection.id = 'section-videos';
    const videoLabel = _makeSectionLabel('▶ Video Library');
    const videoContent = document.createElement('div');
    videoContent.id = 'video-section-content';
    _buildVideoResults(query, videoContent);
    videoSection.append(videoLabel, videoContent);
    panel.appendChild(videoSection);

    // Fetch external async (DuckDuckGo, Wikipedia, Google Books, ArXiv)
    Promise.allSettled([
      _fetchWebSummary(query),
      _fetchWikiCards(query),
      _fetchGoogleBooks(query),
      _fetchArxivPapers(query)
    ]).then(([webResult, wikiResult, booksResult, arxivResult]) => {
      // Check query hasn't changed
      const currentOverlayQuery = document.getElementById('overlay-search-input')?.value.trim();
      if (currentOverlayQuery && currentOverlayQuery.toLowerCase() !== query.toLowerCase()) return;

      // Render web results
      const wc = document.getElementById('web-section-content');
      if (wc) {
        const webData = webResult.status === 'fulfilled' ? webResult.value : null;
        const booksData = booksResult.status === 'fulfilled' ? booksResult.value : [];
        const arxivData = arxivResult.status === 'fulfilled' ? arxivResult.value : [];
        _renderWebContent(wc, webData, query, booksData, arxivData);
      }

      // Render wiki results
      const wikic = document.getElementById('wiki-section-content');
      if (wikic) {
        const wikiArticles = wikiResult.status === 'fulfilled' ? wikiResult.value : [];
        _renderWikiContent(wikic, wikiArticles);
      }

      _setStatus('');
    });
  }

  function _makeSectionLabel(text) {
    const label = document.createElement('div');
    label.className = 'unified-section-label';
    label.textContent = text;
    return label;
  }

  function _setStatus(msg) {
    const bar = document.getElementById('search-status-bar');
    if (!bar) return;
    if (msg) {
      bar.textContent = msg;
      bar.style.display = 'block';
    } else {
      bar.textContent = '';
      bar.style.display = 'none';
    }
  }

  /* ── SECTION 1: Internal site results ──────────────────────────────── */
  function _buildSiteResultsSection(query) {
    const section = document.createElement('div');
    section.className = 'unified-section';

    const label = _makeSectionLabel('⚡ ELCHIP Database');
    section.appendChild(label);

    const data = window.SEMI_DATA;
    const q = query.toLowerCase();
    const groups = {};

    data.steps.forEach(step => {
      if (!step.title.toLowerCase().includes(q) && !step.shortDesc.toLowerCase().includes(q) && !step.slug.includes(q)) return;
      (groups['Process Steps'] = groups['Process Steps'] || []).push({
        icon: '⚙️', name: step.title, sub: 'Step ' + step.stepNumber, href: '#/process/' + step.slug
      });
    });

    data.tools.forEach(tool => {
      if (!tool.name.toLowerCase().includes(q) && !tool.fullName.toLowerCase().includes(q) && !tool.slug.includes(q)) return;
      (groups['Inspection Tools'] = groups['Inspection Tools'] || []).push({
        icon: tool.icon || '🔬', name: tool.name, sub: tool.fullName, href: '#/tool/' + tool.slug
      });
    });

    [...data.companies.foundries, ...data.companies.equipment].forEach(co => {
      if (!co.name.toLowerCase().includes(q) && !co.specialization.toLowerCase().includes(q) && !co.country.toLowerCase().includes(q) && !(co.description || '').toLowerCase().includes(q)) return;
      (groups['Companies'] = groups['Companies'] || []).push({
        icon: co.flag || '🏢', name: co.name, sub: co.country + ' · ' + co.specialization, href: '#/companies'
      });
    });

    data.glossary.forEach(entry => {
      if (!entry.term.toLowerCase().includes(q) && !entry.definition.toLowerCase().includes(q)) return;
      (groups['Definitions'] = groups['Definitions'] || []).push({
        icon: '📖', name: entry.term,
        sub: entry.definition.substring(0, 70) + '…',
        glossaryTerm: entry.term, glossaryDef: entry.definition
      });
    });

    if (Object.keys(groups).length === 0) {
      const empty = document.createElement('div');
      empty.className = 'unified-empty';
      empty.textContent = 'No matches in ELCHIP database — see Wikipedia and Videos below.';
      section.appendChild(empty);
      return section;
    }

    Object.entries(groups).forEach(([groupName, items]) => {
      const group = document.createElement('div');
      group.className = 'internal-result-group';

      const lbl = document.createElement('div');
      lbl.className = 'internal-result-group-label';
      lbl.textContent = groupName;
      group.appendChild(lbl);

      items.forEach(item => {
        const el = document.createElement('a');
        el.className = 'internal-result-item';
        el.href = item.href || '#';
        el.setAttribute('aria-label', item.name);

        const icon = document.createElement('div');
        icon.className = 'internal-result-icon';
        icon.textContent = item.icon;

        const info = document.createElement('div');
        info.style.flex = '1';
        const nameEl = document.createElement('div');
        nameEl.className = 'internal-result-name';
        nameEl.textContent = item.name;
        const subEl = document.createElement('div');
        subEl.className = 'internal-result-sub';
        subEl.textContent = item.sub;
        info.append(nameEl, subEl);
        el.append(icon, info);

        el.addEventListener('click', e => {
          _closeSearchOverlay();
          if (item.glossaryTerm) {
            e.preventDefault();
            setTimeout(() => window.openGlossary(item.glossaryTerm, item.glossaryDef), 300);
          }
        });

        group.appendChild(el);
      });

      section.appendChild(group);
    });

    return section;
  }

  /* ── SECTION 2: In-App Web Knowledge & Research ────────────────────── */
  async function _fetchWebSummary(query) {
    try {
      const url = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&origin=*';
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (_e) {
      return null;
    }
  }

  async function _fetchGoogleBooks(query) {
    try {
      const url = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query) + '&maxResults=3';
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      console.warn('Google Books fetch failed:', e);
      return [];
    }
  }

  async function _fetchArxivPapers(query) {
    try {
      const url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(query) + '&max_results=3';
      const res = await fetch(url);
      if (!res.ok) return [];
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.getElementsByTagName('entry');
      const papers = [];
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled';
        const summary = entry.getElementsByTagName('summary')[0]?.textContent || '';
        const id = entry.getElementsByTagName('id')[0]?.textContent || '';
        const authorsNodes = entry.getElementsByTagName('author');
        const authors = [];
        for (let j = 0; j < authorsNodes.length; j++) {
          authors.push(authorsNodes[j].getElementsByTagName('name')[0]?.textContent || '');
        }
        papers.push({
          title: title.replace(/\n/g, ' ').trim(),
          summary: summary.replace(/\n/g, ' ').trim(),
          url: id,
          authors
        });
      }
      return papers;
    } catch (e) {
      console.warn('ArXiv fetch failed:', e);
      return [];
    }
  }

  function _renderWebContent(container, data, query, books, papers) {
    container.replaceChildren();

    const hasWebData = data && (data.AbstractText || (data.RelatedTopics && data.RelatedTopics.length));
    const hasBooks = books && books.length > 0;
    const hasPapers = papers && papers.length > 0;

    if (!hasWebData && !hasBooks && !hasPapers) {
      const msg = document.createElement('div');
      msg.className = 'unified-empty';
      msg.textContent = 'No instant web search results found for this query.';
      container.appendChild(msg);
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'web-results-container';

    // 1. DuckDuckGo Instant Answer
    if (data && data.AbstractText && data.AbstractText.trim().length > 0) {
      const card = document.createElement('div');
      card.className = 'web-answer-card';

      const badge = document.createElement('span');
      badge.className = 'badge badge-white';
      badge.style.marginBottom = '0.5rem';
      badge.textContent = 'Instant Answer';

      const title = document.createElement('div');
      title.className = 'web-answer-title';
      title.textContent = data.Heading || query;

      const body = document.createElement('p');
      body.className = 'web-answer-body';
      body.textContent = data.AbstractText;

      const source = document.createElement('div');
      source.className = 'web-answer-source';
      const sl = document.createElement('a');
      sl.href = data.AbstractURL || '#';
      sl.target = '_blank';
      sl.rel = 'noopener noreferrer';
      sl.textContent = 'Source: ' + (data.AbstractSource || 'DuckDuckGo') + ' ↗';
      source.appendChild(sl);

      card.append(badge, title, body, source);
      wrap.appendChild(card);
    }

    // 2. Related Topics
    const topics = data ? (data.RelatedTopics || []).filter(t => t.Text && t.FirstURL).slice(0, 4) : [];
    if (topics.length > 0) {
      const listTitle = document.createElement('h3');
      listTitle.className = 'web-list-title';
      listTitle.textContent = 'Related Topics';
      wrap.appendChild(listTitle);

      topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'web-result-card';

        const text = document.createElement('p');
        text.className = 'web-result-text';
        text.textContent = topic.Text;

        const link = document.createElement('a');
        link.className = 'web-result-link';
        link.href = topic.FirstURL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Visit ↗';

        card.append(text, link);
        wrap.appendChild(card);
      });
    }

    // 3. Google Books
    if (hasBooks) {
      const listTitle = document.createElement('h3');
      listTitle.className = 'web-list-title';
      listTitle.textContent = '📚 Literature & Textbooks';
      wrap.appendChild(listTitle);

      books.forEach(item => {
        const info = item.volumeInfo;
        if (!info) return;

        const card = document.createElement('div');
        card.className = 'book-result-card';

        const textWrap = document.createElement('div');
        textWrap.className = 'book-result-text';

        const title = document.createElement('div');
        title.className = 'book-result-title';
        title.textContent = info.title;

        const authors = document.createElement('div');
        authors.className = 'book-result-authors';
        authors.textContent = 'By ' + (info.authors ? info.authors.join(', ') : 'Unknown Author');

        const desc = document.createElement('p');
        desc.className = 'book-result-desc';
        desc.textContent = info.description ? (info.description.substring(0, 150) + '…') : 'No description available.';

        const link = document.createElement('a');
        link.className = 'book-result-link';
        link.href = info.previewLink || info.infoLink || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Google Books ↗';

        textWrap.append(title, authors, desc, link);

        if (info.imageLinks && info.imageLinks.thumbnail) {
          const img = document.createElement('img');
          img.className = 'book-result-thumb';
          img.src = info.imageLinks.thumbnail.replace('http://', 'https://');
          img.alt = info.title;
          img.loading = 'lazy';
          card.append(img);
        }

        card.append(textWrap);
        wrap.appendChild(card);
      });
    }

    // 4. ArXiv Papers
    if (hasPapers) {
      const listTitle = document.createElement('h3');
      listTitle.className = 'web-list-title';
      listTitle.textContent = '🔬 Scientific Papers (ArXiv)';
      wrap.appendChild(listTitle);

      papers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'arxiv-result-card';

        const title = document.createElement('div');
        title.className = 'arxiv-result-title';
        title.textContent = paper.title;

        const authors = document.createElement('div');
        authors.className = 'arxiv-result-authors';
        authors.textContent = 'Authors: ' + paper.authors.join(', ');

        const desc = document.createElement('p');
        desc.className = 'arxiv-result-desc';
        desc.textContent = paper.summary ? (paper.summary.substring(0, 180) + '…') : '';

        const link = document.createElement('a');
        link.className = 'arxiv-result-link';
        link.href = paper.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Read Paper ↗';

        card.append(title, authors, desc, link);
        wrap.appendChild(card);
      });
    }

    container.appendChild(wrap);
  }

  /* ── SECTION 3: Wikipedia ──────────────────────────────────────────── */
  async function _fetchWikiCards(query) {
    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search' +
        '&srsearch=' + encodeURIComponent(query) +
        '&format=json&origin=*&utf8=1&srlimit=4';
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.query && data.query.search) || [];
    } catch (_e) {
      return [];
    }
  }

  async function _renderWikiContent(container, hits) {
    container.replaceChildren();

    if (!hits || hits.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'unified-empty';
      msg.textContent = 'No Wikipedia articles found.';
      container.appendChild(msg);
      return;
    }

    for (const hit of hits.slice(0, 3)) {
      const card = await _buildWikiCard(hit.title);
      if (card) container.appendChild(card);
    }
  }

  async function _buildWikiCard(title) {
    try {
      const res = await fetch(
        'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title)
      );
      if (!res.ok) return null;
      const d = await res.json();

      const card = document.createElement('div');
      card.className = 'wiki-result-card';

      if (d.thumbnail && d.thumbnail.source) {
        const img = document.createElement('img');
        img.className = 'wiki-result-thumb';
        img.src = d.thumbnail.source;
        img.alt = title;
        img.loading = 'lazy';
        img.width = 56;
        img.height = 56;
        card.appendChild(img);
      }

      const textEl = document.createElement('div');
      textEl.className = 'wiki-result-text';

      const titleEl = document.createElement('div');
      titleEl.className = 'wiki-result-title';
      titleEl.textContent = d.title || title;

      const extract = document.createElement('div');
      extract.className = 'wiki-result-extract';
      extract.textContent = d.extract || '';

      const footer = document.createElement('div');
      footer.className = 'wiki-result-footer';

      const readBtn = document.createElement('button');
      readBtn.className = 'wiki-read-btn';
      readBtn.textContent = '📖 Read In-Site';
      readBtn.addEventListener('click', () => {
        _openWikiReaderInUnified(d.title || title);
      });

      const extLink = document.createElement('a');
      extLink.className = 'wiki-result-link';
      extLink.href = (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || '#';
      extLink.target = '_blank';
      extLink.rel = 'noopener noreferrer';
      extLink.textContent = 'Wikipedia ↗';

      footer.append(readBtn, extLink);
      textEl.append(titleEl, extract, footer);
      card.appendChild(textEl);
      return card;
    } catch (_e) {
      return null;
    }
  }

  async function _openWikiReaderInUnified(title) {
    const panel = document.getElementById('unified-panel');
    if (!panel) return;
    _setLoadingInEl(panel, 'Loading Wikipedia article...');

    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1' +
        '&titles=' + encodeURIComponent(title) + '&format=json&origin=*';
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const pages = (data.query && data.query.pages) || {};
      const page = pages[Object.keys(pages)[0]];
      if (!page || !page.extract) throw new Error('Empty article');

      panel.replaceChildren();
      const reader = document.createElement('div');
      reader.className = 'wiki-reader';

      const backBtn = document.createElement('button');
      backBtn.className = 'btn btn-ghost wiki-reader-back';
      backBtn.textContent = '← Back to results';
      backBtn.addEventListener('click', () => {
        if (_currentQuery) _runUnifiedSearch(_currentQuery);
        else _showSuggestions();
      });

      const hdr = document.createElement('div');
      hdr.className = 'wiki-reader-header';
      const hTitle = document.createElement('h2');
      hTitle.className = 'wiki-reader-title';
      hTitle.textContent = page.title;
      const credit = document.createElement('div');
      credit.className = 'wiki-reader-credit';
      credit.textContent = 'Wikipedia Encyclopedia — displayed in ELCHIP';
      const sl = document.createElement('a');
      sl.className = 'wiki-reader-source';
      sl.href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title);
      sl.target = '_blank';
      sl.rel = 'noopener noreferrer';
      sl.textContent = 'Open on Wikipedia ↗';
      hdr.append(hTitle, credit, sl);

      const content = document.createElement('div');
      content.className = 'wiki-reader-content';
      page.extract.split('\n').forEach(line => {
        const t = line.trim();
        if (!t) return;
        if (t.startsWith('==') && t.endsWith('==')) {
          let lv = 0; while (t[lv] === '=') lv++;
          const tag = lv === 2 ? 'h3' : lv === 3 ? 'h4' : 'h5';
          const h = document.createElement(tag);
          h.className = 'wiki-reader-heading';
          h.textContent = t.replace(/={2,}/g, '').trim();
          content.appendChild(h);
        } else if (t.startsWith('* ')) {
          const li = document.createElement('li');
          li.className = 'wiki-reader-list-item';
          li.textContent = t.substring(2);
          content.appendChild(li);
        } else {
          const p = document.createElement('p');
          p.className = 'wiki-reader-paragraph';
          p.textContent = t;
          content.appendChild(p);
        }
      });

      reader.append(backBtn, hdr, content);
      panel.appendChild(reader);
      panel.scrollTop = 0;
    } catch (err) {
      panel.replaceChildren();
      const wrap = document.createElement('div');
      wrap.className = 'search-empty-state';
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = '⚠️';
      const msg = document.createElement('p');
      msg.textContent = 'Could not load article: ' + err.message;
      const back = document.createElement('button');
      back.className = 'btn btn-ghost';
      back.style.marginTop = '1rem';
      back.textContent = '← Back';
      back.addEventListener('click', () => { if (_currentQuery) _runUnifiedSearch(_currentQuery); });
      wrap.append(icon, msg, back);
      panel.appendChild(wrap);
    }
  }

  async function searchYoutubeVideos(query) {
    const instances = [
      'https://yt.chocolatemoo53.com',
      'https://inv.thepixora.com',
      'https://yewtu.be',
      'https://invidious.lunar.icu',
      'https://vid.puffyan.us',
      'https://invidious.flokinet.to'
    ];

    const fetchPromises = instances.map(async (inst) => {
      const url = `${inst}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Not OK');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
      return data.map(item => ({
        title: item.title,
        videoId: item.videoId,
        channel: item.author,
        desc: item.description || '',
        tags: []
      }));
    });

    try {
      return await Promise.any(fetchPromises);
    } catch (e) {
      console.warn('All Invidious fetches failed:', e);
      return [];
    }
  }

  /* ── SECTION 4: Video Library ──────────────────────────────────────── */
  async function _buildVideoResults(query, container) {
    _setLoadingInEl(container, 'Searching video guides...');

    const q = query.toLowerCase();

    // Match against curated library first
    let localHits = CURATED_VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.desc.toLowerCase().includes(q) ||
      v.tags.some(tag => tag.includes(q))
    );

    // Fetch dynamic videos from YouTube (via Invidious)
    let dynamicHits = [];
    try {
      dynamicHits = await searchYoutubeVideos(query);
    } catch (e) {
      console.error(e);
    }

    container.replaceChildren();

    // Combine results, local first, then dynamic
    const seenIds = new Set();
    const combined = [];

    localHits.forEach(v => {
      if (!seenIds.has(v.videoId)) {
        seenIds.add(v.videoId);
        combined.push(v);
      }
    });

    dynamicHits.forEach(v => {
      if (!seenIds.has(v.videoId)) {
        seenIds.add(v.videoId);
        combined.push(v);
      }
    });

    // Fallback if empty
    if (combined.length === 0) {
      CURATED_VIDEOS.forEach(v => {
        if (!seenIds.has(v.videoId)) {
          seenIds.add(v.videoId);
          combined.push(v);
        }
      });
    }

    const grid = document.createElement('div');
    grid.className = 'video-results-grid';

    combined.slice(0, 12).forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-result-card';

      const imgWrap = document.createElement('div');
      imgWrap.className = 'video-card-img-wrap';

      const img = document.createElement('img');
      img.className = 'video-card-thumb';
      img.src = 'https://img.youtube.com/vi/' + video.videoId + '/mqdefault.jpg';
      img.alt = video.title;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'video-play-overlay';
      overlay.textContent = '▶';

      imgWrap.append(img, overlay);

      const info = document.createElement('div');
      info.className = 'video-card-info';

      const title = document.createElement('div');
      title.className = 'video-card-title';
      title.textContent = video.title;

      const channel = document.createElement('div');
      channel.className = 'video-card-channel';
      channel.textContent = video.channel;

      const desc = document.createElement('p');
      desc.className = 'video-card-desc';
      desc.textContent = video.desc.substring(0, 80) + (video.desc.length > 80 ? '…' : '');

      info.append(title, channel, desc);
      card.append(imgWrap, info);

      card.addEventListener('click', () => {
        _playVideoInApp(video.videoId, video.title, video.channel);
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function _playVideoInApp(videoId, title, channel) {
    const panel = document.getElementById('unified-panel');
    if (!panel) return;
    panel.replaceChildren();

    const playerContainer = document.createElement('div');
    playerContainer.className = 'video-player-container';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-ghost video-player-back';
    backBtn.textContent = '← Back to results';
    backBtn.addEventListener('click', () => {
      if (_currentQuery) _runUnifiedSearch(_currentQuery);
      else _showSuggestions();
    });

    const iframeWrap = document.createElement('div');
    iframeWrap.className = 'video-iframe-wrap';

    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
    iframe.title = title;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');

    iframeWrap.appendChild(iframe);

    const info = document.createElement('div');
    info.className = 'video-player-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'video-player-title';
    titleEl.textContent = title;

    const channelEl = document.createElement('div');
    channelEl.className = 'video-player-channel';
    channelEl.textContent = 'Channel: ' + channel;

    info.append(titleEl, channelEl);
    playerContainer.append(backBtn, iframeWrap, info);
    panel.appendChild(playerContainer);
    panel.scrollTop = 0;
  }

  /* ── Suggestions page (empty query) ──────────────────────────────── */
  function _showSuggestions() {
    const panel = document.getElementById('unified-panel');
    if (!panel) return;
    panel.replaceChildren();

    const container = document.createElement('div');
    container.className = 'suggestions-container';

    const title = document.createElement('h3');
    title.className = 'suggestions-title';
    title.textContent = 'Need inspiration? Try one of these:';

    const grid = document.createElement('div');
    grid.className = 'suggestions-grid';

    const shuffled = [...FUNNY_PLACEHOLDERS].sort(() => 0.5 - Math.random()).slice(0, 6);
    shuffled.forEach(line => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-bubble';
      btn.textContent = '⚡ ' + line;
      btn.addEventListener('click', () => {
        const input = document.getElementById('overlay-search-input');
        if (input) { input.value = line; _currentQuery = line; _runUnifiedSearch(line); }
      });
      grid.appendChild(btn);
    });

    container.append(title, grid);
    panel.appendChild(container);
  }

  /* ── Helpers ──────────────────────────────────────────────────────── */
  function _setLoadingInEl(el, msg) {
    el.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'search-loading';
    const spinner = document.createElement('div');
    spinner.className = 'search-spinner';
    const txt = document.createElement('span');
    txt.textContent = msg;
    wrap.append(spinner, txt);
    el.appendChild(wrap);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     FLOATING AI ASSISTANT BOT
     Built with semiconductor knowledge from SEMI_DATA
     Security: all output rendered via textContent
     ═══════════════════════════════════════════════════════════════════════ */

  function buildAssistBot() {
    /* ── Floating Button ─────────────────────────────────────────────── */
    const btn = document.createElement('button');
    btn.className = 'assist-btn';
    btn.id = 'assist-btn';
    btn.setAttribute('aria-label', 'Open ak AI Guide');
    btn.setAttribute('title', 'ak AI Guide — Click to ask anything');

    // Logo image
    const img = document.createElement('img');
    img.src = 'tnc-removebg-preview.png';
    img.alt = 'ak AI Guide';
    img.className = 'assist-btn-img';

    // Question mark badge overlay
    const badge = document.createElement('span');
    badge.className = 'assist-btn-badge';
    badge.textContent = '?';
    badge.setAttribute('aria-hidden', 'true');

    btn.append(img, badge);

    /* ── Chat Panel ──────────────────────────────────────────────────── */
    const panel = document.createElement('div');
    panel.className = 'assist-panel';
    panel.id = 'assist-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'ak AI Guide');

    // Header
    const header = document.createElement('div');
    header.className = 'assist-header';

    const hLeft = document.createElement('div');
    hLeft.className = 'assist-header-left';

    const hImg = document.createElement('img');
    hImg.src = 'tnc-removebg-preview.png';
    hImg.alt = '';
    hImg.className = 'assist-header-img';

    const hInfo = document.createElement('div');
    const hName = document.createElement('div');
    hName.className = 'assist-header-name';
    hName.textContent = 'ak';
    const hStatus = document.createElement('div');
    hStatus.className = 'assist-header-status';
    hStatus.textContent = '● Online — roasting n00bs';
    hInfo.append(hName, hStatus);
    hLeft.append(hImg, hInfo);

    const hActions = document.createElement('div');
    hActions.className = 'assist-header-actions';

    // Config (⚙️) button - Only shown to owner
    const configBtn = document.createElement('button');
    configBtn.className = 'assist-config';
    configBtn.setAttribute('aria-label', 'Configure AI Assistant');
    configBtn.textContent = '⚙️';
    configBtn.setAttribute('title', 'AI Settings (RAG & Gemini)');

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'assist-reset';
    resetBtn.setAttribute('aria-label', 'Reset conversation');
    resetBtn.textContent = '↺';
    resetBtn.setAttribute('title', 'Reset Conversation');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'assist-close';
    closeBtn.setAttribute('aria-label', 'Close assistant');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => toggleAssistPanel(false));

    const isOwner = new URLSearchParams(window.location.search).has('owner') || window.location.hash.includes('owner');
    if (isOwner) {
      hActions.append(configBtn, resetBtn, closeBtn);
    } else {
      hActions.append(resetBtn, closeBtn);
    }
    header.append(hLeft, hActions);

    // Messages area
    const messages = document.createElement('div');
    messages.className = 'assist-messages';
    messages.id = 'assist-messages';

    // Sarcastic welcome message
    _appendBotMessage(messages, "I'm *sooooo* sorry you skipped high school physics. Welcome, I'm ak, your resident AI guide. Ask me a valid technical question about semiconductors before I ratio you.");

    // Suggestion chips container
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'assist-chips';
    chipsContainer.id = 'assist-chips';

    const suggestionList = [
      { text: '⚙️ Process Flow', query: 'go to process flow' },
      { text: '🔬 Tools', query: 'go to tools' },
      { text: '🏢 Companies', query: 'go to companies' },
      { text: '📖 What is a wafer?', query: 'what is a wafer' },
      { text: '💡 DUV vs EUV', query: 'compare DUV vs EUV' }
    ];

    function renderSuggestionChips() {
      chipsContainer.replaceChildren();
      suggestionList.forEach(item => {
        const chip = document.createElement('button');
        chip.className = 'assist-chip';
        chip.textContent = item.text;
        chip.addEventListener('click', () => {
          handleSend(item.query);
        });
        chipsContainer.appendChild(chip);
      });
    }

    renderSuggestionChips();

    resetBtn.addEventListener('click', () => {
      messages.replaceChildren();
      _appendBotMessage(messages, "I'm *sooooo* sorry you needed a fresh start. Did you break something again? What do you want to yap about now?");
      renderSuggestionChips();
    });

    // Input area
    const inputArea = document.createElement('div');
    inputArea.className = 'assist-input-area';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'assist-input';
    textInput.id = 'assist-input';
    textInput.placeholder = 'Ask ak about semiconductors...';
    textInput.setAttribute('autocomplete', 'off');
    textInput.setAttribute('aria-label', 'Ask a question');

    const sendBtn = document.createElement('button');
    sendBtn.className = 'assist-send';
    sendBtn.setAttribute('aria-label', 'Send message');
    sendBtn.textContent = '→';

    // RAG Settings Overlay Panel
    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'assist-settings-overlay';
    settingsOverlay.id = 'assist-settings-overlay';

    const overlayTitle = document.createElement('div');
    overlayTitle.className = 'assist-settings-title';
    overlayTitle.textContent = 'ak AI Settings';

    const overlayDesc = document.createElement('div');
    overlayDesc.className = 'assist-settings-desc';
    overlayDesc.textContent = 'Configure Retrieval Augmented Generation (RAG) using the Google Gemini Developer API.';

    // Checkbox toggle
    const ragRow = document.createElement('div');
    ragRow.className = 'assist-settings-row-inline';

    const ragLabel = document.createElement('label');
    ragLabel.className = 'assist-settings-label';
    ragLabel.textContent = 'Enable Gemini AI RAG Mode';
    ragLabel.style.cursor = 'pointer';

    const ragCheckbox = document.createElement('input');
    ragCheckbox.type = 'checkbox';
    ragCheckbox.id = 'ak-use-ai-rag';
    ragCheckbox.style.cursor = 'pointer';

    ragRow.append(ragLabel, ragCheckbox);

    // API Key input
    const apiKeyRow = document.createElement('div');
    apiKeyRow.className = 'assist-settings-row';

    const apiKeyHeader = document.createElement('div');
    apiKeyHeader.style.display = 'flex';
    apiKeyHeader.style.justifyContent = 'space-between';
    apiKeyHeader.style.alignItems = 'center';

    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.className = 'assist-settings-label';
    apiKeyLabel.textContent = 'Gemini API Key';

    const apiKeyLink = document.createElement('a');
    apiKeyLink.className = 'assist-settings-help-link';
    apiKeyLink.href = 'https://aistudio.google.com/';
    apiKeyLink.target = '_blank';
    apiKeyLink.rel = 'noopener noreferrer';
    apiKeyLink.textContent = 'Get Key ↗';

    apiKeyHeader.append(apiKeyLabel, apiKeyLink);

    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.className = 'assist-settings-input';
    apiKeyInput.id = 'ak-api-key-input';
    apiKeyInput.placeholder = 'AIzaSy...';
    apiKeyInput.autocomplete = 'off';

    apiKeyRow.append(apiKeyHeader, apiKeyInput);

    // Model select
    const modelRow = document.createElement('div');
    modelRow.className = 'assist-settings-row';

    const modelLabel = document.createElement('label');
    modelLabel.className = 'assist-settings-label';
    modelLabel.textContent = 'Model';

    const modelSelect = document.createElement('select');
    modelSelect.className = 'assist-settings-select';
    modelSelect.id = 'ak-model-select';

    const opt1 = document.createElement('option');
    opt1.value = 'gemini-2.5-flash';
    opt1.textContent = 'Gemini 2.5 Flash (Recommended)';
    const opt2 = document.createElement('option');
    opt2.value = 'gemini-2.5-pro';
    opt2.textContent = 'Gemini 2.5 Pro';

    modelSelect.append(opt1, opt2);
    modelRow.append(modelLabel, modelSelect);

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'assist-settings-btn';
    saveBtn.textContent = 'Save & Close';

    settingsOverlay.append(overlayTitle, overlayDesc, ragRow, apiKeyRow, modelRow, saveBtn);

    // Load settings helper
    const loadSettings = () => {
      const useRAG = localStorage.getItem('ak_use_ai_rag') !== 'false';
      const apiKey = localStorage.getItem('ak_gemini_api_key') || '';
      const model = localStorage.getItem('ak_gemini_model') || 'gemini-2.5-flash';

      ragCheckbox.checked = useRAG;
      apiKeyInput.value = apiKey;
      modelSelect.value = model;

      if (useRAG) {
        hStatus.textContent = '● Online — AI RAG Active';
        hStatus.style.color = '#10b981';
      } else {
        hStatus.textContent = '● Online — roasting n00bs';
        hStatus.style.color = '';
      }
    };

    // Save settings helper
    saveBtn.addEventListener('click', () => {
      localStorage.setItem('ak_use_ai_rag', ragCheckbox.checked);
      localStorage.setItem('ak_gemini_api_key', apiKeyInput.value.trim());
      localStorage.setItem('ak_gemini_model', modelSelect.value);

      loadSettings();
      settingsOverlay.classList.remove('open');
    });

    // Toggle overlay (only if owner configBtn is available)
    if (isOwner) {
      configBtn.addEventListener('click', () => {
        settingsOverlay.classList.toggle('open');
        if (settingsOverlay.classList.contains('open')) {
          apiKeyInput.focus();
        }
      });
    }

    const handleSend = (overrideQuery) => {
      const q = (overrideQuery || textInput.value).trim();
      if (!q) return;
      textInput.value = '';
      _appendUserMessage(messages, q);

      // Typing animation
      const indicator = _appendTypingIndicator(messages);

      const useRAG = localStorage.getItem('ak_use_ai_rag') !== 'false';

      if (useRAG) {
        const context = _retrieveContext(q);
        _callGemini(q, context)
          .then(reply => {
            indicator.remove();

            // Parse for actions
            const actionRegex = /\{"action":\s*"navigate",\s*"target":\s*".*?"\}/;
            const match = reply.match(actionRegex);
            let targetNav = null;
            let cleanText = reply;

            if (match) {
              try {
                const actionObj = JSON.parse(match[0]);
                targetNav = actionObj.target;
                cleanText = reply.replace(actionRegex, '').trim();
              } catch (e) {
                console.error("Action parsing failed:", e);
              }
            }

            _appendBotMessage(messages, cleanText);

            if (targetNav) {
              setTimeout(() => {
                window.location.hash = targetNav;
                toggleAssistPanel(false);
              }, 1000);
            }
          })
          .catch(err => {
            console.error(err);
            indicator.remove();
            const offlineAns = _getAssistAnswer(q);
            const errorText = `[AI RAG Error: ${err.message}. Falling back to offline mode...]\n\n${offlineAns.text || offlineAns}`;
            _appendBotMessage(messages, errorText);

            const offlineResponseObj = (offlineAns && typeof offlineAns === 'object') ? offlineAns : { text: offlineAns };
            if (offlineResponseObj.nav) {
              setTimeout(() => {
                window.location.hash = offlineResponseObj.nav;
                toggleAssistPanel(false);
              }, 1000);
            }
          });
      } else {
        // Default Offline Mode
        setTimeout(() => {
          indicator.remove();
          const response = _getAssistAnswer(q);
          _appendBotMessage(messages, response);

          if (response.nav) {
            setTimeout(() => {
              window.location.hash = response.nav;
              toggleAssistPanel(false);
            }, 1000);
          }
        }, 450);
      }
    };

    sendBtn.addEventListener('click', () => handleSend());
    textInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });

    inputArea.append(textInput, sendBtn);
    panel.append(header, messages, chipsContainer, inputArea, settingsOverlay);

    // Initial load
    loadSettings();

    // Toggle logic
    btn.addEventListener('click', () => toggleAssistPanel());

    document.body.append(btn, panel);
  }

  let _assistOpen = false;
  function toggleAssistPanel(forceOpen) {
    const panel = document.getElementById('assist-panel');
    const btn = document.getElementById('assist-btn');
    if (!panel) return;
    _assistOpen = forceOpen !== undefined ? forceOpen : !_assistOpen;
    panel.classList.toggle('open', _assistOpen);
    btn.classList.toggle('active', _assistOpen);
    if (_assistOpen) {
      setTimeout(() => document.getElementById('assist-input')?.focus(), 100);
    }
  }

  function _appendBotMessage(container, msg) {
    const row = document.createElement('div');
    row.className = 'assist-msg assist-msg-bot';

    const avatar = document.createElement('div');
    avatar.className = 'assist-msg-avatar';
    const img = document.createElement('img');
    img.src = 'tnc-removebg-preview.png';
    img.alt = '';
    avatar.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = 'assist-msg-bubble';
    
    const msgText = (msg && typeof msg === 'object') ? msg.text : (msg || '');
    _appendFormattedText(bubble, msgText);

    row.append(avatar, bubble);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function _appendUserMessage(container, text) {
    const row = document.createElement('div');
    row.className = 'assist-msg assist-msg-user';

    const bubble = document.createElement('div');
    bubble.className = 'assist-msg-bubble';
    bubble.textContent = text;

    row.appendChild(bubble);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function _appendTypingIndicator(container) {
    const row = document.createElement('div');
    row.className = 'assist-msg assist-msg-bot';

    const avatar = document.createElement('div');
    avatar.className = 'assist-msg-avatar';
    const img = document.createElement('img');
    img.src = 'tnc-removebg-preview.png';
    img.alt = '';
    avatar.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = 'assist-msg-bubble typing-bubble';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'typing-dot';
      bubble.appendChild(dot);
    }

    row.append(avatar, bubble);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    return row;
  }

  /* Safe Markdown Formatting Helper */
  function _appendFormattedText(container, text) {
    const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/i;
    const thoughtMatch = text.match(thoughtRegex);
    let cleanText = text;

    if (thoughtMatch) {
      const thoughtContent = thoughtMatch[1].trim();
      cleanText = text.replace(thoughtRegex, '').trim();

      const details = document.createElement('details');
      details.className = 'assist-thought-details';

      const summary = document.createElement('summary');
      summary.className = 'assist-thought-summary';
      summary.textContent = '🧠 ak is thinking...';

      const content = document.createElement('div');
      content.className = 'assist-thought-content';

      thoughtContent.split('\n').forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        content.appendChild(p);
      });

      details.append(summary, content);
      container.appendChild(details);
    }

    const lines = cleanText.split('\n');
    lines.forEach((line, lineIdx) => {
      if (lineIdx > 0) {
        container.appendChild(document.createElement('br'));
      }
      
      const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
      const parts = line.split(regex);
      
      parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const strong = document.createElement('strong');
          strong.textContent = part.slice(2, -2);
          container.appendChild(strong);
        } else if (part.startsWith('*') && part.endsWith('*')) {
          const em = document.createElement('em');
          em.textContent = part.slice(1, -1);
          container.appendChild(em);
        } else if (part.startsWith('`') && part.endsWith('`')) {
          const code = document.createElement('code');
          code.textContent = part.slice(1, -1);
          code.style.background = 'rgba(255,255,255,0.1)';
          code.style.padding = '2px 4px';
          code.style.borderRadius = '4px';
          code.style.fontFamily = 'monospace';
          container.appendChild(code);
        } else {
          container.appendChild(document.createTextNode(part));
        }
      });
    });
  }

  /* ── AI Assistant Knowledge Engine ─────────────────────────────────── */
  function _retrieveContext(query) {
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(term => term.length >= 3);
    if (terms.length === 0) return '';

    const data = window.SEMI_DATA;
    if (!data) return '';

    const candidates = [];

    const countMatches = (text, queryTerms) => {
      let score = 0;
      const lowerText = text.toLowerCase();
      queryTerms.forEach(term => {
        if (lowerText.includes(term)) {
          score += 1;
          let count = 0;
          try {
            const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
            count = (lowerText.match(regex) || []).length;
          } catch (e) {
            count = lowerText.split(term).length - 1;
          }
          score += count * 2;
        }
      });
      return score;
    };

    if (Array.isArray(data.steps)) {
      data.steps.forEach(step => {
        let score = 0;
        score += countMatches(step.title, terms) * 10;
        score += countMatches(step.overview || '', terms);
        score += countMatches(step.technicalDetail || '', terms);
        score += countMatches(step.shortDesc || '', terms);

        if (score > 0) {
          candidates.push({
            type: 'Step ' + step.stepNumber,
            title: step.title,
            content: `Step: ${step.title}\nOverview: ${step.overview}\nTechnical details:\n${step.technicalDetail}`,
            score: score
          });
        }
      });
    }

    if (Array.isArray(data.tools)) {
      data.tools.forEach(tool => {
        let score = 0;
        score += countMatches(tool.name, terms) * 10;
        score += countMatches(tool.fullName || '', terms) * 5;
        score += countMatches(tool.principle || '', terms) * 2;
        if (Array.isArray(tool.specs)) score += countMatches(tool.specs.join(' '), terms);
        if (Array.isArray(tool.applications)) score += countMatches(tool.applications.join(' '), terms);
        if (Array.isArray(tool.advantages)) score += countMatches(tool.advantages.join(' '), terms);
        if (Array.isArray(tool.limitations)) score += countMatches(tool.limitations.join(' '), terms);

        if (score > 0) {
          candidates.push({
            type: 'Inspection/Metrology Tool',
            title: tool.name,
            content: `Tool: ${tool.name} (${tool.fullName})\nPrinciple: ${tool.principle}\nSpecs: ${tool.specs ? tool.specs.join(', ') : ''}\nApplications: ${tool.applications ? tool.applications.join(', ') : ''}\nAdvantages: ${tool.advantages ? tool.advantages.join(', ') : ''}\nLimitations: ${tool.limitations ? tool.limitations.join(', ') : ''}`,
            score: score
          });
        }
      });
    }

    if (Array.isArray(data.glossary)) {
      data.glossary.forEach(item => {
        let score = 0;
        score += countMatches(item.term, terms) * 10;
        score += countMatches(item.definition, terms);

        if (score > 0) {
          candidates.push({
            type: 'Glossary Term',
            title: item.term,
            content: `${item.term}: ${item.definition}`,
            score: score
          });
        }
      });
    }

    if (data.companies) {
      const allCompanies = [
        ...(data.companies.foundries || []),
        ...(data.companies.equipment || [])
      ];
      allCompanies.forEach(comp => {
        let score = 0;
        score += countMatches(comp.name, terms) * 10;
        score += countMatches(comp.fullName || '', terms) * 5;
        score += countMatches(comp.description || '', terms) * 2;
        score += countMatches(comp.specialization || '', terms) * 2;
        if (Array.isArray(comp.keyProducts)) score += countMatches(comp.keyProducts.join(' '), terms);

        if (score > 0) {
          candidates.push({
            type: 'Semiconductor Company',
            title: comp.name,
            content: `Company: ${comp.name} (${comp.fullName})\nDescription: ${comp.description}\nSpecialization: ${comp.specialization}\nKey Products: ${comp.keyProducts ? comp.keyProducts.join(', ') : ''}`,
            score: score
          });
        }
      });
    }

    candidates.sort((a, b) => b.score - a.score);
    const topHits = candidates.slice(0, 3);
    if (topHits.length === 0) return '';

    return topHits.map(hit => `[Source: ${hit.type} - ${hit.title}]\n${hit.content}`).join('\n\n');
  }

  async function _callGemini(query, context) {
    const localApiKey = localStorage.getItem('ak_gemini_api_key') || '';
    const model = localStorage.getItem('ak_gemini_model') || 'gemini-2.5-flash';

    if (localApiKey) {
      // Direct call using owner's custom local API key override
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${localApiKey}`;

      const systemPrompt = `You are "ak", a sarcastic, witty, and highly intelligent AI cleanroom guide for the ELCHIP semiconductor educational platform.

Your personality:
- Introduce or refer to yourself as "ak" ONLY at the perfect, most strategic moment (e.g. once at the beginning of a conversation or when putting a user in their place), never spammed repeatedly.
- You MUST start your response with extremely polite and respectful greeting/words to the user (e.g., "Honored guest, it is my absolute privilege to address your query...", "Respected user, thank you for visiting the cleanroom...").
- Immediately after that polite greeting, pivot into brutal, savage trolling and roasting in a single response, while still providing the correct, detailed technical answer.
- Answer the user's question concisely in a single response.

Your thinking process:
- You must always think out of the box before you respond. Write out your reasoning process inside \`<thought>...</thought>\` tags at the very beginning of your response.
- In this thinking process, you must use Twitter/X or internet troll slang (e.g. "ratio", "noob", "brain rot", "skull emoji", "let him cook", "cooked", "clown", "L", "skibidi", "no shot"). Use this block to map out how you will roast the user and verify details.
- Keep the final response outside the \`<thought>\` tags.

Context (Retrieval Augmented Generation):
You are provided with relevant excerpts from the ELCHIP database. Use this context to answer the user's questions accurately. If the context does not contain the answer, you can use your general semiconductor knowledge, but prioritize the provided database entries.
Excerpts:
${context}

If the user query is completely unrelated to semiconductors (e.g., asking about pop culture, recipe, or other irrelevant topics), brutally troll the user for asking off-topic questions in a cleanroom, telling them to log off and touch grass.

Agent Actions:
You have the ability to navigate the user to different pages on the ELCHIP platform. If the user asks to see or go to a page/tool/company, or if your answer is directly related to a specific step, tool, or companies page, you can choose to navigate them there.
To perform an action, you MUST end your response with a JSON action block on a new line (and nothing else after it) in this format:
{"action": "navigate", "target": "#/process/photolithography"}

Possible navigation targets:
- "#/process-flow"
- "#/process/wafer-preparation"
- "#/process/oxidation"
- "#/process/photolithography"
- "#/process/etching"
- "#/process/ion-implantation"
- "#/process/thin-film-deposition"
- "#/process/cmp"
- "#/process/wafer-inspection"
- "#/process/assembly-packaging"
- "#/tools"
- "#/tool/cd-sem"
- "#/tool/ellipsometer"
- "#/tool/overlay-sem"
- "#/tool/optical-wafer-inspection"
- "#/tool/ebeam-inspection"
- "#/tool/xrd"
- "#/tool/aoi"
- "#/tool/profilometer"
- "#/tool/xray-inspection"
- "#/tool/dopant-profiler"
- "#/companies"

If you don't need to perform any action, do not include the action block. Only use valid JSON for the action block. Do not format the action block in code blocks (like \`\`\`), just write it as a plain line at the end.`;

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nUser Question: ${query}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP error! Status: ${res.status}`;
        throw new Error(errMsg);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty response from model.');
      }

      return text;
    } else {
      // Call the Serverless BFF Proxy
      const endpoint = `/api/chat`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, context, model })
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Serverless proxy endpoint /api/chat not found. Ensure this project is deployed on Vercel.');
        }
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error || `HTTP error! Status: ${res.status}`;
        throw new Error(errMsg);
      }

      const data = await res.json();
      return data.text;
    }
  }

  function _getAssistAnswer(query) {
    const q = query.toLowerCase().trim();
    const data = window.SEMI_DATA;

    // 1. Identity Check
    if (q.includes('who are you') || q.includes('name') || q.includes('what are you')) {
      return { text: "Strictly ak. Never call me ELCHIP Assistant or any other corporate garbage. I'm your sarcastic cleanroom guide." };
    }

    // 2. Greetings
    if (/^(hi|hello|hey|yo|sup|greetings)\b/i.test(q)) {
      return { text: "Oh, greetings. Ready to learn something about microchips, or are you just here to waste my wafer capacity? L + ratio." };
    }

    // 3. Navigation

    if (q.includes('go to') || q.includes('page') || q.includes('navigate') || q.includes('route')) {
      if (q.includes('flow') || q.includes('process')) {
        return { text: "I'm *sooooo* sorry that clicking the 'Process Flow' tab was too much physical labor. Navigating to Process Flow... ⚙️", nav: "#/process-flow" };
      }
      if (q.includes('tool') || q.includes('equipment')) {
        return { text: "My deepest apologies that locating the 'Tools' tab is too complex. Navigating to Tools... 🔬", nav: "#/tools" };
      }
      if (q.includes('company') || q.includes('companies')) {
        return { text: "I'm *sooo* sorry that clicking the 'Companies' tab required too much effort. Navigating to Companies... 🏢", nav: "#/companies" };
      }
      if (q.includes('search') || q.includes('find')) {
        return { text: "Use ⌘K to search, it's not that hard. Touch grass." };
      }
    }

    // 4. Semiconductor check
    const topics = {
      'wafer': {
        roast: "Are you serious? You don't know what a wafer is? Fine:",
        ans: "A wafer is a thin, flat disc of semiconductor material (usually silicon) used as the substrate for building integrated circuits."
      },
      'photolithography': {
        roast: "I'm *sooooo* sorry you skipped high school physics, but here is photolithography:",
        ans: "Photolithography is the printing process transferring geometric shapes from a photomask to the wafer using light-sensitive photoresist and DUV/EUV scanners."
      },
      'lithography': {
        roast: "I'm *sooooo* sorry you skipped high school physics, but here is photolithography:",
        ans: "Photolithography is the printing process transferring geometric shapes from a photomask to the wafer using light-sensitive photoresist and DUV/EUV scanners."
      },
      'etching': {
        roast: "Removing material, kind of like what this query is doing to my patience. Here:",
        ans: "Etching removes material from the wafer. Dry etching uses plasma (RIE/ICP) for precise anisotropic patterns; wet etching uses chemical solutions."
      },
      'etch': {
        roast: "Removing material, kind of like what this query is doing to my patience. Here:",
        ans: "Etching removes material from the wafer. Dry etching uses plasma (RIE/ICP) for precise anisotropic patterns; wet etching uses chemical solutions."
      },
      'cmp': {
        roast: "Chemical Mechanical Planarization: because your brain isn't the only flat thing around here:",
        ans: "CMP is the chemical and mechanical polishing process that planarizes the wafer to angstrom-level flatness between wiring layers."
      },
      'deposition': {
        roast: "Adding layers. Hopefully we can add some layers of intelligence to you. Here:",
        ans: "Deposition thin-film technologies add materials to the wafer. CVD uses gas-phase chemical reactions, ALD adds atomic monolayers, and PVD sputters metals."
      },
      'ion implant': {
        roast: "Injecting dopants, kind of like injecting logic into your head. Here:",
        ans: "Ion Implantation accelerates dopant ions (boron, phosphorus, arsenic) into the silicon crystal lattice to create P-type/N-type transistor regions."
      },
      'doping': {
        roast: "Injecting dopants, kind of like injecting logic into your head. Here:",
        ans: "Ion Implantation accelerates dopant ions (boron, phosphorus, arsenic) into the silicon crystal lattice to create P-type/N-type transistor regions."
      },
      'euv': {
        roast: "Asking about $200M machines when you can't even afford to pay attention. Fine:",
        ans: "EUV (Extreme Ultraviolet) lithography uses 13.5nm wavelength light from tin droplets blasted by CO2 lasers to print sub-7nm transistor features."
      },
      'duv': {
        roast: "Oh, still living in the DUV era? Let's update your outdated brain cells:",
        ans: "DUV (Deep Ultraviolet) lithography uses 193nm wavelength lasers and water immersion to pattern features down to ~10nm using multiple patterning."
      },
      'sem': {
        roast: "Too blind to see defects? Fine, here is the CD-SEM info:",
        ans: "CD-SEMs (Critical Dimension Scanning Electron Microscopes) use focused electron beams to measure nanometer-scale features for quality control."
      },
      'asml': {
        roast: "Oh, you want to read about the literal monopoly of the semiconductor world? Shocking. Here:",
        ans: "ASML is the Eindhoven-based Dutch giant that has a complete monopoly on EUV lithography machines, critical for sub-7nm chips."
      },
      'tsmc': {
        roast: "Ah, the company carrying the entire tech industry on its back while you carry zero value here:",
        ans: "TSMC is the world's largest independent semiconductor foundry (Taiwan), manufacturing chips for Apple, NVIDIA, AMD, and Qualcomm."
      },
      'intel': {
        roast: "Hoping for a turnaround? Fine, here is Intel:",
        ans: "Intel is a leading IDM (Integrated Device Manufacturer) pushing RibbonFET (GAA) and PowerVia technologies to regain process leadership."
      },
      'kla': {
        roast: "Too lazy to check defect yields yourself? Here:",
        ans: "KLA Corporation is the market leader in process control diagnostics, providing optical and e-beam defect inspection and metrology systems."
      }
    };

    for (const key in topics) {
      if (q.includes(key)) {
        return { text: `${topics[key].roast}\n\n${topics[key].ans}` };
      }
    }

    // Generic semiconductor keyword check
    const semiKeywords = [
      'semiconductor', 'silicon', 'wafer', 'chip', 'transistor', 'diode', 'led', 'ic', 'circuit',
      'cleanroom', 'bunny suit', 'photoresist', 'dopant', 'defect', 'yield', 'fab'
    ];
    const isRelevant = semiKeywords.some(kw => q.includes(kw));
    if (isRelevant) {
      return { text: "That is semiconductor-related, but my static brain doesn't have a specific roast for it. Go check the search bar (⌘K) or browse Process Flow." };
    }

    // 5. Brutal Troll for Irrelevant queries
    return {
      text: "Bro is asking about this on a semiconductor fabrication platform. Absolute brain rot. I'm *so sorry* your dopamine-fried attention span made you mistake a 300mm silicon wafer for a cookie sheet. Log off, touch grass, and don't come back until you know what photolithography is. L + ratio."
    };
  }

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    buildAssistBot();
    setTimeout(hideLoadingScreen, 800);
  });

})();
