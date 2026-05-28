# ELCHIP — Semiconductor Engineering Portfolio

> A dark-themed, animated portfolio website showcasing semiconductor chip fabrication processes, technical projects, and professional experience.

**Live site:** [View Portfolio](https://akshithmandapally-cmyk.github.io/elechip) &nbsp;|&nbsp; **Author:** [Akshith Mandapally](https://linkedin.com/in/akshith-mandapally-078691280)

---

## 📸 Preview

A single-page portfolio built with pure HTML & CSS, featuring:

- Animated scroll-reveal sections
- Black-to-gray gradient background with glassmorphism card components
- Full mobile responsiveness with a hamburger navigation menu

---

## 🗂️ Project Structure

```
elechip/
├── index.html                          # Main (and only) HTML page — all CSS & JS inline
├── background.png                      # Hero background texture overlay
├── real_wafer_1779418564747.png        # Step 01 — Realistic silicon wafer image
├── real_photolitho_1779418591399.png   # Step 02 — Photolithography machine
├── real_deposition_1779418616958.png   # Step 03 — Deposition process image
├── real_etching_1779418641999.png      # Step 03 — Etching process image (crossfade animation)
├── real_ion_implant_1779418669250.png  # Step 04 — Ion implantation machine
├── real_metrology_1779418693534.png    # Step 05 — SEM metrology scan
└── real_chip_pkg_1779418720672.png     # Step 06 — Packaged microchip image
```

---

## ✨ Features

### 🏭 Chip Fabrication Process (6 Steps)
An interactive, scroll-animated walkthrough of the full semiconductor manufacturing flow:

| Step | Process |
|------|---------|
| 01 | **Wafer Preparation** — Silicon ingot growth & slicing |
| 02 | **Photolithography** — DUV light circuit patterning |
| 03 | **Etching & Deposition** — Plasma etch + copper deposition (crossfade animation) |
| 04 | **Ion Implantation** — Doping for P/N junction creation |
| 05 | **Metrology & QC** — SEM inspection & Raman spectroscopy |
| 06 | **Assembly & Packaging** — Die slicing, bonding & final functional test |

### 💼 Technical Case Studies
- **EnergyFlex Hub** — Python/Streamlit demand response simulation
- **Smart Home Automation** — Embedded C microcontroller project
- **IoT ECG & SpO2 Monitor** — Real-time health monitoring system (C++ / IoT)

### 🧑‍💼 Professional Experience
- **Solar Energy Intern** (6 months) — On/Off-grid systems, solar water heaters, fencing, troubleshooting

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS (glassmorphism, CSS variables, `clamp()`) |
| Animations | [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) v2.3.1 |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts |
| Hosting | GitHub Pages |

---

## 🚀 Running Locally

No build step required — this is a static single-page site.

```bash
# Clone the repository
git clone https://github.com/akshithmandapally-cmyk/elechip.git

cd elechip

# Open directly in your browser
open index.html
```

Or serve it with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## 📱 Responsive Design

| Breakpoint | Behaviour |
|-----------|-----------|
| `> 768px` | Full desktop layout — 2-column process steps, horizontal nav links |
| `≤ 768px` | Single-column layout, hamburger menu with full-screen overlay nav |
| `≤ 480px` | Adjusted spacing and fluid font sizing via `clamp()` |

---

## 🎨 Design Highlights

- **Color palette:** Pure deep blacks (`#000000`, `#050505`) transitioning to dark charcoal (`#0a0a0a`) with subtle blue accent glows
- **Glassmorphism cards:** `backdrop-filter: blur(12px)` + semi-transparent white borders on all text/project boxes
- **Gradient text:** Hero heading uses a white → light blue → cyan gradient
- **Micro-animations:** AOS scroll reveals, hover lift on cards, crossfade between etching & deposition images, scroll cue bounce

---

## 📬 Contact

| Platform | Link |
|---------|------|
| Email | [akshith.mandapally@gmail.com](mailto:akshith.mandapally@gmail.com) |
| GitHub | [@akshithmandapally-cmyk](https://github.com/akshithmandapally-cmyk) |
| LinkedIn | [Akshith Mandapally](https://linkedin.com/in/akshith-mandapally-078691280) |

> Based in India • Open to Relocation

---

## 📄 License

This project is open source. Feel free to use it as inspiration for your own portfolio — just swap out the content and images!

---

*Built with passion © 2026 Akshith Mandapally*
