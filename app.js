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
    '/process-flow':() => window.renderHome(getApp()),
    '/process/:slug': (params) => window.renderProcess(getApp(), params.slug),
    '/tool/:slug':  (params) => window.renderTool(getApp(), params.slug),
    '/tools':       () => window.renderToolsList(getApp()),
    '/companies':   () => window.renderCompanies(getApp()),
    '/glossary':    () => renderGlossaryPage(getApp()),
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

    // Links
    const ul = document.createElement('ul');
    ul.className = 'nav-links';
    ul.id = 'nav-links';

    const navItems = [
      { label: 'Process Flow', href: '#/process-flow' },
      { label: 'Tools', href: '#/tools' },
      { label: 'Companies', href: '#/companies' },
      { label: 'Glossary', href: '#/glossary' },
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
    searchInput.placeholder = 'Search processes, tools…';
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
      searchDebounce = setTimeout(() => performSearch(searchInput.value, resultsDropdown), 150);
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

  /* ─── SEARCH ENGINE ─────────────────────────────────────────────────── */
  function performSearch(rawQuery, dropdown) {
    // Security: query is only ever inserted via textContent
    const query = rawQuery.trim().toLowerCase();

    if (query.length < 1) {
      dropdown.classList.remove('visible');
      return;
    }

    const data = window.SEMI_DATA;
    const results = [];

    // Search processes
    data.steps.forEach(step => {
      if (
        step.title.toLowerCase().includes(query) ||
        step.shortDesc.toLowerCase().includes(query) ||
        step.slug.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'Process', icon: '⚙️',
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
        results.push({
          type: 'Tool', icon: tool.icon,
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
        results.push({
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
        results.push({
          type: 'Glossary', icon: '📖',
          name: entry.term,
          sub: entry.definition.substring(0, 50) + '…',
          href: '#/glossary',
          glossaryTerm: entry.term,
          glossaryDef: entry.definition
        });
      }
    });

    renderSearchResults(results.slice(0, 8), dropdown);
  }

  function renderSearchResults(results, dropdown) {
    // Security: All content set via textContent — no innerHTML with user-controlled data
    dropdown.replaceChildren();

    if (results.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No results found';
      dropdown.appendChild(empty);
      dropdown.classList.add('visible');
      return;
    }

    results.forEach(result => {
      const item = document.createElement('a');
      item.className = 'search-result-item';
      item.href = result.href;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-label', result.type + ': ' + result.name);

      const iconEl = document.createElement('div');
      iconEl.className = 'search-result-icon';
      iconEl.textContent = result.icon; // textContent — emoji only

      const text = document.createElement('div');
      text.className = 'search-result-text';

      const name = document.createElement('div');
      name.className = 'search-result-name';
      name.textContent = result.name; // textContent — safe

      const sub = document.createElement('div');
      sub.className = 'search-result-type';
      sub.textContent = result.type + ' · ' + result.sub; // textContent — safe

      text.append(name, sub);
      item.append(iconEl, text);

      item.addEventListener('click', () => {
        dropdown.classList.remove('visible');
        const input = document.getElementById('nav-search-input');
        if (input) input.value = '';
        if (result.glossaryTerm) {
          setTimeout(() => window.openGlossary(result.glossaryTerm, result.glossaryDef), 300);
        }
      });

      dropdown.appendChild(item);
    });

    // Footer: "Search everywhere" — opens full overlay with Wikipedia + YouTube tabs
    const evBtn = document.createElement('div');
    evBtn.className = 'search-everywhere-btn';
    evBtn.setAttribute('role', 'button');
    evBtn.setAttribute('tabindex', '0');
    evBtn.setAttribute('aria-label', 'Search everywhere');

    const evLabel = document.createElement('span');
    evLabel.textContent = 'Search everywhere';

    const evQuery = document.createElement('span');
    evQuery.className = 'search-everywhere-query';
    const navInput = document.getElementById('nav-search-input');
    evQuery.textContent = navInput ? '\u201c' + navInput.value.trim() + '\u201d \u2192' : '\u2192';

    evBtn.append(evLabel, evQuery);
    evBtn.addEventListener('click', () => {
      const q = navInput ? navInput.value.trim() : '';
      if (q.length > 0) {
        dropdown.classList.remove('visible');
        openSearchOverlay(q);
      }
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

  /* ─── GLOSSARY PAGE ─────────────────────────────────────────────────── */
  function renderGlossaryPage(container) {
    const data = window.SEMI_DATA;
    const frag = document.createDocumentFragment();

    const hero = document.createElement('div');
    hero.style.cssText = 'padding:5rem 0 3rem; border-bottom:1px solid rgba(255,255,255,0.06);';
    const heroInner = document.createElement('div');
    heroInner.className = 'container page-enter';
    const lbl = document.createElement('span');
    lbl.className = 'section-label';
    lbl.textContent = 'Quick Reference';
    const h1 = document.createElement('h1');
    h1.style.cssText = 'font-size:clamp(2rem,5vw,3.5rem); font-weight:900; letter-spacing:-0.03em; margin-bottom:1rem;';
    h1.textContent = 'Semiconductor Glossary';
    const sub = document.createElement('p');
    sub.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.55); max-width:520px; line-height:1.75;';
    sub.textContent = 'Essential terminology for understanding IC fabrication processes, metrology, and the semiconductor supply chain.';
    heroInner.append(lbl, h1, sub);
    hero.appendChild(heroInner);
    frag.appendChild(hero);

    const main = document.createElement('main');
    main.className = 'container page-enter';
    main.style.cssText = 'padding-top:3rem; padding-bottom:4rem;';

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1rem;';

    data.glossary.forEach(entry => {
      const card = document.createElement('div');
      card.style.cssText = 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:1.25rem; cursor:pointer; transition:all 0.2s ease;';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Definition of ' + entry.term);

      const termEl = document.createElement('div');
      termEl.style.cssText = 'font-size:1rem; font-weight:700; color:#fff; margin-bottom:0.5rem; font-family:var(--mono); letter-spacing:-0.01em;';
      termEl.textContent = entry.term; // textContent — safe

      const defEl = document.createElement('div');
      defEl.style.cssText = 'font-size:0.85rem; color:rgba(255,255,255,0.55); line-height:1.65;';
      defEl.textContent = entry.definition; // textContent — safe

      card.append(termEl, defEl);

      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'rgba(103,232,249,0.25)';
        card.style.background = 'rgba(255,255,255,0.07)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(255,255,255,0.1)';
        card.style.background = 'rgba(255,255,255,0.04)';
      });
      card.addEventListener('click', () => window.openGlossary(entry.term, entry.definition));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.openGlossary(entry.term, entry.definition);
      });

      grid.appendChild(card);
    });

    main.appendChild(grid);
    frag.appendChild(main);
    frag.appendChild(window._buildFooter());
    container.appendChild(frag);
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

  function openSearchOverlay(query) {
    if (!_searchOverlayEl) _buildSearchOverlay();
    _currentQuery = query;

    // Pre-fill input — value property is safe (not innerHTML)
    const input = _searchOverlayEl.querySelector('#overlay-search-input');
    if (input) input.value = query;

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

    if (!query || query.length < 1) return;

    if (tab === 'internal') _showInternalResults(query);
    else if (tab === 'wikipedia') _showWikiResults(query);
    else if (tab === 'videos') _showVideoResults(query);
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
    input.placeholder = 'Search processes, tools, companies, or any semiconductor topic…';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Search query');

    let _overlayDebounce;
    input.addEventListener('input', () => {
      clearTimeout(_overlayDebounce);
      _overlayDebounce = setTimeout(() => {
        _currentQuery = input.value.trim();
        if (_currentQuery.length > 0) _switchTab(_activeTab, _currentQuery);
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

    ['internal', 'wikipedia', 'videos'].forEach(id => {
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

  /* ── Wikipedia search via REST API ────────────────────────────────── */
  async function _showWikiResults(query) {
    const panel = document.getElementById('panel-wikipedia');
    if (!panel) return;
    _setLoading(panel, 'Searching Wikipedia');

    try {
      // Security: encodeURIComponent sanitizes query for URL use
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
      // Wikipedia Summary REST API — CORS-enabled, no API key needed
      const res = await fetch(
        'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title)
      );
      if (!res.ok) return null;
      const d = await res.json();

      const card = document.createElement('div');
      card.className = 'wiki-result-card';

      // Thumbnail — grayscale via CSS
      if (d.thumbnail && d.thumbnail.source) {
        const img = document.createElement('img');
        img.className = 'wiki-result-thumb';
        img.src = d.thumbnail.source; // trusted Wikipedia API URL
        img.alt = title; // textContent equivalent for alt
        img.loading = 'lazy';
        img.width = 68;
        img.height = 68;
        card.appendChild(img);
      }

      const textEl = document.createElement('div');
      textEl.className = 'wiki-result-text';

      const titleEl = document.createElement('div');
      titleEl.className = 'wiki-result-title';
      titleEl.textContent = d.title || title; // textContent — XSS safe

      const extract = document.createElement('div');
      extract.className = 'wiki-result-extract';
      extract.textContent = d.extract || ''; // textContent — XSS safe

      const footer = document.createElement('div');
      footer.className = 'wiki-result-footer';

      const wikiLink = document.createElement('a');
      wikiLink.className = 'wiki-result-link';
      const pageUrl = (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || '#';
      wikiLink.href = pageUrl;
      wikiLink.target = '_blank';
      wikiLink.rel = 'noopener noreferrer';
      wikiLink.textContent = 'Read on Wikipedia →'; // textContent — safe

      footer.appendChild(wikiLink);
      textEl.append(titleEl, extract, footer);
      card.appendChild(textEl);
      return card;
    } catch (_e) {
      return null;
    }
  }

  /* ── YouTube embedded search ───────────────────────────────────────── */
  function _showVideoResults(query) {
    const panel = document.getElementById('panel-videos');
    if (!panel) return;
    panel.replaceChildren();

    const lbl = document.createElement('span');
    lbl.className = 'video-section-label';
    lbl.textContent = 'YouTube — ' + query; // textContent — safe

    const container = document.createElement('div');
    container.className = 'video-embed-container';

    const iframe = document.createElement('iframe');
    // Security: URL built with encodeURIComponent — no user HTML injected
    iframe.src = 'https://www.youtube.com/embed?listType=search&list=' +
      encodeURIComponent(query) + '&hl=en&rel=0';
    iframe.title = 'YouTube search: ' + query; // safe attribute assignment
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('loading', 'lazy');

    container.appendChild(iframe);

    // Fallback button in case YouTube blocks the embed
    const fallbackLink = document.createElement('a');
    fallbackLink.className = 'video-fallback-btn';
    fallbackLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    fallbackLink.textContent = '▶  Open YouTube Search in new tab';

    panel.append(lbl, container, fallbackLink);
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
