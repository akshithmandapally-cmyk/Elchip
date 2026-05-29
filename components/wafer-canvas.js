/* ─── components/wafer-canvas.js — Animated wafer circuit visualization ──
   Uses Canvas 2D API — no external dependencies.
   Security: No user input processed. Pure generative animation.
   ────────────────────────────────────────────────────────────────────────── */

window.initWaferCanvas = function(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let t = 0;

  function resize() {
    const size = Math.min(window.innerWidth, window.innerHeight, 600);
    canvas.width = size;
    canvas.height = size;
  }

  resize();
  window.addEventListener('resize', resize);

  function drawWafer() {
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.44;

    ctx.clearRect(0, 0, W, H);

    // ── Outer wafer circle glow ────────────────────────────────────────
    const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.1);
    glowGrad.addColorStop(0, 'rgba(79,142,247,0.04)');
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // ── Wafer edge ─────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Wafer fill ─────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    const waferGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
    waferGrad.addColorStop(0, 'rgba(255,255,255,0.04)');
    waferGrad.addColorStop(0.7, 'rgba(79,142,247,0.03)');
    waferGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = waferGrad;
    ctx.fill();

    // ── Circuit rings ──────────────────────────────────────────────────
    const rings = [0.15, 0.28, 0.38, 0.50, 0.62, 0.72, 0.83, 0.93];
    rings.forEach((r, i) => {
      const radius = R * r;
      const speed = (i % 2 === 0 ? 1 : -1) * 0.008;
      const angle = t * speed;
      const alpha = 0.08 + (i % 3) * 0.04;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79,142,247,${alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = angle * 50;
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes on rings
      const nodeCount = 4 + i * 2;
      for (let n = 0; n < nodeCount; n++) {
        const a = (n / nodeCount) * Math.PI * 2 + angle;
        const nx = cx + Math.cos(a) * radius;
        const ny = cy + Math.sin(a) * radius;
        const pulse = Math.sin(t * 0.05 + n * 0.8 + i) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(nx, ny, 2 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103,232,249,${0.2 + pulse * 0.4})`;
        ctx.fill();

        // Glow on active nodes
        if (pulse > 0.8) {
          ctx.beginPath();
          ctx.arc(nx, ny, 5 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(103,232,249,${(pulse - 0.8) * 0.3})`;
          ctx.fill();
        }
      }
    });

    // ── Die grid ───────────────────────────────────────────────────────
    const dieSize = R * 0.13;
    const gridCount = 12;
    const gridStart = cx - (gridCount / 2) * dieSize;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2);
    ctx.clip();

    for (let row = 0; row < gridCount; row++) {
      for (let col = 0; col < gridCount; col++) {
        const x = gridStart + col * dieSize;
        const y = gridStart + row * dieSize;
        const dx = x + dieSize / 2 - cx;
        const dy = y + dieSize / 2 - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / R;

        if (dist > 0.90) continue;

        const phase = Math.sin(t * 0.03 + row * 0.5 + col * 0.7) * 0.5 + 0.5;
        const isActive = phase > 0.75 && dist < 0.7;

        ctx.strokeStyle = isActive
          ? `rgba(79,142,247,${0.25 + phase * 0.2})`
          : `rgba(255,255,255,0.04)`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, dieSize - 1, dieSize - 1);

        if (isActive) {
          ctx.fillStyle = `rgba(79,142,247,${(phase - 0.75) * 0.15})`;
          ctx.fillRect(x + 0.5, y + 0.5, dieSize - 1, dieSize - 1);
        }
      }
    }
    ctx.restore();

    // ── Radial scan line ───────────────────────────────────────────────
    const scanAngle = (t * 0.02) % (Math.PI * 2);
    const scanGrad = ctx.createLinearGradient(
      cx, cy,
      cx + Math.cos(scanAngle) * R,
      cy + Math.sin(scanAngle) * R
    );
    scanGrad.addColorStop(0, 'rgba(103,232,249,0)');
    scanGrad.addColorStop(0.6, 'rgba(103,232,249,0.15)');
    scanGrad.addColorStop(1, 'rgba(103,232,249,0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, scanAngle - 0.25, scanAngle + 0.01);
    ctx.closePath();
    ctx.fillStyle = scanGrad;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.restore();

    // ── Center crosshair ───────────────────────────────────────────────
    const crossSize = 12;
    ctx.strokeStyle = 'rgba(103,232,249,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - crossSize, cy);
    ctx.lineTo(cx + crossSize, cy);
    ctx.moveTo(cx, cy - crossSize);
    ctx.lineTo(cx, cy + crossSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(103,232,249,0.6)';
    ctx.fill();

    // ── Flat indicator (wafer orientation notch) ───────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy + R - 8, 10, 0, Math.PI, false);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + R - 8, 10, 0, Math.PI, false);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Pulsing outer ring ─────────────────────────────────────────────
    const pulse2 = Math.sin(t * 0.04) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 4 + pulse2 * 6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(79,142,247,${0.05 + pulse2 * 0.1})`;
    ctx.lineWidth = pulse2 * 3 + 1;
    ctx.stroke();

    t++;
    animId = requestAnimationFrame(drawWafer);
  }

  drawWafer();

  // Return cleanup function
  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
};

/* ─── Glossary Overlay ──────────────────────────────────────────────────── */
window.openGlossary = function(term, definition) {
  let overlay = document.getElementById('glossary-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'glossary-overlay';
    overlay.id = 'glossary-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'glossary-term');

    const panel = document.createElement('div');
    panel.className = 'glossary-panel';
    panel.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'glossary-close';
    closeBtn.setAttribute('aria-label', 'Close glossary');
    closeBtn.textContent = '×';
    // Security: Event listener instead of inline handler
    closeBtn.addEventListener('click', () => window.closeGlossary());

    const termEl = document.createElement('div');
    termEl.id = 'glossary-term';
    termEl.className = 'glossary-term';

    const defEl = document.createElement('p');
    defEl.className = 'glossary-definition';

    panel.append(closeBtn, termEl, defEl);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeGlossary();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeGlossary();
    });
  }

  // Security: textContent prevents XSS — no user input injected as HTML
  document.getElementById('glossary-term').textContent = term;
  overlay.querySelector('.glossary-definition').textContent = definition;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeGlossary = function() {
  const overlay = document.getElementById('glossary-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};
