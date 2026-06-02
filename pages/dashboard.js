/* ─── pages/dashboard.js — User Profile Dashboard Page ────────────────────
   Security:
   - Validates session state on load
   - Escapes all rendering via textContent
   - Clear session state on logout
   ────────────────────────────────────────────────────────────────────────── */

window.renderDashboard = function(container) {
  const user = JSON.parse(localStorage.getItem('elchip_user') || 'null');

  // Route guard: if no user logged in, redirect to auth page
  if (!user) {
    setTimeout(() => {
      window.location.hash = '#/auth';
    }, 100);
    return;
  }

  const frag = document.createDocumentFragment();

  // Root wrapper
  const wrapper = document.createElement('main');
  wrapper.style.cssText = 'min-height:90vh; padding:6rem 0 4rem; display:flex; align-items:center; justify-content:center;';

  const innerContainer = document.createElement('div');
  innerContainer.className = 'container page-enter';
  innerContainer.style.cssText = 'width:100%; max-width:600px; display:flex; flex-direction:column; gap:2rem;';

  // Dashboard Card
  const card = document.createElement('div');
  card.className = 'glass-card';
  card.style.cssText = 'padding:3rem 2.5rem; border-radius:24px; display:flex; flex-direction:column; gap:2.5rem; position:relative; overflow:hidden;';

  // Profile Header
  const header = document.createElement('div');
  header.style.cssText = 'display:flex; align-items:center; gap:2rem; flex-wrap:wrap;';

  const avatar = document.createElement('div');
  avatar.style.cssText = 'font-size:3rem; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.18); border-radius:50%; width:96px; height:96px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 0 20px rgba(255,255,255,0.08);';
  avatar.textContent = '👨‍🔬';

  const headerInfo = document.createElement('div');
  headerInfo.style.cssText = 'display:flex; flex-direction:column; gap:0.4rem;';

  const nameEl = document.createElement('h1');
  nameEl.style.cssText = 'font-size:1.8rem; font-weight:800; color:#fff; margin:0; letter-spacing:-0.02em;';
  nameEl.textContent = user.firstName;

  const emailEl = document.createElement('div');
  emailEl.style.cssText = 'font-size:0.88rem; color:rgba(255,255,255,0.5); font-family:var(--mono);';
  emailEl.textContent = user.email;

  const badge = document.createElement('span');
  badge.className = 'badge badge-green';
  badge.style.cssText = 'margin-top:0.4rem; align-self:flex-start;';
  badge.textContent = 'Certified Cleanroom Engineer';

  headerInfo.append(nameEl, emailEl, badge);
  header.append(avatar, headerInfo);
  card.appendChild(header);

  // Stats Grid Section
  const statsSection = document.createElement('div');
  statsSection.style.cssText = 'display:flex; flex-direction:column; gap:1rem;';

  const statsTitle = document.createElement('h2');
  statsTitle.style.cssText = 'font-size:0.75rem; font-family:var(--mono); text-transform:uppercase; color:rgba(255,255,255,0.3); letter-spacing:0.1em; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.5rem; margin-bottom:0.5rem;';
  statsTitle.textContent = 'Cleanroom Credentials & Metrics';
  statsSection.appendChild(statsTitle);

  const statsGrid = document.createElement('div');
  statsGrid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.25rem;';

  const statsData = [
    { label: 'Security Clearance', val: 'Level 2' },
    { label: 'Data Access node', val: 'All Areas (Unlocked)' },
    { label: 'Ingot purity validation', val: '9N (99.9999999%)' },
    { label: 'Active sessions', val: '1 (Current)' }
  ];

  statsData.forEach(item => {
    const sBox = document.createElement('div');
    sBox.style.cssText = 'background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem;';

    const sLabel = document.createElement('div');
    sLabel.style.cssText = 'font-size:0.72rem; color:rgba(255,255,255,0.4); margin-bottom:0.4rem; text-transform:uppercase; font-family:var(--mono); letter-spacing:0.02em;';
    sLabel.textContent = item.label;

    const sVal = document.createElement('div');
    sVal.style.cssText = 'font-size:1.1rem; font-weight:700; color:#fff;';
    sVal.textContent = item.val;

    sBox.append(sLabel, sVal);
    statsGrid.appendChild(sBox);
  });

  statsSection.appendChild(statsGrid);
  card.appendChild(statsSection);

  // Logout & Action Buttons
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex; gap:1rem; align-items:center; flex-wrap:wrap;';

  const btnExplore = document.createElement('a');
  btnExplore.className = 'btn btn-primary';
  btnExplore.href = '#/companies';
  btnExplore.textContent = 'Explore Companies';

  const btnLogout = document.createElement('button');
  btnLogout.className = 'btn btn-ghost';
  btnLogout.style.cssText = 'color:#fca5a5; border-color:rgba(239,68,68,0.2);';
  btnLogout.textContent = 'Log Out Securely';
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('elchip_user');
    
    // Refresh navbar state
    if (typeof window.rebuildNavUI === 'function') {
      window.rebuildNavUI();
    }
    
    // Redirect
    window.location.hash = '#/';
    window.location.reload();
  });

  actions.append(btnExplore, btnLogout);
  card.appendChild(actions);

  innerContainer.appendChild(card);
  wrapper.appendChild(innerContainer);

  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};
