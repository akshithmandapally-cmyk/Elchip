/* ─── app.js — Hash Router, Navigation, Search ───────────────────────────
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

    // Search
    const searchWrap = document.createElement('div');
    searchWrap.className = 'nav-search';
    searchWrap.setAttribute('role', 'search');

    // Search icon (static SVG via DOMParser)
    const svgDoc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'image/svg+xml'
    );
    searchWrap.appendChild(document.importNode(svgDoc.documentElement, true));

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'nav-search-input';
    searchInput.placeholder = 'Query Semiconductor Knowledge Base...';
    searchInput.setAttribute('aria-label', 'Search the platform');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('spellcheck', 'false');
    searchWrap.appendChild(searchInput);

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

    // Search handler — Security: renders only textContent, never innerHTML with input
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => performSearch(searchInput.value, resultsDropdown), 300);
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
          openSearchOverlay(q);
        }
      }
    });

    updateNavActive(window.location.hash || '#/');
  }

  /* ── Helper functions for header combined search ───────────────────── */
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

  async function fetchLiveVideos(query) {
    try {
      const res = await fetch('https://yewtu.be/api/v1/search?q=' + encodeURIComponent(query) + '&type=video');
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data.slice(0, 2) : [];
      }
      return [];
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

    // 1. Search internal database instantly
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
          type: 'Glossary Term', icon: '📖',
          name: entry.term,
          sub: entry.definition.substring(0, 50) + '…',
          glossaryTerm: entry.term,
          glossaryDef: entry.definition
        });
      }
    });

    // Curated videos matching query
    const matchedCuratedVideos = CURATED_VIDEOS.filter(v => {
      return v.title.toLowerCase().includes(query) || 
             v.desc.toLowerCase().includes(query) ||
             v.tags.some(tag => tag.includes(query));
    }).map(v => ({
      type: 'Video Guide', icon: '▶',
      name: v.title,
      sub: v.channel + ' — Curated Video',
      videoId: v.videoId,
      videoTitle: v.title,
      videoChannel: v.channel
    }));

    let combinedResults = [...internalResults, ...matchedCuratedVideos];

    // Show initial local results
    renderHeaderDropdownResults(combinedResults.slice(0, 6), dropdown, rawQuery, true);

    // 2. Fetch external results asynchronously
    const currentInputToken = query;
    Promise.allSettled([
      fetchWikipediaResults(query),
      fetchLiveVideos(query)
    ]).then(outputs => {
      const inputVal = document.getElementById('nav-search-input')?.value.trim().toLowerCase();
      if (inputVal !== currentInputToken) return;

      const wikiHits = outputs[0].status === 'fulfilled' ? outputs[0].value : [];
      const videoHits = outputs[1].status === 'fulfilled' ? outputs[1].value : [];

      wikiHits.forEach(hit => {
        combinedResults.push({
          type: 'Wikipedia', icon: '📖',
          name: hit.title,
          sub: 'Read encyclopedia article in-site',
          wikiTitle: hit.title
        });
      });

      videoHits.forEach(hit => {
        combinedResults.push({
          type: 'Video', icon: '▶',
          name: hit.title,
          sub: 'Watch video guide in-site',
          videoId: hit.videoId,
          videoTitle: hit.title,
          videoChannel: hit.author || 'YouTube'
        });
      });

      renderHeaderDropdownResults(combinedResults.slice(0, 8), dropdown, rawQuery, false);
    });
  }

  function renderHeaderDropdownResults(results, dropdown, query, isLoadingExternal) {
    dropdown.replaceChildren();

    if (results.length === 0 && !isLoadingExternal) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No matching information found. Press Enter to search everywhere.';
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
      sub.textContent = result.type + ' · ' + result.sub;

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
          _switchTab('wikipedia', query);
          setTimeout(() => _openWikiReader(result.wikiTitle), 350);
        } else if (result.videoId) {
          openSearchOverlay(query);
          _switchTab('videos', query);
          setTimeout(() => _playVideoInApp(result.videoId, result.videoTitle, result.videoChannel), 350);
        }
      };

      item.addEventListener('click', handleSelect);
      item.addEventListener('keydown', e => { if (e.key === 'Enter') handleSelect(); });
      dropdown.appendChild(item);
    });

    if (isLoadingExternal) {
      const loader = document.createElement('div');
      loader.className = 'dropdown-external-loader';
      loader.textContent = 'Searching Wikipedia & YouTube...';
      dropdown.appendChild(loader);
    }

    const evBtn = document.createElement('div');
    evBtn.className = 'search-everywhere-btn';
    evBtn.setAttribute('role', 'button');
    evBtn.setAttribute('tabindex', '0');
    evBtn.setAttribute('aria-label', 'Search everywhere');

    const evLabel = document.createElement('span');
    evLabel.textContent = 'Search everywhere';

    const evQuery = document.createElement('span');
    evQuery.className = 'search-everywhere-query';
    evQuery.textContent = '“' + query + '” →';

    evBtn.append(evLabel, evQuery);
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
     EXTERNAL SEARCH OVERLAY
     Tabs: This Site | Wikipedia | Videos
     Security: all user input inserted via textContent only
     Wikipedia REST API: CORS-enabled, no API key required
     YouTube: embedded search iframe (listType=search)
     ═══════════════════════════════════════════════════════════════════════ */

  let _searchOverlayEl = null;
  let _activeTab = 'internal';
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
    "What happens if a dust particle lands on a wafer? (Total disaster)",
    "How many transistors can fit on a pinhead?"
  ];

  const CURATED_VIDEOS = [
    {
      title: "How Microchips are Made",
      videoId: "g8SCA-3_p_0",
      channel: "Branch Education",
      desc: "A highly detailed, 3D animated walkthrough of the entire semiconductor fabrication process, explaining photolithography, deposition, and etching.",
      tags: ["process", "fabrication", "how", "made", "transistor", "lithography", "silicon", "microchip", "overview"]
    },
    {
      title: "The Extreme Physics of EUV Lithography",
      videoId: "5Ge2R8l8oJk",
      channel: "Asianometry",
      desc: "An in-depth look at ASML's Extreme Ultraviolet (EUV) lithography systems, explaining how liquid tin droplets and lasers create 13.5nm light.",
      tags: ["euv", "lithography", "asml", "light", "exposure", "physics", "lens", "mirror"]
    },
    {
      title: "How does a Transistor Work?",
      videoId: "IcrBqCFLHIY",
      channel: "Veritasium",
      desc: "A clear and visual explanation of semiconductors, p-n junctions, and how silicon transistors act as electronic switches.",
      tags: ["transistor", "semiconductor", "pn junction", "physics", "silicon", "switch", "mosfet"]
    },
    {
      title: "Inside a Silicon Wafer Fab: Cleanroom Tour",
      videoId: "gXN-7rLp66w",
      channel: "Intel Corporation",
      desc: "Take a look inside Intel's state-of-the-art D1X factory in Oregon, showing the automated transport systems (AMHS) and cleanroom clothing.",
      tags: ["fab", "cleanroom", "intel", "wafer", "factory", "automation", "tour"]
    },
    {
      title: "Silicon Wafer Production: How Sand Becomes Wafers",
      videoId: "AMg4mX368L0",
      channel: "Shin-Etsu Silicon",
      desc: "Shows the step-by-step process of growing a single-crystal silicon ingot (Czochralski process) and slicing it into 300mm wafers.",
      tags: ["wafer", "silicon", "ingot", "czochralski", "slicing", "polishing", "crystal"]
    },
    {
      title: "What is Photolithography? Semiconductor Manufacturing 101",
      videoId: "7qJ4n3b_V8k",
      channel: "Applied Materials",
      desc: "A foundational introduction to the photolithography process: photoresist spin-coating, exposure through a photomask, and development.",
      tags: ["lithography", "photolithography", "photoresist", "mask", "exposure", "spin coating"]
    },
    {
      title: "Chemical Mechanical Planarization (CMP) Explained",
      videoId: "3rR_rWc9T7s",
      channel: "Applied Materials",
      desc: "An educational animation demonstrating how chemical slurries and polishing pads planarize wafer surfaces to atomic flatness.",
      tags: ["cmp", "planarization", "polishing", "slurry", "chemical mechanical planarization"]
    },
    {
      title: "Dry Etching and Wet Etching Processes",
      videoId: "T4bL8B4SjX0",
      channel: "Lam Research",
      desc: "A detailed breakdown of isotropic wet etching and anisotropic dry plasma etching processes used to carve microchip patterns.",
      tags: ["etching", "etch", "plasma", "dry etching", "wet etching", "anisotropic", "isotropic"]
    },
    {
      title: "Chemical Vapor Deposition (CVD) and Atomic Layer Deposition (ALD)",
      videoId: "kO3Q_JbE_bA",
      channel: "Lam Research",
      desc: "Explains how gaseous precursors react at wafer surfaces to deposit ultra-thin, conformal oxide and metal layers down to the atomic scale.",
      tags: ["deposition", "cvd", "ald", "thin film", "atomic layer deposition", "chemical vapor deposition"]
    },
    {
      title: "Semiconductor Metrology & Inspection Systems",
      videoId: "9H5H3rXy6sQ",
      channel: "KLA Corporation",
      desc: "How optical and electron beam inspection systems detect sub-nanometer defects in high-volume semiconductor manufacturing.",
      tags: ["metrology", "inspection", "defect", "kla", "optical", "e-beam", "measuring"]
    },
    {
      title: "Advanced IC Packaging & Heterogeneous Integration",
      videoId: "u9S0e4Uv4a0",
      channel: "ASE Group",
      desc: "Explains advanced packaging methods like system-in-package (SiP), 2.5D/3D stacking, and micro-bumps that connect multiple chiplets.",
      tags: ["packaging", "package", "chiplet", "wire bonding", "die", "stacking", "3d", "sip"]
    },
    {
      title: "How ASML Builds the World's Most Complex Machines",
      videoId: "dqV5U2iP514",
      channel: "CNBC",
      desc: "A documentary on the supply chain, precision engineering, and business strategy behind ASML's monopoly on lithography equipment.",
      tags: ["asml", "lithography", "euv", "duv", "company", "supply chain", "monopoly"]
    },
    {
      title: "Taiwan Semiconductor Manufacturing Company (TSMC) Fab Tour",
      videoId: "y1vA7W2O2Jk",
      channel: "TSMC",
      desc: "A look inside TSMC's GigaFabs, highlighting cleanroom automation, robotic wafer routing, and the scale of modern contract manufacturing.",
      tags: ["tsmc", "foundry", "fab", "gigafab", "taiwan", "contract manufacturing"]
    }
  ];

  function openSearchOverlay(query) {
    if (!_searchOverlayEl) _buildSearchOverlay();
    _currentQuery = query;

    // Pre-fill input
    const input = _searchOverlayEl.querySelector('#overlay-search-input');
    if (input) {
      input.value = query;
      // Set random funny placeholder
      const rand = FUNNY_PLACEHOLDERS[Math.floor(Math.random() * FUNNY_PLACEHOLDERS.length)];
      input.placeholder = rand;
    }

    _searchOverlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (input) input.focus();

    _switchTab(_activeTab, query);
  }

  function _closeSearchOverlay() {
    if (_searchOverlayEl) {
      _searchOverlayEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function _switchTab(tab, query) {
    _activeTab = tab;
    if (!_searchOverlayEl) return;

    // Update tab button states
    _searchOverlayEl.querySelectorAll('.search-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Show correct panel
    _searchOverlayEl.querySelectorAll('.search-panel').forEach(p => p.classList.remove('active'));
    const activePanel = _searchOverlayEl.querySelector('#panel-' + tab);
    if (activePanel) activePanel.classList.add('active');

    // If query is empty, show funny suggestions
    if (!query || query.trim().length < 1) {
      if (activePanel) _showFunnySuggestions(activePanel);
      return;
    }

    const trimmedQuery = query.trim();
    if (tab === 'internal') _showInternalResults(trimmedQuery);
    else if (tab === 'wikipedia') _showWikiResults(trimmedQuery);
    else if (tab === 'web') _showWebResults(trimmedQuery);
    else if (tab === 'videos') _showVideoResults(trimmedQuery);
  }

  function _showFunnySuggestions(panel) {
    panel.replaceChildren();

    const container = document.createElement('div');
    container.className = 'suggestions-container';

    const title = document.createElement('h3');
    title.className = 'suggestions-title';
    title.textContent = "Need search inspiration? Try one of these:";

    const grid = document.createElement('div');
    grid.className = 'suggestions-grid';

    // Pick 4 random funny lines
    const shuffled = [...FUNNY_PLACEHOLDERS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    selected.forEach(line => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-bubble';
      btn.textContent = "⚡ " + line;
      btn.addEventListener('click', () => {
        const input = document.getElementById('overlay-search-input');
        if (input) {
          input.value = line;
          _currentQuery = line;
          _switchTab(_activeTab, line);
        }
      });
      grid.appendChild(btn);
    });

    container.append(title, grid);
    panel.appendChild(container);
  }

  function _buildSearchOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'External search');

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
    input.placeholder = 'Search semiconductor topics…';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Search query');

    let _overlayDebounce;
    input.addEventListener('input', () => {
      clearTimeout(_overlayDebounce);
      _overlayDebounce = setTimeout(() => {
        _currentQuery = input.value.trim();
        _switchTab(_activeTab, _currentQuery);
      }, 400);
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

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'search-tabs';

    [
      { id: 'internal', label: 'This Site', emoji: '⚡' },
      { id: 'wikipedia', label: 'Wikipedia', emoji: '📖' },
      { id: 'web',      label: 'Web Search', emoji: '🌐' },
      { id: 'videos',   label: 'Videos',    emoji: '▶' },
    ].forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'search-tab' + (t.id === _activeTab ? ' active' : '');
      btn.dataset.tab = t.id;
      btn.textContent = t.emoji + '  ' + t.label;
      btn.setAttribute('aria-label', 'Search ' + t.label);
      btn.addEventListener('click', () => _switchTab(t.id, _currentQuery));
      tabs.appendChild(btn);
    });

    header.append(bar, tabs);

    /* ── Result panels ─────────────────────────────────────────────── */
    const body = document.createElement('div');
    body.className = 'search-overlay-body';

    ['internal', 'wikipedia', 'web', 'videos'].forEach(id => {
      const panel = document.createElement('div');
      panel.className = 'search-panel' + (id === _activeTab ? ' active' : '');
      panel.id = 'panel-' + id;
      body.appendChild(panel);
    });

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

  /* ── Wikipedia search via Query API ───────────────────────────────── */
  async function _showWikiResults(query) {
    const panel = document.getElementById('panel-wikipedia');
    if (!panel) return;
    _setLoading(panel, 'Searching Wikipedia');

    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search' +
        '&srsearch=' + encodeURIComponent(query) +
        '&format=json&origin=*&utf8=1&srlimit=6';

      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const hits = (data.query && data.query.search) || [];

      panel.replaceChildren();
      if (hits.length === 0) { _setEmpty(panel, '📖', 'No Wikipedia articles found for this query.'); return; }

      for (const hit of hits.slice(0, 5)) {
        const card = await _buildWikiCard(hit.title);
        if (card) panel.appendChild(card);
      }
    } catch (_err) {
      panel.replaceChildren();
      _setEmpty(panel, '⚠️', 'Could not reach Wikipedia. Check your internet connection.');
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
        img.width = 68;
        img.height = 68;
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
      readBtn.textContent = '📖 Read in Site';
      readBtn.addEventListener('click', () => {
        _openWikiReader(d.title || title);
      });

      const extLink = document.createElement('a');
      extLink.className = 'wiki-result-link';
      extLink.href = (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || '#';
      extLink.target = '_blank';
      extLink.rel = 'noopener noreferrer';
      extLink.textContent = 'Open Page ↗';

      footer.append(readBtn, extLink);
      textEl.append(titleEl, extract, footer);
      card.appendChild(textEl);
      return card;
    } catch (_e) {
      return null;
    }
  }

  /* ── Wikipedia In-App Reader ──────────────────────────────────────── */
  async function _openWikiReader(title) {
    const panel = document.getElementById('panel-wikipedia');
    if (!panel) return;
    _setLoading(panel, 'Loading Wikipedia article...');

    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1' +
        '&titles=' + encodeURIComponent(title) +
        '&format=json&origin=*';

      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      
      const pages = (data.query && data.query.pages) || {};
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (!page || !page.extract || page.extract.trim().length === 0) {
        throw new Error('Article content is empty');
      }

      panel.replaceChildren();

      const reader = document.createElement('div');
      reader.className = 'wiki-reader';

      const backBtn = document.createElement('button');
      backBtn.className = 'btn btn-ghost wiki-reader-back';
      backBtn.textContent = '← Back to articles';
      backBtn.addEventListener('click', () => {
        _switchTab('wikipedia', _currentQuery);
      });

      const header = document.createElement('div');
      header.className = 'wiki-reader-header';

      const hTitle = document.createElement('h2');
      hTitle.className = 'wiki-reader-title';
      hTitle.textContent = page.title;

      const credit = document.createElement('div');
      credit.className = 'wiki-reader-credit';
      credit.textContent = 'Encyclopedia Entry';

      const sourceLink = document.createElement('a');
      sourceLink.className = 'wiki-reader-source';
      sourceLink.href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title);
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = 'Open Wikipedia Webpage ↗';

      header.append(hTitle, credit, sourceLink);

      const content = document.createElement('div');
      content.className = 'wiki-reader-content';

      const lines = page.extract.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.length === 0) return;

        if (trimmed.startsWith('==') && trimmed.endsWith('==')) {
          let level = 0;
          while (trimmed[level] === '=') {
            level++;
          }
          const headingText = trimmed.replace(/={2,}/g, '').trim();
          let hTag = 'h3';
          if (level === 2) hTag = 'h3';
          else if (level === 3) hTag = 'h4';
          else hTag = 'h5';

          const heading = document.createElement(hTag);
          heading.className = 'wiki-reader-heading';
          heading.textContent = headingText;
          content.appendChild(heading);
        } else if (trimmed.startsWith('* ')) {
          const li = document.createElement('li');
          li.className = 'wiki-reader-list-item';
          li.textContent = trimmed.substring(2);
          content.appendChild(li);
        } else {
          const p = document.createElement('p');
          p.className = 'wiki-reader-paragraph';
          p.textContent = trimmed;
          content.appendChild(p);
        }
      });

      reader.append(backBtn, header, content);
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
      back.addEventListener('click', () => _switchTab('wikipedia', _currentQuery));
      wrap.append(icon, msg, back);
      panel.appendChild(wrap);
    }
  }

  /* ── DuckDuckGo Web Search ────────────────────────────────────────── */
  async function _showWebResults(query) {
    const panel = document.getElementById('panel-web');
    if (!panel) return;
    _setLoading(panel, 'Searching the Web');

    try {
      const url = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&origin=*';
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      panel.replaceChildren();

      const container = document.createElement('div');
      container.className = 'web-results-container';

      if (data.AbstractText && data.AbstractText.trim().length > 0) {
        const answerCard = document.createElement('div');
        answerCard.className = 'web-answer-card';

        const badge = document.createElement('span');
        badge.className = 'badge badge-white';
        badge.style.marginBottom = '0.5rem';
        badge.textContent = 'Web Summary';

        const title = document.createElement('div');
        title.className = 'web-answer-title';
        title.textContent = data.Heading || query;

        const body = document.createElement('p');
        body.className = 'web-answer-body';
        body.textContent = data.AbstractText;

        const source = document.createElement('div');
        source.className = 'web-answer-source';
        const sourceLink = document.createElement('a');
        sourceLink.href = data.AbstractURL || '#';
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        sourceLink.textContent = 'Source: ' + (data.AbstractSource || 'DuckDuckGo') + ' ↗';
        source.appendChild(sourceLink);

        answerCard.append(badge, title, body, source);
        container.appendChild(answerCard);
      }

      const topics = data.RelatedTopics || [];
      const validTopics = topics.filter(t => t.Text && t.FirstURL);

      if (validTopics.length > 0) {
        const listTitle = document.createElement('h3');
        listTitle.className = 'web-list-title';
        listTitle.textContent = 'Related Search Results';
        container.appendChild(listTitle);

        validTopics.slice(0, 5).forEach(topic => {
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
          link.textContent = 'Link ↗';

          card.append(text, link);
          container.appendChild(card);
        });
      }

      if (!data.AbstractText && validTopics.length === 0) {
        _setEmpty(panel, '🌐', 'No instant web results found. Try other tabs.');
        return;
      }

      panel.appendChild(container);
    } catch (_err) {
      panel.replaceChildren();
      _setEmpty(panel, '⚠️', 'Could not reach DuckDuckGo. Check your internet connection.');
    }
  }

  /* ── In-App Video Search & Player ─────────────────────────────────── */
  async function _showVideoResults(query) {
    const panel = document.getElementById('panel-videos');
    if (!panel) return;
    _setLoading(panel, 'Searching Videos');

    try {
      const q = query.toLowerCase();
      // Search local curated videos
      const localHits = CURATED_VIDEOS.filter(v => {
        return v.title.toLowerCase().includes(q) || 
               v.desc.toLowerCase().includes(q) ||
               v.tags.some(tag => tag.includes(q));
      });

      // Fetch live results from Invidious API
      let apiHits = [];
      try {
        const apiInstances = [
          'https://yewtu.be',
          'https://invidious.projectsegfau.lt'
        ];
        const res = await fetch(apiInstances[0] + '/api/v1/search?q=' + encodeURIComponent(query) + '&type=video');
        if (res.ok) {
          const resData = await res.json();
          apiHits = Array.isArray(resData) ? resData : [];
        }
      } catch (_e) {
        console.warn("Invidious API fetch failed, using local curated videos fallback.");
      }

      panel.replaceChildren();

      // Combine lists and deduplicate
      const seenIds = new Set();
      const combined = [];

      localHits.forEach(v => {
        seenIds.add(v.videoId);
        combined.push({
          videoId: v.videoId,
          title: v.title,
          channel: v.channel,
          desc: v.desc
        });
      });

      apiHits.forEach(v => {
        if (!seenIds.has(v.videoId)) {
          seenIds.add(v.videoId);
          combined.push({
            videoId: v.videoId,
            title: v.title,
            channel: v.author || 'YouTube Video',
            desc: v.description || 'Watch semiconductor video guides.'
          });
        }
      });

      if (combined.length === 0) {
        _setEmpty(panel, '▶', 'No video results found. Search for terms like: EUV, lithography, wafer, transistor.');
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'video-results-grid';

      combined.slice(0, 10).forEach(video => {
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

      panel.appendChild(grid);
    } catch (_err) {
      panel.replaceChildren();
      _setEmpty(panel, '⚠️', 'Could not load videos. Check your internet connection.');
    }
  }

  function _playVideoInApp(videoId, title, channel) {
    const panel = document.getElementById('panel-videos');
    if (!panel) return;
    panel.replaceChildren();

    const playerContainer = document.createElement('div');
    playerContainer.className = 'video-player-container';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-ghost video-player-back';
    backBtn.textContent = '← Back to videos';
    backBtn.addEventListener('click', () => {
      _showVideoResults(_currentQuery);
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

  /* ── Internal site search (grouped) ───────────────────────────────── */
  function _showInternalResults(query) {
    const panel = document.getElementById('panel-internal');
    if (!panel) return;
    panel.replaceChildren();

    const data = window.SEMI_DATA;
    const q = query.toLowerCase();
    const groups = {};

    data.steps.forEach(step => {
      if (!step.title.toLowerCase().includes(q) && !step.shortDesc.toLowerCase().includes(q)) return;
      (groups['Process Steps'] = groups['Process Steps'] || []).push({
        icon: '⚙️', name: step.title, sub: 'Step ' + step.stepNumber, href: '#/process/' + step.slug
      });
    });

    data.tools.forEach(tool => {
      if (!tool.name.toLowerCase().includes(q) && !tool.fullName.toLowerCase().includes(q)) return;
      (groups['Inspection Tools'] = groups['Inspection Tools'] || []).push({
        icon: tool.icon, name: tool.name, sub: tool.fullName, href: '#/tool/' + tool.slug
      });
    });

    [...data.companies.foundries, ...data.companies.equipment].forEach(co => {
      if (!co.name.toLowerCase().includes(q) && !co.country.toLowerCase().includes(q)) return;
      (groups['Companies'] = groups['Companies'] || []).push({
        icon: co.flag || '🏢', name: co.name, sub: co.country, href: '#/companies'
      });
    });

    data.glossary.forEach(entry => {
      if (!entry.term.toLowerCase().includes(q) && !entry.definition.toLowerCase().includes(q)) return;
      (groups['Glossary'] = groups['Glossary'] || []).push({
        icon: '📖', name: entry.term,
        sub: entry.definition.substring(0, 60) + '…',
        href: '#/glossary',
        glossaryTerm: entry.term, glossaryDef: entry.definition
      });
    });

    if (Object.keys(groups).length === 0) {
      _setEmpty(panel, '🔍', 'Nothing found in the platform database.\nTry the Wikipedia or Videos tab.');
      return;
    }

    Object.entries(groups).forEach(([groupName, items]) => {
      const group = document.createElement('div');
      group.className = 'internal-result-group';

      const lbl = document.createElement('div');
      lbl.className = 'internal-result-group-label';
      lbl.textContent = groupName; // textContent — safe
      group.appendChild(lbl);

      items.forEach(item => {
        const el = document.createElement('a');
        el.className = 'internal-result-item';
        el.href = item.href;
        el.setAttribute('aria-label', item.name);

        const icon = document.createElement('div');
        icon.className = 'internal-result-icon';
        icon.textContent = item.icon; // textContent — safe

        const info = document.createElement('div');
        info.style.flex = '1';
        const nameEl = document.createElement('div');
        nameEl.className = 'internal-result-name';
        nameEl.textContent = item.name; // textContent — safe
        const subEl = document.createElement('div');
        subEl.className = 'internal-result-sub';
        subEl.textContent = item.sub; // textContent — safe
        info.append(nameEl, subEl);
        el.append(icon, info);

        el.addEventListener('click', () => {
          _closeSearchOverlay();
          if (item.glossaryTerm) {
            setTimeout(() => window.openGlossary(item.glossaryTerm, item.glossaryDef), 300);
          }
        });

        group.appendChild(el);
      });

      panel.appendChild(group);
    });
  }

  /* ── State helpers ─────────────────────────────────────────────────── */
  function _setLoading(panel, msg) {
    panel.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'search-loading';
    const spinner = document.createElement('div');
    spinner.className = 'search-spinner';
    const txt = document.createElement('span');
    txt.textContent = msg; // textContent — safe
    wrap.append(spinner, txt);
    panel.appendChild(wrap);
  }

  function _setEmpty(panel, icon, msg) {
    panel.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'search-empty-state';
    const iconEl = document.createElement('span');
    iconEl.className = 'icon';
    iconEl.textContent = icon;
    const msgEl = document.createElement('p');
    msgEl.textContent = msg; // textContent — safe
    wrap.append(iconEl, msgEl);
    panel.appendChild(wrap);
  }

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    setTimeout(hideLoadingScreen, 800);
  });

})();
