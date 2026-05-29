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

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    setTimeout(hideLoadingScreen, 800);
  });

})();
