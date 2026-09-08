/* ─── pages/privacy.js — Privacy Policy Page ────────────────────────────
   Checklist Item 1: Privacy policy page
   Security: Pure static semantic content, safe DOM creation.
   ────────────────────────────────────────────────────────────────────────── */

window.renderPrivacy = function(container) {
  const frag = document.createDocumentFragment();

  const wrapper = document.createElement('main');
  wrapper.className = 'legal-page page-enter';
  wrapper.style.cssText = 'min-height:90vh; padding:6rem 1.5rem 4rem; max-width:900px; margin:0 auto;';

  const header = document.createElement('header');
  header.style.cssText = 'margin-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:2rem;';

  const label = document.createElement('span');
  label.className = 'section-label';
  label.textContent = 'Transparency & Data Protection';

  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:clamp(2rem,4vw,3rem); font-weight:800; color:#fff; margin-bottom:1rem; letter-spacing:-0.03em;';
  h1.textContent = 'Privacy Policy';

  const updated = document.createElement('div');
  updated.style.cssText = 'font-family:var(--mono); font-size:0.8rem; color:rgba(255,255,255,0.5);';
  updated.textContent = 'Effective Date: September 8, 2026 • Platform Version 2.0';

  header.append(label, h1, updated);

  const content = document.createElement('div');
  content.className = 'legal-content';
  content.style.cssText = 'display:flex; flex-direction:column; gap:2.5rem; line-height:1.8; color:rgba(255,255,255,0.78); font-size:0.95rem;';

  const sections = [
    {
      title: '1. Executive Summary',
      text: 'ELCHIP ("we", "our", or "the platform") is an open educational and research initiative dedicated to semiconductor engineering and nanoscale fabrication. We strictly operate on a data-minimization philosophy: we do not sell your personal data, track you across third-party websites, or retain sensitive personal data beyond what is strictly necessary for team collaboration and platform performance.'
    },
    {
      title: '2. Information We Collect & How It Is Used',
      text: 'Depending on your interaction with ELCHIP, we collect: (a) Team Member & Recruitment Details: When friends and engineers join Team ELCHIP, we collect your name, email address, engineering focus (e.g., Lithography, VLSI, Full-Stack), and voluntary project statement to coordinate research sprints and assign project access. (b) Technical Logs & Session Metrics: Minimal anonymized metrics such as route navigation and tool lookup counts to optimize cleanroom interactive simulations.'
    },
    {
      title: '3. Local Storage & Client-Side Storage',
      text: 'ELCHIP utilizes browser LocalStorage to maintain your preferences locally on your own machine. This includes your cookie banner consent, theme settings, and authenticated team session token. No tracking cookies or advertising pixels are placed on your device.'
    },
    {
      title: '4. Third-Party Services & Educational APIs',
      text: 'To enrich educational semiconductor articles and tools, ELCHIP communicates with public knowledge APIs: (a) Wikipedia & ArXiv APIs: to fetch academic literature and abstracts. (b) YouTube No-Cookie Embeds: to display engineering cleanroom tool documentaries without tracking cookies. (c) AI Engineering Assistant: Queries made to the cleanroom AI are processed securely via backend proxies without exposing client secrets.'
    },
    {
      title: '5. Security Measures & Encryption',
      text: 'All communications across ELCHIP are strictly encrypted in transit via forced HTTPS (TLS 1.3). We employ strict Content Security Policies (CSP), frame-ancestor restrictions to prevent clickjacking, MIME-type sniffing protection, and XSS defensive coding practices.'
    },
    {
      title: '6. Your Rights & Data Deletion',
      text: 'You have the right at any time to inspect, modify, or permanently wipe your team registration data. Clearing your browser LocalStorage immediately terminates all local sessions. For project roster updates or team profile deletion, contact us directly.'
    },
    {
      title: '7. Contact & Governance',
      text: 'If you have questions regarding this Privacy Policy or wish to inquire about open semiconductor research data, reach out via email to akshith.mandapally@gmail.com or via GitHub at github.com/akshithmandapally-cmyk.'
    }
  ];

  sections.forEach(sec => {
    const secEl = document.createElement('section');
    secEl.style.cssText = 'background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:2rem;';
    
    const h2 = document.createElement('h2');
    h2.style.cssText = 'font-size:1.25rem; font-weight:700; color:#fff; margin-bottom:1rem; letter-spacing:-0.01em;';
    h2.textContent = sec.title;

    const p = document.createElement('p');
    p.style.margin = '0';
    p.textContent = sec.text;

    secEl.append(h2, p);
    content.appendChild(secEl);
  });

  wrapper.append(header, content);
  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};
