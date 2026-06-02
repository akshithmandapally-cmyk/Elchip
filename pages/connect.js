/* ─── pages/connect.js — Let's Connect Contact Page ──────────────────────────
   Security: 
   - No innerHTML for user data
   - Input validation before mock submit
   ────────────────────────────────────────────────────────────────────────── */

window.renderConnect = function(container) {
  const frag = document.createDocumentFragment();

  // Root wrapper
  const wrapper = document.createElement('main');
  wrapper.style.cssText = 'min-height:90vh; padding:6rem 0 4rem; display:flex; align-items:center; justify-content:center;';

  const innerContainer = document.createElement('div');
  innerContainer.className = 'container page-enter';
  innerContainer.style.maxWidth = '500px';
  innerContainer.style.textAlign = 'center';

  // Section label
  const label = document.createElement('span');
  label.className = 'section-label';
  label.textContent = 'Contact';

  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:2.5rem; font-weight:900; letter-spacing:-0.03em; margin-bottom:2rem; line-height:1.1; text-align:center;';
  h1.textContent = "Let's Connect";

  // Column: Contact details (no form)
  const contactInfo = document.createElement('div');
  contactInfo.style.cssText = 'display:flex; flex-direction:column; gap:1.25rem; text-align:left;';

  const infoItems = [
    {
      icon: '✉️',
      title: 'Email',
      val: 'akshith.mandapally@gmail.com',
      link: 'mailto:akshith.mandapally@gmail.com'
    },
    {
      icon: '🌐',
      title: 'GitHub',
      val: 'github.com/akshithmandapally-cmyk',
      link: 'https://github.com/akshithmandapally-cmyk'
    },
    {
      icon: '💼',
      title: 'LinkedIn',
      val: 'linkedin.com/in/akshith-mandapally',
      link: 'https://linkedin.com'
    }
  ];

  infoItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'padding:1.25rem; display:flex; gap:1rem; align-items:center; transition: all 0.3s ease;';
    
    card.addEventListener('mouseenter', () => {
      card.style.background = 'rgba(255,255,255,0.08)';
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = 'rgba(255,255,255,0.03)';
      card.style.transform = 'translateY(0)';
    });

    const iconEl = document.createElement('div');
    iconEl.style.cssText = 'font-size:1.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; flex-shrink:0;';
    iconEl.textContent = item.icon;

    const details = document.createElement('div');
    details.style.flex = '1';

    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size:0.65rem; font-family:var(--mono); text-transform:uppercase; color:rgba(255,255,255,0.4); letter-spacing:0.05em; margin-bottom:0.15rem;';
    titleEl.textContent = item.title;

    const valEl = document.createElement('a');
    valEl.style.cssText = 'font-size:0.9rem; font-weight:700; color:#fff; text-decoration:none; display:inline-block; border-bottom:1px dashed rgba(255,255,255,0.2);';
    valEl.textContent = item.val;
    valEl.href = item.link;
    valEl.target = '_blank';
    valEl.rel = 'noopener noreferrer';
    valEl.addEventListener('mouseenter', () => valEl.style.borderColor = '#fff');
    valEl.addEventListener('mouseleave', () => valEl.style.borderColor = 'rgba(255,255,255,0.2)');

    details.append(titleEl, valEl);
    card.append(iconEl, details);
    contactInfo.appendChild(card);
  });

  innerContainer.append(label, h1, contactInfo);
  wrapper.appendChild(innerContainer);

  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};
