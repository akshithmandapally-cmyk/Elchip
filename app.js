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
    closeBtn.textContent = 'ESC';
    closeBtn.setAttribute('aria-label', 'Close search');
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

    // ── SECTION 2: Web Summary (DuckDuckGo instant) ─────────────────────
    const webSection = document.createElement('div');
    webSection.className = 'unified-section';
    webSection.id = 'section-web';
    const webLabel = _makeSectionLabel('🌐 Web Knowledge');
    const webContent = document.createElement('div');
    webContent.id = 'web-section-content';
    _setLoadingInEl(webContent, 'Fetching web knowledge...');
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

    // Fetch external async
    Promise.allSettled([
      _fetchWebSummary(query),
      _fetchWikiCards(query)
    ]).then(([webResult, wikiResult]) => {
      // Check query hasn't changed
      const currentOverlayQuery = document.getElementById('overlay-search-input')?.value.trim();
      if (currentOverlayQuery && currentOverlayQuery.toLowerCase() !== query.toLowerCase()) return;

      // Render web results
      const wc = document.getElementById('web-section-content');
      if (wc) {
        const webData = webResult.status === 'fulfilled' ? webResult.value : null;
        _renderWebContent(wc, webData, query);
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

  /* ── SECTION 2: DuckDuckGo Web Summary ────────────────────────────── */
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

  function _renderWebContent(container, data, query) {
    container.replaceChildren();

    if (!data || (!data.AbstractText && !(data.RelatedTopics && data.RelatedTopics.length))) {
      const msg = document.createElement('div');
      msg.className = 'unified-empty';
      msg.textContent = 'No instant web summary found for this query.';
      container.appendChild(msg);
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'web-results-container';

    if (data.AbstractText && data.AbstractText.trim().length > 0) {
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

    const topics = (data.RelatedTopics || []).filter(t => t.Text && t.FirstURL).slice(0, 4);
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

  /* ── SECTION 4: Video Library ──────────────────────────────────────── */
  function _buildVideoResults(query, container) {
    container.replaceChildren();

    const q = query.toLowerCase();

    // Match against curated library
    let hits = CURATED_VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.desc.toLowerCase().includes(q) ||
      v.tags.some(tag => tag.includes(q))
    );

    // If no specific match, show ALL curated videos (user can still discover)
    if (hits.length === 0) {
      hits = CURATED_VIDEOS;
    }

    const grid = document.createElement('div');
    grid.className = 'video-results-grid';

    hits.slice(0, 12).forEach(video => {
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
    btn.setAttribute('aria-label', 'Open ELCHIP AI Assistant');
    btn.setAttribute('title', 'ELCHIP Assistant — Click to ask anything');

    // Logo image
    const img = document.createElement('img');
    img.src = 'tnc-removebg-preview.png';
    img.alt = 'ELCHIP Assistant';
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
    panel.setAttribute('aria-label', 'ELCHIP AI Assistant');

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
    hName.textContent = 'ELCHIP Assistant';
    const hStatus = document.createElement('div');
    hStatus.className = 'assist-header-status';
    hStatus.textContent = '● Online — Ask me anything about semiconductors';
    hInfo.append(hName, hStatus);
    hLeft.append(hImg, hInfo);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'assist-close';
    closeBtn.setAttribute('aria-label', 'Close assistant');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => toggleAssistPanel(false));

    header.append(hLeft, closeBtn);

    // Messages area
    const messages = document.createElement('div');
    messages.className = 'assist-messages';
    messages.id = 'assist-messages';

    // Welcome message
    _appendBotMessage(messages, 'Hello! I\'m the ELCHIP Assistant 🔬\n\nI can help you understand semiconductor manufacturing — processes, inspection tools, industry companies, and technical concepts.\n\nTry asking:\n• "What is EUV lithography?"\n• "How does CMP work?"\n• "Tell me about TSMC"\n• "What inspection tools are used in etching?"\n• "Explain ion implantation"');

    // Input area
    const inputArea = document.createElement('div');
    inputArea.className = 'assist-input-area';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'assist-input';
    textInput.id = 'assist-input';
    textInput.placeholder = 'Ask about semiconductors...';
    textInput.setAttribute('autocomplete', 'off');
    textInput.setAttribute('aria-label', 'Ask a question');

    const sendBtn = document.createElement('button');
    sendBtn.className = 'assist-send';
    sendBtn.setAttribute('aria-label', 'Send message');
    sendBtn.textContent = '→';

    const handleSend = () => {
      const q = textInput.value.trim();
      if (!q) return;
      textInput.value = '';
      _appendUserMessage(messages, q);
      setTimeout(() => {
        const answer = _getAssistAnswer(q);
        _appendBotMessage(messages, answer);
      }, 400);
    };

    sendBtn.addEventListener('click', handleSend);
    textInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });

    inputArea.append(textInput, sendBtn);
    panel.append(header, messages, inputArea);

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

  function _appendBotMessage(container, text) {
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
    // Render multi-line text safely
    text.split('\n').forEach((line, i) => {
      if (i > 0) bubble.appendChild(document.createElement('br'));
      bubble.appendChild(document.createTextNode(line));
    });

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

  /* ── AI Assistant Knowledge Engine ─────────────────────────────────── */
  function _getAssistAnswer(query) {
    const q = query.toLowerCase().trim();
    const data = window.SEMI_DATA;

    // Navigation intent
    if (/^(go to|show|open|navigate to|take me to)\s/i.test(query)) {
      const target = q.replace(/^(go to|show|open|navigate to|take me to)\s/, '');
      if (target.includes('home') || target.includes('start')) return 'Going to the home page! Click: #/\n\nI\'ve noted your request — use the navigation links at the top to visit: Process Flow, Tools, or Companies.';
      if (target.includes('process') || target.includes('flow')) return 'Navigate to the Process Flow at the top nav or click Explore Process Flow on the home page!';
      if (target.includes('tool')) return 'You can find all Inspection & Metrology Tools by clicking "Tools" in the top navigation bar.';
      if (target.includes('compan')) return 'Click "Companies" in the top nav to see all foundries and equipment suppliers!';
    }

    // ── GLOSSARY / DEFINITION queries ──────────────────────────────────
    for (const entry of data.glossary) {
      if (q.includes(entry.term.toLowerCase())) {
        return `📖 ${entry.term}\n\n${entry.definition}\n\nSearch "${entry.term}" in the search bar to explore related content on ELCHIP.`;
      }
    }

    // ── PROCESS STEPS ──────────────────────────────────────────────────
    for (const step of data.steps) {
      if (q.includes(step.title.toLowerCase()) || q.includes(step.slug.replace(/-/g, ' '))) {
        return `⚙️ ${step.title} (Step ${step.stepNumber})\n\n${step.shortDesc}\n\n${step.overview ? step.overview.substring(0, 280) + '…' : ''}\n\nClick the process card on the Process Flow page or search "${step.title}" to read the full technical detail.`;
      }
    }

    // ── TOOLS ──────────────────────────────────────────────────────────
    for (const tool of data.tools) {
      if (q.includes(tool.name.toLowerCase()) || q.includes(tool.fullName.toLowerCase()) || q.includes(tool.slug.replace(/-/g, ' '))) {
        return `🔬 ${tool.name} — ${tool.fullName}\n\n${tool.principle ? tool.principle.substring(0, 250) + '…' : 'A key inspection and metrology tool in semiconductor manufacturing.'}\n\nVisit the Tools section to see the full technical page with SVG schematics.`;
      }
    }

    // ── COMPANIES ──────────────────────────────────────────────────────
    const allCos = [...data.companies.foundries, ...data.companies.equipment];
    for (const co of allCos) {
      if (q.includes(co.name.toLowerCase()) || q.includes(co.fullName.toLowerCase())) {
        return `🏢 ${co.name} (${co.country})\n\n${co.description.substring(0, 300)}…\n\nSpecialization: ${co.specialization}\n\nVisit the Companies section for detailed profiles.`;
      }
    }

    // ── SPECIFIC CONCEPTS ───────────────────────────────────────────────
    if (/euv|extreme ultraviolet/.test(q)) {
      return 'EUV (Extreme Ultraviolet) Lithography uses 13.5nm light to print features smaller than 7nm on chips. ASML is the sole manufacturer of EUV machines, which cost $150–200M each.\n\nKey facts:\n• 13.5nm wavelength (vs 193nm DUV)\n• Enables 3nm, 5nm chip nodes\n• Uses tin droplets + CO2 laser to generate EUV light\n• TSMC, Samsung, and Intel use EUV\n\nSearch "EUV" or "photolithography" on ELCHIP for more.';
    }
    if (/duv|deep ultraviolet|immersion/.test(q)) {
      return 'DUV (Deep Ultraviolet) Lithography uses 193nm wavelength light (ArF laser) and immersion techniques to pattern chips. It\'s the predecessor to EUV and still widely used for less advanced nodes.\n\nKey facts:\n• 193nm ArF laser\n• Immersion in water extends resolution to ~40nm\n• Multiple patterning extends to ~10nm with SAQP\n• Most fabs use DUV for non-critical layers\n\nExplore the Photolithography process step on ELCHIP!';
    }
    if (/cmp|chemical mechanical|planarization|polish/.test(q)) {
      return 'CMP (Chemical Mechanical Planarization) is a polishing process that achieves a globally flat wafer surface.\n\nHow it works:\n• Wafer pressed against polishing pad\n• Abrasive chemical slurry removes high spots\n• Endpoint detected optically or by friction\n• Achieves angstrom-level flatness\n\nUsed between every metal layer in chip making! See the CMP step on ELCHIP.';
    }
    if (/etch|plasma|rie|icp/.test(q)) {
      return 'Etching removes material from the wafer to create patterns.\n\nTypes:\n• Dry (Plasma) Etching: Uses ionized gas (RIE, ICP-RIE) — precise, anisotropic\n• Wet Etching: Chemical solution — isotropic, cheaper, less precise\n\nIn advanced nodes, DRIE (Deep RIE) creates high-aspect-ratio trenches for FinFETs and 3D NAND.\n\nSee the Etching step on ELCHIP for full technical details.';
    }
    if (/ion implant|doping|dopant|boron|phosphorus|arsenic/.test(q)) {
      return 'Ion Implantation introduces dopant atoms into silicon to create P-type or N-type regions (transistors).\n\nProcess:\n• Dopant ions (B, P, As) accelerated to 10–500 keV\n• Ions penetrate silicon to controlled depth\n• Annealing repairs crystal damage and activates dopants\n\nSuppliers: Axcelis Technologies (Purion series)\n\nFind the Ion Implantation page on ELCHIP.';
    }
    if (/cvd|ald|pvd|deposition|thin film/.test(q)) {
      return 'Thin Film Deposition adds material layers to the wafer:\n\n• CVD (Chemical Vapor Deposition): Gas-phase reaction, conformal coverage\n• ALD (Atomic Layer Deposition): One atomic layer at a time — ultimate control\n• PVD (Physical Vapor Deposition): Sputtering metals for interconnects\n• PECVD: Plasma-enhanced CVD at lower temperatures\n\nSuppliers: Applied Materials, Lam Research, Tokyo Electron\n\nSee the Deposition process on ELCHIP.';
    }
    if (/asml/.test(q)) {
      return '🇳🇱 ASML is the world\'s most critical semiconductor company — the sole supplier of EUV lithography machines.\n\nKey facts:\n• Founded 1984, HQ in Eindhoven, Netherlands\n• Market cap: ~$260B+\n• Each EUV machine costs $150–200M\n• 5,000+ suppliers for one machine\n• High-NA EUV machines cost $300M+\n\nWithout ASML, no sub-7nm chips could be made. See the Companies section on ELCHIP.';
    }
    if (/tsmc/.test(q)) {
      return '🇹🇼 TSMC (Taiwan Semiconductor Manufacturing Company) is the world\'s largest foundry with 55%+ global market share.\n\nKey facts:\n• Founded 1987 by Morris Chang\n• Manufactures chips for Apple, NVIDIA, AMD, Qualcomm\n• Current leading node: 2nm (N2)\n• 300mm GigaFabs in Taiwan, Arizona, Japan\n• Revenue: $80B+/year\n\nVisit the Companies page on ELCHIP for the full profile.';
    }
    if (/kla/.test(q)) {
      return '🇺🇸 KLA Corporation is the world\'s leading process control and defect inspection company.\n\nKey facts:\n• Based in Milpitas, California\n• Market cap: ~$90B+\n• Products used at virtually every process step\n• Optical inspection, e-beam review, overlay metrology\n• Critical for yield improvement\n\nSearch "KLA" or visit Companies on ELCHIP.';
    }

    // ── WHAT IS / HOW questions ─────────────────────────────────────────
    if (/what is (a |the |an )?wafer/.test(q)) {
      return 'A wafer is a thin, flat disc of semiconductor material (usually silicon) used as the substrate for integrated circuit fabrication.\n\nKey facts:\n• Standard size: 300mm diameter (12 inches)\n• Thickness: ~775 μm\n• 500-1000 chips per wafer\n• Made from 99.9999999% pure silicon (9N)\n• Grown via the Czochralski process from a seed crystal\n\nSee the Wafer Preparation process on ELCHIP!';
    }
    if (/what is (a |an )?transistor|how does (a |a |the )?transistor work/.test(q)) {
      return 'A transistor is a tiny electronic switch or amplifier that forms the basic building block of all modern chips.\n\nHow it works:\n• Apply voltage to Gate → Channel opens → Current flows (ON)\n• Remove voltage → Channel closes → No current (OFF)\n• A MOSFET has: Gate, Source, Drain, and Channel\n• Modern chips have 50–100+ billion transistors!\n\nModern types:\n• FinFET (fin-shaped 3D gate)\n• GAAFET/RibbonFET (wraps gate around channel)\n\nWatch the "How does a Transistor Work?" video in ELCHIP Videos!';
    }
    if (/what is (a |an )?yield|yield rate/.test(q)) {
      return 'Yield is the percentage of dies on a wafer that pass all electrical tests.\n\nKey facts:\n• Mature nodes (28nm+): 80–95% yield\n• Advanced nodes (3–5nm): 30–60% at launch\n• A 1% yield improvement = millions in profit\n• Yield killers: particles, overlay errors, film non-uniformity\n\nKLA Corporation\'s inspection tools are critical for improving yield!';
    }

    // ── COMPARISON questions ─────────────────────────────────────────────
    if (/difference between|compare|vs|versus/.test(q)) {
      if (/cvd.*ald|ald.*cvd/.test(q)) {
        return 'CVD vs ALD:\n\n• CVD (Chemical Vapor Deposition): Faster, good step coverage, batch process\n• ALD (Atomic Layer Deposition): 1 monolayer at a time, perfect conformality, slower\n\nUse ALD when you need ultra-thin, conformal films (e.g., high-k gate dielectric, barrier layers).\nUse CVD for thicker dielectrics, polysilicon, tungsten fill.';
      }
      if (/euv.*duv|duv.*euv/.test(q)) {
        return 'EUV vs DUV:\n\n• DUV: 193nm wavelength, ArF laser, needs multiple patterning for <40nm\n• EUV: 13.5nm wavelength, enables single-exposure patterning at <7nm\n• EUV machines: $150–200M each, made only by ASML\n• EUV is used for the most critical layers at 7nm and below\n• Most fabs use DUV for non-critical layers even on advanced nodes';
      }
      if (/wet.*dry|dry.*wet/.test(q)) {
        return 'Wet vs Dry Etching:\n\n• Wet Etching: Chemical bath, isotropic (etches all directions equally), simple and cheap, used for bulk removal\n• Dry Etching: Plasma-based (RIE, ICP-RIE), anisotropic (directional), precise, used for critical patterning\n\nAdvanced nodes exclusively use dry plasma etching for pattern transfer.';
      }
    }

    // ── HOW MANY questions ───────────────────────────────────────────────
    if (/how many (steps|process|phases|stage)/.test(q)) {
      return `ELCHIP covers ${data.steps.length} major manufacturing process steps:\n\n${data.steps.map(s => `${s.stepNumber}. ${s.title}`).join('\n')}\n\nEach step has its own detailed page with technical parameters, inspection tools, and supplier profiles.`;
    }
    if (/how many (tool|inspection|metrology)/.test(q)) {
      return `ELCHIP covers ${data.tools.length} inspection and metrology tools:\n\n${data.tools.map(t => `• ${t.name} — ${t.fullName}`).join('\n')}\n\nClick "Tools" in the navigation to explore each one.`;
    }
    if (/how many (compan|foundry|foundries|supplier)/.test(q)) {
      return `ELCHIP profiles ${data.companies.foundries.length + data.companies.equipment.length} companies:\n\nFoundries: ${data.companies.foundries.map(c => c.name).join(', ')}\n\nEquipment: ${data.companies.equipment.map(c => c.name).join(', ')}\n\nVisit the Companies section for detailed profiles.`;
    }

    // ── HELP / GUIDE ─────────────────────────────────────────────────────
    if (/help|guide|how to use|what can you|what do you know/.test(q)) {
      return 'I can help you with:\n\n🔬 Process steps — photolithography, etching, CMP, deposition, ion implantation, packaging, and more\n\n🛠 Inspection tools — CD-SEM, Ellipsometer, AOI, XRD, E-Beam Inspector, and more\n\n🏢 Companies — TSMC, ASML, KLA, Applied Materials, Samsung, Intel, and more\n\n📖 Definitions — technical terms like EUV, wafer, dopant, yield, overlay\n\n💡 Comparisons — CVD vs ALD, EUV vs DUV, wet vs dry etching\n\nJust ask your question and I\'ll do my best to answer!';
    }

    // ── GREETING ─────────────────────────────────────────────────────────
    if (/^(hi|hello|hey|howdy|sup|yo)\b/.test(q)) {
      return 'Hello! 👋 I\'m the ELCHIP Assistant, your guide to semiconductor manufacturing.\n\nAsk me anything about:\n• Manufacturing processes (EUV, CMP, Etching, etc.)\n• Inspection tools (CD-SEM, Ellipsometer, etc.)\n• Companies (TSMC, ASML, KLA, etc.)\n• Technical concepts and definitions\n\nWhat would you like to know?';
    }

    // ── DEFAULT fallback ──────────────────────────────────────────────────
    return `I found your query: "${query}"\n\nI don't have a specific answer for that, but try:\n\n1. 🔍 Use the search bar above to search across the ELCHIP database, Wikipedia, and curated videos\n2. 📖 Browse the Process Flow for manufacturing steps\n3. 🔬 Visit the Tools section for inspection equipment\n4. 🏢 Check Companies for industry profiles\n\nOr rephrase — ask "What is [term]?" or "How does [process] work?"`;
  }

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    buildAssistBot();
    setTimeout(hideLoadingScreen, 800);
  });

})();
