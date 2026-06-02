/* ─── pages/connect.js — Let's Connect Contact Page ──────────────────────────
   Security: 
   - No innerHTML for user data
   - Input validation before mock submit
   ────────────────────────────────────────────────────────────────────────── */

window.renderConnect = function(container) {
  const frag = document.createDocumentFragment();

  // Root wrapper
  const wrapper = document.createElement('main');
  wrapper.style.cssText = 'min-height:90vh; padding:6rem 0 4rem;';

  const innerContainer = document.createElement('div');
  innerContainer.className = 'container page-enter';

  // Section labels
  const label = document.createElement('span');
  label.className = 'section-label';
  label.textContent = 'Get in Touch';

  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:clamp(2rem,5vw,3.5rem); font-weight:900; letter-spacing:-0.03em; margin-bottom:1rem; line-height:1.1;';
  h1.textContent = "Let's Connect";

  const pSub = document.createElement('p');
  pSub.style.cssText = 'font-size:1.05rem; color:rgba(255,255,255,0.55); max-width:600px; line-height:1.75; margin-bottom:3.5rem;';
  pSub.textContent = "Whether you have questions about semiconductor metrology systems, want to collaborate on cleanroom technology research, or have employment opportunities — I'd love to hear from you. Open to global opportunities and relocation.";

  // Two column grid layout
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:3.5rem; align-items:start;';

  /* ─── COLUMN 1: CONTACT DETAILS ───────────────────────────────────── */
  const contactInfo = document.createElement('div');
  contactInfo.style.cssText = 'display:flex; flex-direction:column; gap:2rem;';

  const infoItems = [
    {
      icon: '✉️',
      title: 'Email Address',
      val: 'mandapallyakshith@gmail.com',
      sub: 'Direct response within 24 hours',
      link: 'mailto:mandapallyakshith@gmail.com'
    },
    {
      icon: '🌐',
      title: 'GitHub Developer Profile',
      val: 'github.com/akshithmandapally-cmyk',
      sub: 'Check out my open-source projects & codebases',
      link: 'https://github.com/akshithmandapally-cmyk'
    },
    {
      icon: '📍',
      title: 'Current Location',
      val: 'Hyderabad, India',
      sub: 'Open to relocation & remote work globally',
      link: null
    }
  ];

  infoItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'padding:1.5rem; display:flex; gap:1.25rem; align-items:flex-start; transition:all 0.3s ease;';

    const iconEl = document.createElement('div');
    iconEl.style.cssText = 'font-size:1.8rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; width:48px; height:48px; display:flex; align-items:center; justify-content:center; flex-shrink:0;';
    iconEl.textContent = item.icon;

    const details = document.createElement('div');
    details.style.flex = '1';

    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size:0.75rem; font-family:var(--mono); text-transform:uppercase; color:rgba(255,255,255,0.4); letter-spacing:0.05em; margin-bottom:0.25rem;';
    titleEl.textContent = item.title;

    const valEl = item.link ? document.createElement('a') : document.createElement('div');
    valEl.style.cssText = 'font-size:1.05rem; font-weight:700; color:#fff; text-decoration:none; margin-bottom:0.25rem; display:inline-block;';
    valEl.textContent = item.val;
    if (item.link) {
      valEl.href = item.link;
      valEl.target = '_blank';
      valEl.rel = 'noopener noreferrer';
      valEl.style.borderBottom = '1px dashed rgba(255,255,255,0.2)';
      valEl.addEventListener('mouseenter', () => valEl.style.borderColor = '#fff');
      valEl.addEventListener('mouseleave', () => valEl.style.borderColor = 'rgba(255,255,255,0.2)');
    }

    const subEl = document.createElement('div');
    subEl.style.cssText = 'font-size:0.8rem; color:rgba(255,255,255,0.5);';
    subEl.textContent = item.sub;

    details.append(titleEl, valEl, subEl);
    card.append(iconEl, details);
    contactInfo.appendChild(card);
  });

  /* ─── COLUMN 2: CONTACT FORM ───────────────────────────────────────── */
  const formCard = document.createElement('div');
  formCard.className = 'glass-card';
  formCard.style.cssText = 'padding:2.5rem 2rem; border-radius:20px; display:flex; flex-direction:column; gap:1.25rem;';

  const formTitle = document.createElement('h2');
  formTitle.style.cssText = 'font-size:1.25rem; font-weight:800; color:#fff; margin-bottom:0.5rem;';
  formTitle.textContent = 'Send a Message';

  // Banner status
  const banner = document.createElement('div');
  banner.style.cssText = 'padding:0.75rem 1rem; border-radius:8px; font-size:0.82rem; display:none; line-height:1.5;';

  // Name
  const nameGroup = document.createElement('div');
  nameGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const nameLabel = document.createElement('label');
  nameLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  nameLabel.textContent = 'Your Name';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'John Doe';
  nameInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  nameInput.addEventListener('focus', () => nameInput.style.borderColor = 'rgba(255,255,255,0.4)');
  nameInput.addEventListener('blur', () => nameInput.style.borderColor = 'rgba(255,255,255,0.12)');
  nameGroup.append(nameLabel, nameInput);

  // Email
  const emailGroup = document.createElement('div');
  emailGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const emailLabel = document.createElement('label');
  emailLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  emailLabel.textContent = 'Email Address';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'john@example.com';
  emailInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  emailInput.addEventListener('focus', () => emailInput.style.borderColor = 'rgba(255,255,255,0.4)');
  emailInput.addEventListener('blur', () => emailInput.style.borderColor = 'rgba(255,255,255,0.12)');
  emailGroup.append(emailLabel, emailInput);

  // Message
  const msgGroup = document.createElement('div');
  msgGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const msgLabel = document.createElement('label');
  msgLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  msgLabel.textContent = 'Message';
  const msgInput = document.createElement('textarea');
  msgInput.placeholder = 'Write your message here...';
  msgInput.rows = 4;
  msgInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s; resize:vertical; font-family:var(--font);';
  msgInput.addEventListener('focus', () => msgInput.style.borderColor = 'rgba(255,255,255,0.4)');
  msgInput.addEventListener('blur', () => msgInput.style.borderColor = 'rgba(255,255,255,0.12)');
  msgGroup.append(msgLabel, msgInput);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.style.cssText = 'justify-content:center; padding:0.85rem; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.05em; font-size:0.82rem;';
  submitBtn.textContent = 'Send Message';

  submitBtn.addEventListener('click', () => {
    banner.style.display = 'none';
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !email || !message) {
      banner.textContent = 'Please fill out all fields.';
      banner.style.background = 'rgba(239,68,68,0.1)';
      banner.style.border = '1px solid rgba(239,68,68,0.2)';
      banner.style.color = '#fca5a5';
      banner.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      banner.textContent = 'Please enter a valid email address.';
      banner.style.background = 'rgba(239,68,68,0.1)';
      banner.style.border = '1px solid rgba(239,68,68,0.2)';
      banner.style.color = '#fca5a5';
      banner.style.display = 'block';
      return;
    }

    // Success simulation
    banner.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
    banner.style.background = 'rgba(34,197,94,0.1)';
    banner.style.border = '1px solid rgba(34,197,94,0.2)';
    banner.style.color = '#86efac';
    banner.style.display = 'block';

    nameInput.value = '';
    emailInput.value = '';
    msgInput.value = '';
  });

  formCard.append(formTitle, banner, nameGroup, emailGroup, msgGroup, submitBtn);

  grid.append(contactInfo, formCard);
  innerContainer.append(label, h1, pSub, grid);
  wrapper.appendChild(innerContainer);

  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};
