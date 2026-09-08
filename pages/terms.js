/* ─── pages/terms.js — Terms & Conditions Page ──────────────────────────
   Checklist Item 2: Terms & conditions page
   Security: Pure static semantic content, safe DOM creation.
   ────────────────────────────────────────────────────────────────────────── */

window.renderTerms = function(container) {
  const frag = document.createDocumentFragment();

  const wrapper = document.createElement('main');
  wrapper.className = 'legal-page page-enter';
  wrapper.style.cssText = 'min-height:90vh; padding:6rem 1.5rem 4rem; max-width:900px; margin:0 auto;';

  const header = document.createElement('header');
  header.style.cssText = 'margin-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:2rem;';

  const label = document.createElement('span');
  label.className = 'section-label';
  label.textContent = 'Platform Agreement & Guidelines';

  const h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:clamp(2rem,4vw,3rem); font-weight:800; color:#fff; margin-bottom:1rem; letter-spacing:-0.03em;';
  h1.textContent = 'Terms & Conditions';

  const updated = document.createElement('div');
  updated.style.cssText = 'font-family:var(--mono); font-size:0.8rem; color:rgba(255,255,255,0.5);';
  updated.textContent = 'Effective Date: September 8, 2026 • Platform Version 2.0';

  header.append(label, h1, updated);

  const content = document.createElement('div');
  content.className = 'legal-content';
  content.style.cssText = 'display:flex; flex-direction:column; gap:2.5rem; line-height:1.8; color:rgba(255,255,255,0.78); font-size:0.95rem;';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      text: 'By visiting ELCHIP, accessing the semiconductor manufacturing database, or enrolling as a member of Team ELCHIP, you agree to be bound by these Terms & Conditions. If you disagree with any portion of these terms, please discontinue use of the platform.'
    },
    {
      title: '2. Educational Purpose & Disclaimer',
      text: 'ELCHIP is engineered exclusively for educational, research, and collaborative hardware engineering purposes. While our specifications, process flows (wafer prep, photolithography, CMP, etching, ion implantation), and inspection equipment metrics are curated from verified industrial literature (ITRS, IEEE, SEMI, JEDEC), they are provided on an "as-is" basis. ELCHIP does not guarantee commercial fabrication yields based on educational simulations.'
    },
    {
      title: '3. Intellectual Property & Open Collaboration',
      text: 'The ELCHIP design system, code architecture, interactive wafer canvas algorithms, and technical compilation are the intellectual property of Akshith Mandapally and Team ELCHIP contributors. Third-party trade names, foundry trademarks (e.g., ASML, TSMC, Intel, Applied Materials, KLA), and technical patents referenced belong entirely to their respective corporate entities and are referenced under academic fair use.'
    },
    {
      title: '4. Team ELCHIP Code of Conduct & Recruitment',
      text: 'Members who join Team ELCHIP agree to foster an inclusive, merit-based, and forward-thinking collaborative atmosphere. Team members agree to uphold high engineering standards, contribute meaningfully to project sprints, avoid introducing malicious code or unauthorized secrets, and respect fellow builders.'
    },
    {
      title: '5. Prohibited Activities',
      text: 'Users and members agree not to: (a) Perform automated denial-of-service or scraping attacks against ELCHIP infrastructure; (b) Attempt to bypass security checks or reverse-engineer proxy keys; (c) Post abusive, fraudulent, or spam submissions through registration forms; (d) Misrepresent cleanroom credentials or team affiliations.'
    },
    {
      title: '6. Limitation of Liability',
      text: 'Under no circumstances shall ELCHIP or its creators be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the educational tools or code samples hosted on this site.'
    },
    {
      title: '7. Amendments & Updates',
      text: 'We reserve the right to revise these Terms & Conditions as the ELCHIP engineering roadmap expands. Continued utilization of the site following published modifications constitutes full acceptance of the updated terms.'
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
