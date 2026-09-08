/* ─── pages/team.js — Team ELCHIP Research Registration Hub ──────────────
   Design: Apple-inspired pure black, premium dark UI
   Architecture:
   1. Research Student Sign Up / Sign In (single role)
   2. Word-based Security Verification (no math captcha)
   3. Digital Research Badge after registration
   4. Exclusive Project Registration Link unlock
   5. Privacy-first team roster (no emails shown publicly)
   Data Access: All data stored in localStorage key 'elchip_team_members'
   Owner Access: Open browser DevTools > Application > Local Storage > key above
   ────────────────────────────────────────────────────────────────────────── */

window.renderTeam = function(container) {
  const frag = document.createDocumentFragment();

  // ── Storage helpers ──────────────────────────────────────────────────────
  function getRegisteredMembers() {
    try {
      const stored = JSON.parse(localStorage.getItem('elchip_team_members') || '[]');
      if (!Array.isArray(stored)) return [];
      return stored;
    } catch (_) { return []; }
  }

  function saveRegisteredMembers(list) {
    localStorage.setItem('elchip_team_members', JSON.stringify(list));
  }

  function getCurrentMember() {
    try {
      return JSON.parse(localStorage.getItem('elchip_current_member') || 'null');
    } catch (_) { return null; }
  }

  function setCurrentMember(mem) {
    if (mem) {
      localStorage.setItem('elchip_current_member', JSON.stringify(mem));
      localStorage.setItem('elchip_user', JSON.stringify({
        email: mem.email,
        firstName: mem.name.split(' ')[0],
        role: mem.role,
        memberId: mem.id
      }));
    } else {
      localStorage.removeItem('elchip_current_member');
      localStorage.removeItem('elchip_user');
    }
  }

  const currentMember = getCurrentMember();

  // ── Root wrapper ─────────────────────────────────────────────────────────
  const wrapper = document.createElement('main');
  wrapper.className = 'team-hub page-enter';
  wrapper.style.cssText = 'min-height:100vh; padding:5rem 1.5rem 5rem; max-width:1080px; margin:0 auto;';

  // ── Hero ─────────────────────────────────────────────────────────────────
  const hero = document.createElement('header');
  hero.style.cssText = 'text-align:center; margin-bottom:3.5rem;';

  const badge = document.createElement('span');
  badge.style.cssText = 'display:inline-flex; align-items:center; gap:0.5rem; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.5); font-family:monospace; margin-bottom:1.2rem;';
  badge.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 8px rgba(255,255,255,0.6);display:inline-block;"></span> Research Division — ELCHIP';

  const title = document.createElement('h1');
  title.style.cssText = 'font-size:clamp(2rem,5vw,3.2rem); font-weight:800; letter-spacing:-0.04em; color:#fff; margin:0 0 1rem; line-height:1.12;';
  title.textContent = 'Join the Research';

  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:1rem; color:rgba(255,255,255,0.5); max-width:580px; margin:0 auto; line-height:1.8;';
  sub.textContent = 'ELCHIP is a semiconductor research initiative. We are selectively bringing on research students to explore, document, and advance fabrication knowledge together.';

  hero.append(badge, title, sub);
  wrapper.appendChild(hero);

  // ── Main content ─────────────────────────────────────────────────────────
  if (currentMember) {
    wrapper.appendChild(renderAuthenticatedPortal(currentMember));
  } else {
    wrapper.appendChild(renderAuthInterface());
  }

  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATED MEMBER PORTAL
  // ═══════════════════════════════════════════════════════════════════════════
  function renderAuthenticatedPortal(member) {
    const box = document.createElement('div');
    box.style.cssText = 'display:flex; flex-direction:column; gap:2rem; margin-bottom:4rem;';

    // ─ Badge card ────────────────────────────────────────────────────────────
    const badgeCard = document.createElement('div');
    badgeCard.style.cssText = `
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 2.25rem;
      position: relative;
      overflow: hidden;
    `;

    // Subtle corner watermark
    const wm = document.createElement('div');
    wm.setAttribute('aria-hidden', 'true');
    wm.style.cssText = 'position:absolute;right:-12px;bottom:-20px;font-size:7rem;font-weight:900;color:rgba(255,255,255,0.02);pointer-events:none;font-family:monospace;user-select:none;';
    wm.textContent = 'ELC';
    badgeCard.appendChild(wm);

    // Status row
    const statusRow = document.createElement('div');
    statusRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.75rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(255,255,255,0.07);';

    const verifiedTag = document.createElement('div');
    verifiedTag.style.cssText = 'display:inline-flex;align-items:center;gap:0.45rem;font-size:0.7rem;color:#86efac;font-family:monospace;letter-spacing:0.08em;text-transform:uppercase;';
    verifiedTag.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;flex-shrink:0;"></span> Verified Research Member';

    const idBadge = document.createElement('span');
    idBadge.style.cssText = 'font-family:monospace;font-size:0.75rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:0.25rem 0.75rem;border-radius:6px;color:rgba(255,255,255,0.7);';
    idBadge.textContent = `${member.id}`;

    statusRow.append(verifiedTag, idBadge);
    badgeCard.appendChild(statusRow);

    // Member info
    const info = document.createElement('div');
    info.style.cssText = 'display:flex;align-items:center;gap:1.75rem;flex-wrap:wrap;margin-bottom:1.75rem;';

    const avatar = document.createElement('div');
    avatar.style.cssText = 'width:72px;height:72px;border-radius:16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;';
    avatar.textContent = '🧪';

    const nameBlock = document.createElement('div');
    const nameEl = document.createElement('h2');
    nameEl.style.cssText = 'font-size:1.5rem;font-weight:800;color:#fff;margin:0 0 0.25rem;';
    nameEl.textContent = member.name;
    const roleEl = document.createElement('div');
    roleEl.style.cssText = 'font-size:0.82rem;color:rgba(255,255,255,0.6);';
    roleEl.textContent = 'Research Student — ELCHIP';
    const joinedEl = document.createElement('div');
    joinedEl.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.3);font-family:monospace;margin-top:0.25rem;';
    joinedEl.textContent = `Joined: ${member.joinedDate || new Date().toISOString().split('T')[0]}`;
    nameBlock.append(nameEl, roleEl, joinedEl);
    info.append(avatar, nameBlock);
    badgeCard.appendChild(info);

    // Action bar
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:0.75rem;flex-wrap:wrap;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.07);';

    const signOutBtn = document.createElement('button');
    signOutBtn.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);padding:0.5rem 1.1rem;border-radius:8px;font-size:0.78rem;cursor:pointer;transition:all 0.2s;font-family:monospace;letter-spacing:0.06em;';
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.addEventListener('mouseenter', () => {
      signOutBtn.style.borderColor = 'rgba(239,68,68,0.3)';
      signOutBtn.style.color = '#fca5a5';
    });
    signOutBtn.addEventListener('mouseleave', () => {
      signOutBtn.style.borderColor = 'rgba(255,255,255,0.12)';
      signOutBtn.style.color = 'rgba(255,255,255,0.5)';
    });
    signOutBtn.addEventListener('click', () => {
      setCurrentMember(null);
      window.location.reload();
    });

    actions.append(signOutBtn);
    badgeCard.appendChild(actions);
    box.appendChild(badgeCard);

    // ─ Registration link card ─────────────────────────────────────────────
    const regCard = document.createElement('div');
    regCard.style.cssText = `
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 2.25rem;
    `;

    const regPill = document.createElement('span');
    regPill.style.cssText = 'display:inline-block;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.12);padding:0.22rem 0.75rem;border-radius:999px;font-size:0.68rem;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.85rem;';
    regPill.textContent = 'Access Granted';

    const regTitle = document.createElement('h2');
    regTitle.style.cssText = 'font-size:1.4rem;font-weight:800;color:#fff;margin:0 0 0.6rem;';
    regTitle.textContent = 'Project Registration Link';

    const regDesc = document.createElement('p');
    regDesc.style.cssText = 'font-size:0.875rem;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 1.5rem;';
    regDesc.textContent = 'Share this link only with people Akshith has personally approved. This link is uniquely tied to your membership and logs your onboarding to the ELCHIP research team.';

    const registrationUrl = `${window.location.origin}/#/team?ref=${encodeURIComponent(member.id)}`;

    const linkBox = document.createElement('div');
    linkBox.style.cssText = 'background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;justify-content:space-between;flex-wrap:wrap;margin-bottom:1rem;';

    const urlText = document.createElement('div');
    urlText.style.cssText = 'font-family:monospace;font-size:0.8rem;color:rgba(255,255,255,0.6);word-break:break-all;flex:1;min-width:200px;';
    urlText.textContent = registrationUrl;

    const copyBtn = document.createElement('button');
    copyBtn.style.cssText = 'background:#fff;color:#000;border:none;padding:0.55rem 1.1rem;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.2s;flex-shrink:0;letter-spacing:0.04em;font-family:monospace;';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('mouseenter', () => copyBtn.style.background = 'rgba(255,255,255,0.85)');
    copyBtn.addEventListener('mouseleave', () => copyBtn.style.background = '#fff');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(registrationUrl).then(() => {
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => copyBtn.textContent = 'Copy', 2500);
      });
    });

    linkBox.append(urlText, copyBtn);
    regCard.append(regPill, regTitle, regDesc, linkBox);
    box.appendChild(regCard);

    return box;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGN IN / SIGN UP INTERFACE — Apple-style black premium UI
  // ═══════════════════════════════════════════════════════════════════════════
  function renderAuthInterface() {
    const outer = document.createElement('div');
    outer.style.cssText = 'display:flex;justify-content:center;align-items:flex-start;margin-bottom:5rem;';

    const card = document.createElement('div');
    card.style.cssText = `
      width: 100%;
      max-width: 460px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 22px;
      padding: 2.5rem 2.25rem 2.25rem;
      backdrop-filter: blur(24px);
      box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04);
      position: relative;
    `;

    // Top rabbit mascot — small subtle detail
    const rabbitDecor = document.createElement('div');
    rabbitDecor.setAttribute('aria-hidden', 'true');
    rabbitDecor.style.cssText = 'position:absolute;top:-18px;left:50%;transform:translateX(-50%);';
    rabbitDecor.innerHTML = `
      <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 8px rgba(255,255,255,0.2));animation:rabbitFloat 2.5s ease-in-out infinite;">
        <ellipse cx="22" cy="14" rx="5" ry="12" fill="white" opacity="0.8"/>
        <ellipse cx="42" cy="14" rx="5" ry="12" fill="white" opacity="0.8"/>
        <ellipse cx="22" cy="14" rx="2.5" ry="8" fill="rgba(255,200,200,0.3)"/>
        <ellipse cx="42" cy="14" rx="2.5" ry="8" fill="rgba(255,200,200,0.3)"/>
        <ellipse cx="32" cy="30" rx="14" ry="13" fill="white" opacity="0.9"/>
        <circle cx="26" cy="27" r="2.2" fill="#111"/>
        <circle cx="38" cy="27" r="2.2" fill="#111"/>
        <ellipse cx="32" cy="32" rx="1.8" ry="1.1" fill="rgba(255,150,150,0.6)"/>
        <ellipse cx="32" cy="48" rx="10" ry="8" fill="white" opacity="0.85"/>
        <circle cx="42" cy="50" r="3.5" fill="white" opacity="0.8"/>
      </svg>
    `;
    card.appendChild(rabbitDecor);

    // Tab selector ─────────────────────────────────────────────────────────
    const tabWrap = document.createElement('div');
    tabWrap.style.cssText = 'display:flex;gap:0;border-radius:10px;background:rgba(255,255,255,0.05);padding:3px;margin-bottom:2rem;';

    const makeTab = (label, isActive) => {
      const t = document.createElement('button');
      t.style.cssText = `flex:1;padding:0.55rem;border:none;border-radius:8px;font-size:0.8rem;font-family:monospace;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;font-weight:700;`;
      if (isActive) {
        t.style.background = '#fff';
        t.style.color = '#000';
      } else {
        t.style.background = 'transparent';
        t.style.color = 'rgba(255,255,255,0.4)';
      }
      t.textContent = label;
      return t;
    };

    const tabJoin = makeTab('Apply to Join', true);
    const tabSignIn = makeTab('Member Sign In', false);
    tabWrap.append(tabJoin, tabSignIn);
    card.appendChild(tabWrap);

    // Alert box ─────────────────────────────────────────────────────────────
    const alertBox = document.createElement('div');
    alertBox.style.cssText = 'display:none;margin-bottom:1.25rem;padding:0.8rem 1rem;border-radius:10px;font-size:0.8rem;line-height:1.55;';
    card.appendChild(alertBox);

    function showAlert(msg, ok = false) {
      alertBox.style.display = 'block';
      alertBox.textContent = msg;
      if (ok) {
        alertBox.style.background = 'rgba(34,197,94,0.1)';
        alertBox.style.border = '1px solid rgba(34,197,94,0.25)';
        alertBox.style.color = '#86efac';
      } else {
        alertBox.style.background = 'rgba(239,68,68,0.1)';
        alertBox.style.border = '1px solid rgba(239,68,68,0.25)';
        alertBox.style.color = '#fca5a5';
      }
    }
    function hideAlert() { alertBox.style.display = 'none'; }

    // ─ Word security challenge ──────────────────────────────────────────────
    // Instead of math, use a silicon-themed word to type
    const VERIFY_WORDS = [
      { q: 'What material are microchips made from? (6 letters)', a: 'silicon' },
      { q: 'What process uses light to print circuits? Type: litho', a: 'litho' },
      { q: 'What element (symbol Si) is used in chips?', a: 'si' },
      { q: 'Type the word "research" to confirm', a: 'research' },
      { q: 'What gas is used in plasma etching? Type: argon', a: 'argon' },
      { q: 'Type "elchip" to verify you read this', a: 'elchip' },
    ];
    let wordChallenge = VERIFY_WORDS[Math.floor(Math.random() * VERIFY_WORDS.length)];
    function refreshChallenge(labelEl) {
      wordChallenge = VERIFY_WORDS[Math.floor(Math.random() * VERIFY_WORDS.length)];
      labelEl.textContent = wordChallenge.q;
    }
    function checkChallenge(val) {
      return val.trim().toLowerCase() === wordChallenge.a.toLowerCase();
    }

    // ─ Field builder ───────────────────────────────────────────────────────
    function mkField(type, placeholder, labelText, hint) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;';

      const lbl = document.createElement('label');
      lbl.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.45);text-transform:uppercase;font-family:monospace;letter-spacing:0.06em;';
      lbl.textContent = labelText;

      const input = document.createElement('input');
      input.type = type;
      input.placeholder = placeholder;
      input.autocomplete = type === 'password' ? 'current-password' : (type === 'email' ? 'email' : 'off');
      input.style.cssText = `
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        color: #fff;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
        width: 100%;
      `;
      input.addEventListener('focus', () => {
        input.style.borderColor = 'rgba(255,255,255,0.35)';
        input.style.background = 'rgba(255,255,255,0.07)';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(255,255,255,0.1)';
        input.style.background = 'rgba(255,255,255,0.05)';
      });

      wrap.append(lbl, input);
      if (hint) {
        const h = document.createElement('span');
        h.style.cssText = 'font-size:0.68rem;color:rgba(255,255,255,0.3);';
        h.textContent = hint;
        wrap.appendChild(h);
      }
      return { wrap, input, label: lbl };
    }

    function mkPasswordField(labelText, hint) {
      const { wrap, input, label } = mkField('password', '••••••••', labelText, hint);
      input.autocomplete = 'new-password';
      const rel = document.createElement('div');
      rel.style.cssText = 'position:relative;';
      input.style.paddingRight = '2.8rem';
      rel.appendChild(input);
      const eye = document.createElement('button');
      eye.type = 'button';
      eye.style.cssText = 'position:absolute;right:0.85rem;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;font-size:0.85rem;outline:none;';
      eye.textContent = '●';
      eye.title = 'Show/hide password';
      eye.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        eye.textContent = input.type === 'password' ? '●' : '○';
      });
      rel.appendChild(eye);
      const outer = document.createElement('div');
      outer.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;';
      outer.append(label, rel);
      if (hint) {
        const h = document.createElement('span');
        h.style.cssText = 'font-size:0.68rem;color:rgba(255,255,255,0.3);';
        h.textContent = hint;
        outer.appendChild(h);
      }
      return { wrap: outer, input };
    }

    function mkSubmitBtn(label) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = `
        background: #fff;
        color: #000;
        border: none;
        border-radius: 12px;
        padding: 0.9rem;
        font-size: 0.88rem;
        font-weight: 800;
        cursor: pointer;
        width: 100%;
        letter-spacing: 0.03em;
        transition: all 0.25s;
        margin-top: 0.25rem;
        font-family: monospace;
      `;
      btn.textContent = label;
      btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.88)');
      btn.addEventListener('mouseleave', () => btn.style.background = '#fff');
      return btn;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SIGN UP FORM
    // ═══════════════════════════════════════════════════════════════════════
    const signUpForm = document.createElement('div');
    signUpForm.style.cssText = 'display:flex;flex-direction:column;gap:1rem;';

    const { wrap: nameWrap, input: nameInput } = mkField('text', 'Your full name', 'Full Name', '');
    const { wrap: emailWrap, input: emailInput } = mkField('email', 'you@university.edu', 'Email Address', 'Use your academic or personal email');
    const { wrap: passWrap, input: passInput } = mkPasswordField('Password', 'Min 8 chars, include a number and symbol');
    const { wrap: instWrap, input: instInput } = mkField('text', 'e.g. IIT Hyderabad, MIT, VIT...', 'Institution / University', '');
    const { wrap: whyWrap, input: _ } = mkField('text', '', '', ''); // placeholder — we'll use textarea below

    // Textarea for research interest
    const whyGroup = document.createElement('div');
    whyGroup.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;';
    const whyLabel = document.createElement('label');
    whyLabel.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.45);text-transform:uppercase;font-family:monospace;letter-spacing:0.06em;';
    whyLabel.textContent = 'Research Interest';
    const whyTextarea = document.createElement('textarea');
    whyTextarea.rows = 2;
    whyTextarea.placeholder = 'e.g. Photolithography simulation, EUV optics, wafer inspection...';
    whyTextarea.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.8rem 1rem;color:#fff;font-size:0.88rem;outline:none;resize:none;transition:border-color 0.2s;';
    whyTextarea.addEventListener('focus', () => whyTextarea.style.borderColor = 'rgba(255,255,255,0.35)');
    whyTextarea.addEventListener('blur', () => whyTextarea.style.borderColor = 'rgba(255,255,255,0.1)');
    whyGroup.append(whyLabel, whyTextarea);

    // Honeypot
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'hp_field';
    honeypot.tabIndex = -1;
    honeypot.style.cssText = 'position:absolute;opacity:0;pointer-events:none;left:-9999px;';

    // Word challenge
    const verifyGroup = document.createElement('div');
    verifyGroup.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;';
    const verifyLabel = document.createElement('label');
    verifyLabel.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.45);text-transform:uppercase;font-family:monospace;letter-spacing:0.06em;';
    verifyLabel.textContent = wordChallenge.q;
    const verifyRow = document.createElement('div');
    verifyRow.style.cssText = 'display:flex;gap:0.6rem;align-items:center;';
    const verifyInput = document.createElement('input');
    verifyInput.type = 'text';
    verifyInput.placeholder = 'Type your answer';
    verifyInput.autocomplete = 'off';
    verifyInput.style.cssText = 'flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.8rem 1rem;color:#fff;font-size:0.88rem;outline:none;transition:border-color 0.2s;';
    verifyInput.addEventListener('focus', () => verifyInput.style.borderColor = 'rgba(255,255,255,0.35)');
    verifyInput.addEventListener('blur', () => verifyInput.style.borderColor = 'rgba(255,255,255,0.1)');
    const verifyRefresh = document.createElement('button');
    verifyRefresh.type = 'button';
    verifyRefresh.style.cssText = 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:0.7rem 0.9rem;border-radius:8px;cursor:pointer;font-size:0.8rem;transition:all 0.2s;';
    verifyRefresh.title = 'New question';
    verifyRefresh.textContent = '↺';
    verifyRefresh.addEventListener('click', () => {
      refreshChallenge(verifyLabel);
      verifyInput.value = '';
      verifyInput.focus();
    });
    verifyRow.append(verifyInput, verifyRefresh);
    verifyGroup.append(verifyLabel, verifyRow);

    // Terms row
    const termsRow = document.createElement('label');
    termsRow.style.cssText = 'display:flex;align-items:flex-start;gap:0.6rem;font-size:0.76rem;color:rgba(255,255,255,0.45);cursor:pointer;line-height:1.55;';
    const termsCheck = document.createElement('input');
    termsCheck.type = 'checkbox';
    termsCheck.style.cssText = 'margin-top:2px;flex-shrink:0;accent-color:#fff;';
    const termsText = document.createElement('span');
    termsText.innerHTML = 'I agree to the <a href="#/terms" style="color:rgba(255,255,255,0.7);text-underline-offset:3px;">Terms</a> and <a href="#/privacy" style="color:rgba(255,255,255,0.7);text-underline-offset:3px;">Privacy Policy</a>. I understand this is a research platform.';
    termsRow.append(termsCheck, termsText);

    const joinBtn = mkSubmitBtn('Request Research Access →');

    joinBtn.addEventListener('click', () => {
      hideAlert();

      // Honeypot check
      if (honeypot.value) { showAlert('Submission blocked.'); return; }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const pass = passInput.value;
      const inst = instInput.value.trim();
      const interest = whyTextarea.value.trim();
      const verifyAns = verifyInput.value.trim();

      if (!name || name.length < 2) { showAlert('Please enter your full name.'); nameInput.focus(); return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAlert('Please enter a valid email address.'); emailInput.focus(); return; }
      if (pass.length < 8 || !/\d/.test(pass) || !/[^A-Za-z0-9]/.test(pass)) {
        showAlert('Password must be at least 8 characters and include a number and a special character.');
        passInput.focus();
        return;
      }
      if (!inst) { showAlert('Please enter your institution or university.'); instInput.focus(); return; }
      if (!checkChallenge(verifyAns)) {
        showAlert('Verification answer is incorrect. Please try again.');
        refreshChallenge(verifyLabel);
        verifyInput.value = '';
        verifyInput.focus();
        return;
      }
      if (!termsCheck.checked) { showAlert('Please accept the Terms & Privacy Policy to continue.'); return; }

      const members = getRegisteredMembers();
      if (members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
        showAlert('An account with this email already exists. Please use "Member Sign In".');
        return;
      }

      // Generate ID
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.floor(Math.random() * 9999).toString(16).toUpperCase().padStart(4, '0');
      const newMember = {
        id: `ELC-${ts}-${rand}`,
        name,
        email,
        password: pass,
        institution: inst,
        interest: interest || 'General semiconductor research.',
        role: 'Research Student',
        joinedDate: new Date().toISOString().split('T')[0],
        joinedAt: new Date().toISOString()
      };

      members.push(newMember);
      saveRegisteredMembers(members);
      setCurrentMember(newMember);

      joinBtn.style.background = '#22c55e';
      joinBtn.style.color = '#fff';
      joinBtn.textContent = 'Access Granted ✓';
      showAlert(`Welcome to the ELCHIP research team, ${name}! Loading your portal...`, true);
      setTimeout(() => window.location.reload(), 1000);
    });

    signUpForm.append(nameWrap, emailWrap, passWrap, instWrap, whyGroup, honeypot, verifyGroup, termsRow, joinBtn);

    // ═══════════════════════════════════════════════════════════════════════
    // SIGN IN FORM
    // ═══════════════════════════════════════════════════════════════════════
    const signInForm = document.createElement('div');
    signInForm.style.cssText = 'display:none;flex-direction:column;gap:1rem;';

    let siChallenge = VERIFY_WORDS[Math.floor(Math.random() * VERIFY_WORDS.length)];

    const { wrap: siEmailWrap, input: siEmailInput } = mkField('email', 'you@university.edu', 'Email Address', '');
    const { wrap: siPassWrap, input: siPassInput } = mkPasswordField('Password', '');

    // Sign-in word challenge
    const siVerifyGroup = document.createElement('div');
    siVerifyGroup.style.cssText = 'display:flex;flex-direction:column;gap:0.4rem;';
    const siVerifyLabel = document.createElement('label');
    siVerifyLabel.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.45);text-transform:uppercase;font-family:monospace;letter-spacing:0.06em;';
    siVerifyLabel.textContent = siChallenge.q;
    const siVerifyRow = document.createElement('div');
    siVerifyRow.style.cssText = 'display:flex;gap:0.6rem;align-items:center;';
    const siVerifyInput = document.createElement('input');
    siVerifyInput.type = 'text';
    siVerifyInput.placeholder = 'Type your answer';
    siVerifyInput.autocomplete = 'off';
    siVerifyInput.style.cssText = 'flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.8rem 1rem;color:#fff;font-size:0.88rem;outline:none;transition:border-color 0.2s;';
    siVerifyInput.addEventListener('focus', () => siVerifyInput.style.borderColor = 'rgba(255,255,255,0.35)');
    siVerifyInput.addEventListener('blur', () => siVerifyInput.style.borderColor = 'rgba(255,255,255,0.1)');
    const siVerifyRefresh = document.createElement('button');
    siVerifyRefresh.type = 'button';
    siVerifyRefresh.style.cssText = 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:0.7rem 0.9rem;border-radius:8px;cursor:pointer;font-size:0.8rem;transition:all 0.2s;';
    siVerifyRefresh.title = 'New question';
    siVerifyRefresh.textContent = '↺';
    siVerifyRefresh.addEventListener('click', () => {
      siChallenge = VERIFY_WORDS[Math.floor(Math.random() * VERIFY_WORDS.length)];
      siVerifyLabel.textContent = siChallenge.q;
      siVerifyInput.value = '';
    });
    siVerifyRow.append(siVerifyInput, siVerifyRefresh);
    siVerifyGroup.append(siVerifyLabel, siVerifyRow);

    const siBtn = mkSubmitBtn('Sign In to Research Portal');

    siBtn.addEventListener('click', () => {
      hideAlert();
      const email = siEmailInput.value.trim();
      const pass = siPassInput.value;
      const ans = siVerifyInput.value.trim();

      if (!email) { showAlert('Please enter your email.'); siEmailInput.focus(); return; }
      if (!pass) { showAlert('Please enter your password.'); siPassInput.focus(); return; }
      if (ans.trim().toLowerCase() !== siChallenge.a.toLowerCase()) {
        showAlert('Verification answer incorrect. Please try again.');
        siChallenge = VERIFY_WORDS[Math.floor(Math.random() * VERIFY_WORDS.length)];
        siVerifyLabel.textContent = siChallenge.q;
        siVerifyInput.value = '';
        return;
      }

      const members = getRegisteredMembers();
      const found = members.find(m => m.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        showAlert('No account found with this email. Please apply to join first.');
        return;
      }
      if (found.password !== pass) {
        showAlert('Incorrect password. Please try again.');
        return;
      }

      setCurrentMember(found);
      siBtn.style.background = '#22c55e';
      siBtn.style.color = '#fff';
      siBtn.textContent = 'Signed In ✓';
      showAlert(`Welcome back, ${found.name}! Loading your portal...`, true);
      setTimeout(() => window.location.reload(), 800);
    });

    signInForm.append(siEmailWrap, siPassWrap, siVerifyGroup, siBtn);

    card.append(signUpForm, signInForm);

    // Tab switching logic
    function activateTab(tab) {
      hideAlert();
      if (tab === 'join') {
        tabJoin.style.background = '#fff';
        tabJoin.style.color = '#000';
        tabSignIn.style.background = 'transparent';
        tabSignIn.style.color = 'rgba(255,255,255,0.4)';
        signUpForm.style.display = 'flex';
        signInForm.style.display = 'none';
      } else {
        tabSignIn.style.background = '#fff';
        tabSignIn.style.color = '#000';
        tabJoin.style.background = 'transparent';
        tabJoin.style.color = 'rgba(255,255,255,0.4)';
        signInForm.style.display = 'flex';
        signUpForm.style.display = 'none';
      }
    }

    tabJoin.addEventListener('click', () => activateTab('join'));
    tabSignIn.addEventListener('click', () => activateTab('signin'));

    outer.appendChild(card);
    return outer;
  }
};
