# ELCHIP — Semiconductor Manufacturing & Inspection Platform

> An interactive educational web application that visually walks through the complete semiconductor IC fabrication process — from silicon wafer preparation to final package testing.

**Live site:** [View Platform](https://akshithmandapally-cmyk.github.io/elechip/) &nbsp;|&nbsp; **Author:** [Akshith Mandapally](https://linkedin.com/in/akshith-mandapally-078691280)

---

## 📸 Overview

A single-page application (SPA) built with pure HTML, CSS, and vanilla JavaScript — no framework required. Clicking any manufacturing step navigates to a dedicated detail page with technical content extracted from a semiconductor manufacturing reference document.

**What you get:**
- 13 fully detailed IC fabrication process pages
- 10 inspection & metrology tool pages with SVG schematic diagrams
- 16 company profiles (foundries + equipment suppliers)
- Live search across all content
- Animated 300mm silicon wafer visualization
- Semiconductor glossary with popup definitions
- Fully responsive — works on mobile, tablet, and desktop

---

## 🗂️ Project Structure

```
elechip/
├── index.html                          # Secure HTML shell — CSP, X-Frame-Options, load order
├── style.css                           # Global design system (1,100+ lines)
├── app.js                              # Hash-based SPA router + nav + live search
│
├── data/
│   └── semiconductor.js               # All platform data — 13 steps, 10 tools, 16 companies (72KB)
│
├── components/
│   └── wafer-canvas.js               # Canvas 2D wafer animation + glossary overlay
│
├── pages/
│   ├── home.js                        # Landing page — hero, timeline, tool & company previews
│   ├── process.js                     # Process detail page (used for all 13 steps)
│   ├── tool.js                        # Inspection tool detail + SVG schematic diagrams
│   └── companies.js                   # Companies directory + fab economics section
│
├── background.png                      # Hero background texture
├── real_wafer_1779418564747.png        # Silicon wafer reference image
├── real_photolitho_1779418591399.png   # Photolithography machine
├── real_deposition_1779418616958.png   # Deposition process
├── real_etching_1779418641999.png      # Etching process
├── real_ion_implant_1779418669250.png  # Ion implantation
├── real_metrology_1779418693534.png    # SEM metrology
└── real_chip_pkg_1779418720672.png     # Packaged chip
```

---

## ✨ Features

### 🏭 13 Manufacturing Process Steps

| Step | Process |
|------|---------|
| 01 | **Wafer Preparation** — Czochralski crystal growth, wafer slicing & polishing |
| 02 | **Thermal Oxidation** — Dry/wet oxidation, SiO₂ gate & field oxide growth |
| 03 | **Photolithography** — EUV/DUV exposure, resist coating, development, alignment |
| 04 | **Etching** — RIE, ICP-RIE, DRIE plasma etching; HF wet etching |
| 05 | **Ion Implantation** — Boron/arsenic/phosphorus doping, dose & energy control |
| 06 | **Thin Film Deposition** — CVD, PVD, ALD, PECVD, epitaxy |
| 07 | **CMP** — Chemical-mechanical planarization, endpoint detection |
| 08 | **Metallization** — Dual damascene Cu ECP, barrier/seed deposition |
| 09 | **Wafer Inspection** — Post-process metrology, defect review |
| 10 | **Die Testing (EDS)** — Electrical die sort, wafer-level test |
| 11 | **Dicing** — Diamond blade & stealth laser dicing |
| 12 | **Packaging** — Wire bond, flip-chip, BGA, SiP |
| 13 | **Final Testing** — ATE functional test, burn-in, IDDQ |

Each step page includes: overview, technical parameters, animated process flow diagram, inspection tools used, and equipment supplier profiles.

---

### 🔬 10 Inspection & Metrology Tool Pages

| Tool | Full Name |
|------|-----------|
| **CD-SEM** | Critical Dimension Scanning Electron Microscope |
| **Ellipsometer** | Spectroscopic Ellipsometer |
| **Overlay SEM** | Overlay Metrology Tool |
| **Optical Inspector** | Brightfield/Darkfield Wafer Inspection System |
| **E-Beam Inspector** | Electron Beam Inspection System |
| **XRD** | X-Ray Diffractometer |
| **AOI** | Automated Optical Inspection System |
| **Profilometer** | Contact/Optical Surface Profilometer |
| **X-Ray Inspector** | X-Ray Laminography / CT System |
| **Dopant Profiler** | SIMS — Secondary Ion Mass Spectrometer |

Each tool page includes: working principle, **custom SVG schematic diagram**, technical specs, applications, advantages/limitations, and manufacturers.

---

### 🏢 Companies Directory

**Foundries & IDMs (7):** TSMC · Samsung Foundry · Intel Foundry · GlobalFoundries · Micron · SK hynix · Texas Instruments

**Equipment & Inspection (9):** ASML · KLA Corporation · Applied Materials · Lam Research · Tokyo Electron · Hitachi High-Tech · Onto Innovation · Nova · Axcelis Technologies

Plus a **Fab Economics** section covering EUV tool costs, wafer prices, yield rates, and design-to-production timelines.

---

### 🔍 Live Search

Real-time debounced search (150ms) across all 13 steps, 10 tools, 16 companies, and 15 glossary terms. Results appear in a dropdown — no page reload.

---

### 🌊 Wafer Canvas Animation

Canvas 2D animation of a 300mm silicon wafer with:
- Rotating circuit rings with animated node pulses
- Die grid that lights up as the scan passes over
- Rotating inspection scan beam
- 60fps — no WebGL or external 3D library

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------| 
| Markup | HTML5 (semantic, accessible) |
| Styling | Vanilla CSS — design tokens, glassmorphism, `clamp()`, CSS Grid |
| Logic | Vanilla JavaScript (ES6+) — zero dependencies, no framework |
| Routing | Custom hash-based SPA router (`app.js`) |
| Animation | Canvas 2D API + CSS keyframe animations |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts |
| Scroll FX | [AOS v2.3.1](https://michalsnik.github.io/aos/) — Animate On Scroll |
| Hosting | GitHub Pages |

---

## 🚀 Running Locally

No build step required. This is a fully static SPA.

```bash
# Clone the repository
git clone https://github.com/akshithmandapally-cmyk/elechip.git
cd elechip

# Option 1: Open directly in browser
open index.html

# Option 2: Serve locally (recommended — avoids CORS on file://)
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## 🗺️ Page Routes

| Hash Route | Page |
|-----------|------|
| `#/` | Home — hero + process timeline |
| `#/process-flow` | Scroll to process timeline |
| `#/process/wafer-preparation` | Silicon Wafer Preparation |
| `#/process/photolithography` | Photolithography |
| `#/process/etching` | Etching |
| `#/process/<slug>` | Any of the 13 steps |
| `#/tools` | All inspection tools list |
| `#/tool/cd-sem` | CD-SEM detail |
| `#/tool/<slug>` | Any of the 10 tools |
| `#/companies` | Companies + fab economics |
| `#/glossary` | Semiconductor glossary |

---

## 📱 Responsive Design

| Breakpoint | Behaviour |
|-----------|-----------|
| `> 900px` | Full desktop layout — multi-column grids, full nav |
| `≤ 768px` | Mobile layout — hamburger menu, single-column cards |
| `≤ 480px` | Compact spacing, fluid font sizing via `clamp()` |

---

## 🔒 Security

| Measure | Detail |
|---------|--------|
| **XSS Prevention** | All dynamic content set via `textContent` — zero `innerHTML` with user data |
| **SVG Safety** | All SVG diagrams built via `DOMParser` (not `innerHTML`) |
| **CSP** | `Content-Security-Policy` meta tag restricts scripts to `self` + unpkg.com |
| **Clickjacking** | `X-Frame-Options: DENY` |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` |
| **Event Listeners** | All events via `addEventListener` — no inline `onclick` attributes |

---

## 🎨 Design System

- **Palette:** Pure black (`#000`) background → white text with blue (`#4f8ef7`) and cyan (`#67e8f9`) accents
- **Glassmorphism:** `backdrop-filter: blur(12–24px)` + semi-transparent borders throughout
- **Typography:** Inter (UI) + JetBrains Mono (labels, code, badges)
- **Gradient text:** Hero and logo use white → cyan gradient via `-webkit-background-clip: text`
- **Micro-animations:** Page transitions (fade + translate), card hover lifts, canvas wafer, particle field

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

Open source — feel free to use as inspiration. Swap out the content for your own domain!

---

*Built with precision © 2026 Akshith Mandapally*
