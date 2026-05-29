// semiconductor.js — All data for the semiconductor manufacturing educational platform
// Extracted and organized from the semiconductor manufacturing PDF reference document
// TODO(security): This file contains only static educational data — no user input processed here

window.SEMI_DATA = {

  /* ─── GLOSSARY ─────────────────────────────────────────────────────── */
  glossary: [
    { term: 'Wafer', definition: 'A thin, flat disc of semiconductor material (usually silicon) used as the substrate for integrated circuit fabrication.' },
    { term: 'Lithography', definition: 'The process of transferring a geometric pattern from a photomask to a light-sensitive coating (photoresist) on the wafer surface using light or electrons.' },
    { term: 'Etching', definition: 'Selective material removal using chemical solutions (wet) or ionized gas plasma (dry) to transfer patterns into underlying material layers.' },
    { term: 'Deposition', definition: 'The process of adding thin layers of material (insulators, metals, or semiconductors) onto the wafer surface using physical or chemical vapor deposition methods.' },
    { term: 'CMP', definition: 'Chemical Mechanical Planarization — a process using both chemical slurry and mechanical polishing to achieve a globally flat wafer surface between fabrication steps.' },
    { term: 'Metrology', definition: 'The science and practice of precision measurement in semiconductor manufacturing — including film thickness, overlay alignment, critical dimensions, and defect inspection.' },
    { term: 'Overlay', definition: 'The alignment accuracy between successive photolithography exposure layers on a wafer. Poor overlay causes transistor and interconnect failures.' },
    { term: 'Dopant', definition: 'An impurity element (boron, phosphorus, arsenic) intentionally introduced into silicon to alter its electrical conductivity and create P-type or N-type regions.' },
    { term: 'Photoresist', definition: 'A light-sensitive polymer coating applied to the wafer. Exposed regions undergo chemical change enabling selective development and pattern transfer.' },
    { term: 'Plasma', definition: 'An ionized gas containing electrons, ions, and radicals, created by applying RF energy. Used in etching and deposition processes.' },
    { term: 'ALD', definition: 'Atomic Layer Deposition — a thin film technique depositing one monolayer at a time via sequential self-limiting surface reactions, enabling angstrom-level thickness control.' },
    { term: 'EUV', definition: 'Extreme Ultraviolet lithography — uses 13.5 nm wavelength light (vs 193 nm DUV) enabling sub-7 nm feature patterning for advanced chip nodes.' },
    { term: 'Yield', definition: 'The percentage of dies on a wafer that pass all electrical tests. Mature nodes achieve 80-95%; cutting-edge nodes 30-60% due to defect sensitivity.' },
    { term: 'Die', definition: 'A single rectangular piece cut from a processed wafer containing a complete functional integrated circuit.' },
    { term: 'Node', definition: 'A technology generation label (e.g., 7 nm, 3 nm) referring to the minimum feature size or transistor density of a manufacturing process.' },
  ],

  /* ─── COMPANIES ─────────────────────────────────────────────────────── */
  companies: {
    foundries: [
      { id: 'tsmc', name: 'TSMC', fullName: 'Taiwan Semiconductor Manufacturing Company', country: 'Taiwan', flag: '🇹🇼', marketCap: '$800B+', description: 'World\'s largest pure-play foundry with 55% global market share. Manufactures chips for Apple, NVIDIA, AMD, Qualcomm at leading-edge nodes down to 2nm.', specialization: 'Logic, RF, HPC, Mobile SoC', keyProducts: ['N3 (3nm)', 'N5 (5nm)', 'N7 (7nm)', 'CoWoS Packaging'], nodes: ['2nm', '3nm', '5nm', '7nm'] },
      { id: 'samsung', name: 'Samsung', fullName: 'Samsung Electronics', country: 'South Korea', flag: '🇰🇷', marketCap: '$350B+', description: 'Vertically integrated IDM and foundry. Manufactures DRAM, NAND Flash, and logic chips with leading 3GAE (3nm Gate-All-Around) process.', specialization: 'Memory, Logic, Display Drivers', keyProducts: ['3GAE GAA', 'DRAM DDR5', 'LPDDR5X'], nodes: ['3nm GAA', '4nm', '5nm'] },
      { id: 'intel', name: 'Intel', fullName: 'Intel Corporation', country: 'USA', flag: '🇺🇸', marketCap: '$130B+', description: 'Founded Intel Foundry Services (IFS). Manufactures own CPUs and is building external foundry capacity with Intel 18A (1.8nm-class) process using RibbonFET and PowerVia.', specialization: 'CPU, Data Center, AI Accelerators', keyProducts: ['Intel 18A', 'Intel 3', 'Meteor Lake'], nodes: ['18A', 'Intel 3', 'Intel 4'] },
      { id: 'globalfoundries', name: 'GlobalFoundries', fullName: 'GlobalFoundries Inc.', country: 'USA', flag: '🇺🇸', marketCap: '$18B+', description: 'Specializes in feature-rich 22nm and above nodes for automotive, aerospace, IoT, and RF applications. Operates fabs in USA, Germany, and Singapore.', specialization: 'RF, Automotive, Aerospace, IoT', keyProducts: ['22FDX', 'GF 12LP+', 'SiGe RF'], nodes: ['22nm', '14nm', '12nm'] },
      { id: 'micron', name: 'Micron', fullName: 'Micron Technology', country: 'USA', flag: '🇺🇸', marketCap: '$120B+', description: 'Leading DRAM and NAND Flash memory manufacturer. Produces HBM3 for AI accelerators and 232-layer 3D NAND for storage applications.', specialization: 'DRAM, NAND Flash, HBM Memory', keyProducts: ['HBM3', 'DDR5', '232L 3D NAND'] },
      { id: 'skhynix', name: 'SK hynix', fullName: 'SK hynix Inc.', country: 'South Korea', flag: '🇰🇷', marketCap: '$100B+', description: 'Second-largest DRAM manufacturer. Supplies HBM3E memory for NVIDIA H100/H200 GPUs. Key memory partner for AI computing infrastructure.', specialization: 'DRAM, HBM, NAND Flash', keyProducts: ['HBM3E', 'DDR5', 'LPDDR5'] },
      { id: 'ti', name: 'Texas Instruments', fullName: 'Texas Instruments Inc.', country: 'USA', flag: '🇺🇸', marketCap: '$150B+', description: 'Designs and manufactures analog and embedded processors. Operates its own 300mm fabs for cost-efficient analog/mixed-signal chip production.', specialization: 'Analog, Mixed-Signal, Embedded', keyProducts: ['MSPM0 MCU', 'TPS Power ICs', 'TLV Op-Amps'] },
    ],
    equipment: [
      { id: 'asml', name: 'ASML', fullName: 'ASML Holding N.V.', country: 'Netherlands', flag: '🇳🇱', marketCap: '$260B+', description: 'Sole supplier of EUV lithography systems globally. Each EUV machine costs $150-200M and requires millions of parts from 5,000+ suppliers. Critical monopoly in advanced chip manufacturing.', specialization: 'Lithography Systems (DUV, EUV)', keyProducts: ['TWINSCAN EUV', 'TWINSCAN NXT (DUV)', 'High-NA EUV'], processes: ['Photolithography'] },
      { id: 'kla', name: 'KLA Corporation', fullName: 'KLA Corporation', country: 'USA', flag: '🇺🇸', marketCap: '$90B+', description: 'World leader in process control and yield management. KLA inspection and metrology tools are used at virtually every process step in a modern semiconductor fab.', specialization: 'Inspection, Metrology, Process Control', keyProducts: ['eDR-7000 e-beam', 'Puma 9000 (optical)', 'ARCHER Overlay'], processes: ['All steps — wafer prep through packaging'] },
      { id: 'applied-materials', name: 'Applied Materials', fullName: 'Applied Materials Inc.', country: 'USA', flag: '🇺🇸', marketCap: '$160B+', description: 'Largest semiconductor equipment company by revenue. Supplies PVD, CVD, ALD, CMP, etch, and ion implant systems. Over 25 billion dollar market cap.', specialization: 'Deposition, Etch, CMP, Implant', keyProducts: ['Centura PVD', 'Producer CVD', 'Reflexion CMP'], processes: ['Deposition', 'Etching', 'CMP', 'Ion Implantation'] },
      { id: 'lam-research', name: 'Lam Research', fullName: 'Lam Research Corporation', country: 'USA', flag: '🇺🇸', marketCap: '$90B+', description: 'Leading supplier of etch and deposition equipment. Critical for high-aspect-ratio etch in 3D NAND and FinFET/GAA transistor fabrication.', specialization: 'Plasma Etch, CVD Deposition', keyProducts: ['Kiyo Etch', 'Vantex ICP', 'VECTOR PECVD'], processes: ['Etching', 'Deposition', 'CMP'] },
      { id: 'tel', name: 'Tokyo Electron', fullName: 'Tokyo Electron Limited', country: 'Japan', flag: '🇯🇵', marketCap: '$38B+', description: 'Japan\'s leading semiconductor equipment maker. Supplies etch, CVD, PVD, coater/developer, and thermal processing systems to global fabs.', specialization: 'Etch, CVD, Coater/Developer', keyProducts: ['Tactras PVD', 'Triase Oxide CVD', 'Lithius Coater'], processes: ['Photolithography', 'Etching', 'Deposition'] },
      { id: 'hitachi-hightech', name: 'Hitachi High-Tech', fullName: 'Hitachi High-Tech Corporation', country: 'Japan', flag: '🇯🇵', marketCap: 'Private', description: 'Leading supplier of CD-SEM (Critical Dimension SEM) and wafer surface inspection systems. Critical for pattern measurement at advanced nodes.', specialization: 'CD-SEM, Wafer Inspection, Defect Analysis', keyProducts: ['CG7000 CD-SEM', 'LS Series Inspection', 'TEM Systems'], processes: ['Photolithography', 'Etching', 'Wafer Inspection'] },
      { id: 'onto-innovation', name: 'Onto Innovation', fullName: 'Onto Innovation Inc.', country: 'USA', flag: '🇺🇸', marketCap: '$6B+', description: 'Specializes in advanced process control, overlay metrology, and film thickness measurement. Key supplier for packaging inspection and advanced node patterning.', specialization: 'Overlay Metrology, Film Thickness, Packaging Inspection', keyProducts: ['Dragonfly G3 (packaging)', 'Iris 8 (overlay)', 'Atlas V (optical)'], processes: ['Photolithography', 'CMP', 'Packaging'] },
      { id: 'nova', name: 'Nova', fullName: 'Nova Ltd.', country: 'Israel', flag: '🇮🇱', marketCap: '$5B+', description: 'Provides integrated process control solutions including optical CD, X-ray metrology, and chemical analysis. Critical for oxide thickness and film composition measurement.', specialization: 'Optical Metrology, X-ray, Chemical Analysis', keyProducts: ['Metrion X-ray', 'Prism OCD', 'Nova i500'], processes: ['Oxidation', 'Deposition', 'CMP'] },
      { id: 'axcelis', name: 'Axcelis Technologies', fullName: 'Axcelis Technologies Inc.', country: 'USA', flag: '🇺🇸', marketCap: '$3B+', description: 'Leading supplier of ion implantation systems. Provides high-current, high-energy, and medium-current implant systems for all doping requirements in IC fabrication.', specialization: 'Ion Implantation Systems', keyProducts: ['Purion H (high current)', 'Purion E (high energy)', 'Purion M (medium current)'], processes: ['Ion Implantation'] },
    ]
  },

  /* ─── INSPECTION TOOLS ──────────────────────────────────────────────── */
  tools: [
    {
      id: 'cd-sem', slug: 'cd-sem', name: 'CD-SEM',
      fullName: 'Critical Dimension Scanning Electron Microscope',
      icon: '🔬',
      principle: 'A focused electron beam scans the wafer surface. Secondary electrons emitted at feature edges create high-contrast images. Software algorithms measure feature widths (critical dimensions) at nanometer resolution, far beyond optical limits.',
      specs: ['Resolution: <1 nm', 'Measurement accuracy: ±0.3 nm', 'Throughput: 100+ wafers/hour', 'Voltage: 0.2–2 kV', 'Landing energy: 100 eV–10 keV'],
      applications: ['Gate length measurement', 'Contact hole diameter', 'Spacer width', 'Pitch verification after EUV patterning'],
      advantages: ['Sub-nanometer resolution', 'Non-destructive', 'High throughput with automated recipe', 'Direct feature measurement'],
      limitations: ['Slower than optical', 'Electron beam charging on insulators', 'Requires vacuum environment', 'Sample contamination risk'],
      manufacturers: ['Hitachi High-Tech (CG7000)', 'Applied Materials (VeritySEM)', 'JEOL Ltd.'],
      processes: ['Photolithography', 'Etching'],
      category: 'Metrology'
    },
    {
      id: 'ellipsometer', slug: 'ellipsometer', name: 'Ellipsometer',
      fullName: 'Spectroscopic Ellipsometer',
      icon: '💡',
      principle: 'Polarized light reflects from the film surface. The change in polarization state (amplitude ratio Ψ and phase difference Δ) is measured. Film thickness and optical constants are extracted by fitting measured data to optical models.',
      specs: ['Wavelength range: 190–900 nm', 'Thickness range: 0.1 nm – 100 μm', 'Accuracy: ±0.1 nm', 'Spot size: 25 μm – 1 mm', 'Measurement time: <1 second per point'],
      applications: ['Oxide film thickness', 'Photoresist thickness', 'Metal film measurement', 'Silicon nitride thickness', 'Multi-layer stack characterization'],
      advantages: ['Extremely sensitive (sub-nm)', 'Non-destructive', 'Fast measurement', 'Multi-layer capability'],
      limitations: ['Requires optical model', 'Less accurate on rough surfaces', 'Limited for opaque metal films', 'Model-dependent results'],
      manufacturers: ['KLA (Arachnid)', 'Nova (Prism OCD)', 'Woollam Co.', 'Onto Innovation'],
      processes: ['Oxidation', 'Deposition', 'CMP'],
      category: 'Metrology'
    },
    {
      id: 'overlay-sem', slug: 'overlay-sem', name: 'Overlay Metrology',
      fullName: 'Overlay Inspection System',
      icon: '🎯',
      principle: 'Optical or e-beam systems measure the relative displacement between alignment marks printed in successive lithography layers. Image-based (IBO) or diffraction-based (DBO) overlay metrology achieves sub-nanometer accuracy.',
      specs: ['Measurement accuracy: <0.3 nm (3σ)', 'Throughput: 100+ wafers/hour', 'Mark size: 10–40 μm', 'Wavelength: 400–700 nm (IBO)', 'TIS (Tool-Induced Shift) <0.1 nm'],
      applications: ['Layer-to-layer alignment verification', 'Scanner calibration', 'Process window optimization', 'Lot disposition decisions'],
      advantages: ['High throughput', 'Non-destructive', 'Statistical process control integration', 'APC feedback capability'],
      limitations: ['Only measures at mark locations', 'Mark placement may not represent device area', 'Requires dedicated overlay marks'],
      manufacturers: ['KLA (ARCHER)', 'ASML (YieldStar)', 'Onto Innovation (Iris)', 'Nova'],
      processes: ['Photolithography'],
      category: 'Metrology'
    },
    {
      id: 'optical-wafer-inspection', slug: 'optical-wafer-inspection', name: 'Optical Wafer Inspector',
      fullName: 'Brightfield/Darkfield Optical Wafer Inspection',
      icon: '👁️',
      principle: 'High-intensity light (laser or broadband) illuminates the wafer. Scattered light from defects is captured by a detector array. Die-to-die or die-to-database comparison algorithms identify anomalies at high throughput.',
      specs: ['Defect sensitivity: 15–40 nm PSL', 'Throughput: 30–100 wafers/hour', 'Illumination: 193 nm to 800 nm', 'Modes: Brightfield, Darkfield, Multi-mode'],
      applications: ['Particle contamination', 'Pattern defects', 'Scratches, pits', 'Gross process excursions', 'Yield monitoring'],
      advantages: ['Very high throughput', 'Sensitive to large area defects', 'Die-to-die comparison', 'Low cost of ownership'],
      limitations: ['Limited resolution vs. e-beam', 'Cannot identify defect type directly', 'Requires review tool for classification'],
      manufacturers: ['KLA (Puma, eSL10)', 'Applied Materials (SEMVision)', 'ASML'],
      processes: ['Wafer Inspection', 'CMP', 'Etching'],
      category: 'Inspection'
    },
    {
      id: 'ebeam-inspection', slug: 'ebeam-inspection', name: 'E-Beam Inspector',
      fullName: 'Electron Beam Defect Inspection System',
      icon: '⚡',
      principle: 'A focused electron beam rasters the wafer surface at high resolution. Secondary and backscattered electrons generate images with sensitivity to both physical defects and electrical contrast differences (voltage contrast), enabling detection of buried and electrical defects.',
      specs: ['Resolution: <5 nm', 'Voltage contrast sensitivity: Detects open/short circuits', 'Throughput: 0.5–5 wafers/hour', 'Beam energy: 1–3 keV'],
      applications: ['Contact/via open detection', 'Buried defects', 'Electrical defect capture', 'Logic and memory pattern inspection at advanced nodes'],
      advantages: ['Highest sensitivity', 'Voltage contrast for electrical defects', 'Sub-5 nm resolution', 'Detects buried defects'],
      limitations: ['Low throughput vs. optical', 'Expensive', 'Charging artifacts on insulators', 'Requires vacuum'],
      manufacturers: ['KLA (eDR-7000, CIRCL-8)', 'Applied Materials (SEMVision)', 'Hitachi High-Tech'],
      processes: ['Wafer Inspection', 'Photolithography'],
      category: 'Inspection'
    },
    {
      id: 'xrd', slug: 'xrd', name: 'XRD / XRF',
      fullName: 'X-Ray Diffraction / X-Ray Fluorescence',
      icon: '☢️',
      principle: 'X-rays directed at the wafer diffract off crystal planes (XRD) or excite characteristic fluorescent X-rays from elements (XRF). Diffraction patterns reveal crystal structure, strain, and film quality; fluorescence spectra reveal elemental composition.',
      specs: ['Composition accuracy: <0.1%', 'Thickness range: 1 nm – 1 μm', 'Non-destructive', 'Spot size: 100 μm – 1 mm'],
      applications: ['Dopant concentration verification', 'Film composition analysis', 'Crystal quality assessment', 'Metal alloy composition'],
      advantages: ['Elemental composition', 'Crystal structure information', 'Non-destructive', 'Standardless analysis possible'],
      limitations: ['Poor spatial resolution', 'Limited to bulk/thick films for best sensitivity', 'Requires skilled interpretation'],
      manufacturers: ['Thermo Fisher Scientific', 'Rigaku', 'Nova (Metrion X-ray)', 'PANalytical'],
      processes: ['Oxidation', 'Ion Implantation', 'Deposition'],
      category: 'Metrology'
    },
    {
      id: 'aoi', slug: 'aoi', name: 'AOI System',
      fullName: 'Automated Optical Inspection',
      icon: '🔍',
      principle: 'High-resolution cameras capture images of packaged devices or PCBs. Image processing algorithms compare captured images against a golden reference, flagging dimensional, solder, or cosmetic defects at high speed.',
      specs: ['Resolution: 5–15 μm/pixel', 'Speed: up to 150 cm²/second', 'False call rate: <200 ppm', 'Defect types: 50+ categories'],
      applications: ['Bond wire inspection', 'Package defects', 'Lead coplanarity', 'Solder joint verification', 'Marking legibility'],
      advantages: ['High throughput', '100% inspection possible', 'Non-contact', 'Traceable defect data'],
      limitations: ['Cannot detect internal defects', 'Requires good lighting setup', 'False alarm management needed'],
      manufacturers: ['Nordson (Dage)', 'Cohu', 'Onto Innovation (Dragonfly)', 'Camtek'],
      processes: ['Packaging', 'Final Inspection'],
      category: 'Inspection'
    },
    {
      id: 'profilometer', slug: 'profilometer', name: 'Surface Profilometer',
      fullName: 'Contact / Optical Surface Profilometer',
      icon: '📏',
      principle: 'Contact: A diamond stylus drags across the surface. Vertical deflection is measured as a function of position. Optical: White-light interferometry or confocal microscopy measures surface height without contact at nanometer vertical resolution.',
      specs: ['Vertical resolution: 0.1 nm (optical)', 'Scan range: 1 μm – 100 mm', 'Roughness measurement: Ra, Rq, Rz', 'Step height accuracy: ±1 nm'],
      applications: ['CMP planarity verification', 'Film step height', 'Surface roughness (Ra)', 'Resist coat uniformity', 'Etch depth'],
      advantages: ['Direct height measurement', 'Wide measurement range', 'Simple calibration'],
      limitations: ['Contact may damage soft films', 'Slow for large area', 'Limited lateral resolution vs. AFM'],
      manufacturers: ['KLA-Tencor (P-series)', 'Bruker (DektakXT)', 'Zygo Corporation', 'Onto Innovation'],
      processes: ['CMP', 'Deposition', 'Etching'],
      category: 'Metrology'
    },
    {
      id: 'xray-inspection', slug: 'xray-inspection', name: 'X-Ray Inspection',
      fullName: 'X-Ray Transmission Inspection System',
      icon: '🩻',
      principle: 'X-rays penetrate the package and are captured by a detector. Dense materials (solder, bond wires, die) absorb more X-rays, creating contrast. Real-time 2D or computed tomography (CT) 3D images reveal internal package structure.',
      specs: ['Resolution: 0.1–5 μm', 'Energy: 10–160 kVp', 'Modes: 2D, 3D CT', 'Sample size: Up to 300mm wafer or full FCBGA'],
      applications: ['BGA solder joint inspection', 'Bond wire detection', 'Void detection in die attach', '3D package CT analysis', 'Delamination detection'],
      advantages: ['Non-destructive', 'Sees through package', '3D capability with CT', 'No sample prep'],
      limitations: ['Low resolution for fine features', 'Slow for CT mode', 'X-ray dose considerations', 'Expensive CT systems'],
      manufacturers: ['Nordson DAGE', 'Cohu (Xceed)', 'Nikon Metrology', 'Bruker'],
      processes: ['Packaging', 'Final Inspection'],
      category: 'Inspection'
    },
    {
      id: 'dopant-profiler', slug: 'dopant-profiler', name: 'SIMS / Dopant Profiler',
      fullName: 'Secondary Ion Mass Spectrometry',
      icon: '⚗️',
      principle: 'A focused primary ion beam sputters atoms from the sample surface. Ejected secondary ions are analyzed by mass spectrometry. Depth profiling reveals dopant concentration vs. depth with parts-per-billion sensitivity.',
      specs: ['Depth resolution: 1–5 nm', 'Sensitivity: 1×10¹³ – 1×10²³ atoms/cm³', 'Detects: All elements including H, B, P, As', 'Destructive technique'],
      applications: ['Dopant profile verification', 'Implant dose confirmation', 'Thin film composition', 'Diffusion profile measurement'],
      advantages: ['Highest elemental sensitivity', 'Depth profiling', 'Detects hydrogen', 'Quantitative with standards'],
      limitations: ['Destructive — destroys sample', 'Low throughput', 'Requires calibration standards', 'Vacuum required'],
      manufacturers: ['Thermo Fisher (SIMS)', 'Cameca (IMS series)', 'Physical Electronics'],
      processes: ['Ion Implantation', 'Oxidation'],
      category: 'Metrology'
    },
  ],

  /* ─── MANUFACTURING STEPS ─────────────────────────────────────────── */
  steps: [
    {
      id: 'wafer-preparation',
      slug: 'wafer-preparation',
      stepNumber: '01',
      title: 'Silicon Wafer Preparation',
      shortDesc: 'From sand to perfect silicon — growing and slicing the foundation of all chips.',
      image: 'real_wafer_1779418564747.png',
      color: '#4f8ef7',
      overview: 'Silicon wafer preparation is the foundational first step of semiconductor manufacturing. Starting with metallurgical-grade silicon refined from quartz sand, the silicon is purified to electronic grade (99.9999999% purity) using the Siemens process or fluidized bed reactor. The purified polysilicon is then melted and grown into a perfect single-crystal ingot using the Czochralski (CZ) method. This ingot is sliced into ultra-thin wafers, lapped, etched, and polished to a mirror finish that serves as the substrate for all subsequent fabrication steps.',
      technicalDetail: `CRYSTAL GROWTH: The Czochralski process melts polysilicon in a quartz crucible at 1,420°C (above silicon's melting point of 1,414°C). A seed crystal is slowly rotated and pulled upward while the crucible rotates in the opposite direction. Crystal diameter is precisely controlled by adjusting pull rate (0.5-2 mm/min) and temperature, creating ingots up to 450mm (18") diameter.

SLICING: Diamond wire saws cut 200-300mm ingots into wafers 700-800 μm thick. Sawing speed 0.1-1 mm/minute with coolant flow. Wire diameter 100-200 μm.

LAPPING & ETCHING: Abrasive slurry with Al₂O₃ particles laps both surfaces flat to <2 μm TTV (total thickness variation). Chemical etch (HF/HNO₃ mixture) removes saw damage.

POLISHING: Chemical Mechanical Polishing (CMP) with colloidal silica slurry creates a mirror surface. Final roughness Ra <0.1 nm. Flatness <100 nm across 300mm wafer.

CLEANING: Multi-step RCA clean removes organic and metallic contamination. SC-1 (NH₄OH/H₂O₂) removes organics and particles. SC-2 (HCl/H₂O₂) removes metals.`,
      processFlow: [
        { step: 'Raw Quartz Mining', desc: 'SiO₂ extracted and refined to metallurgical silicon (98%)' },
        { step: 'Siemens Purification', desc: 'TCS (SiHCl₃) CVD deposition achieves 11N purity polysilicon' },
        { step: 'Czochralski Growth', desc: 'Single crystal ingot pulled from melt at 1,420°C, 1-6mm/min' },
        { step: 'Ingot Grinding', desc: 'Cylindrical grinding to precise diameter (300mm ± 0.2mm)' },
        { step: 'Diamond Wire Slicing', desc: 'Cut into 775 μm thick wafers at 0.5mm/min' },
        { step: 'CMP Polishing', desc: 'Mirror finish Ra <0.1 nm, flatness <100 nm' },
        { step: 'RCA Cleaning', desc: 'Remove organics, particles, and metallic contamination' },
        { step: 'QC Inspection', desc: 'Surface defect, thickness, and orientation verification' },
      ],
      inspectionTools: ['cd-sem', 'optical-wafer-inspection', 'xrd', 'profilometer'],
      companies: ['shin-etsu', 'sumco', 'siltronic', 'globalwafers'],
      companyDetails: [
        { name: 'Shin-Etsu Chemical', country: 'Japan', role: 'Wafer supplier, #1 globally (30% share). Also supplies photoresists and specialty chemicals.' },
        { name: 'SUMCO Corporation', country: 'Japan', role: 'Wafer supplier, #2 globally. Specializes in large-diameter 300mm silicon wafers.' },
        { name: 'Siltronic AG', country: 'Germany', role: 'European wafer supplier for 200mm and 300mm wafers. Joint venture with GlobalWafers.' },
        { name: 'GlobalWafers', country: 'Taiwan', role: '#3 global silicon wafer supplier after acquiring Siltronic. Supplies TSMC, Samsung.' },
        { name: 'KLA Corporation', country: 'USA', role: 'Wafer surface inspection and metrology systems for incoming wafer QC.' },
      ]
    },

    {
      id: 'oxidation',
      slug: 'oxidation',
      stepNumber: '02',
      title: 'Oxidation',
      shortDesc: 'Growing a flawless glass insulating layer atom by atom on the silicon surface.',
      image: null,
      color: '#67e8f9',
      overview: 'Thermal oxidation grows silicon dioxide (SiO₂) on the wafer surface by exposing silicon to high-temperature oxygen or steam. SiO₂ is one of silicon\'s most valuable properties — a near-perfect insulator that forms the gate dielectric in MOSFETs, field isolation, and passivation layers. The oxide grows by consuming silicon (54% of final oxide thickness is from Si consumption), creating an atomically abrupt Si/SiO₂ interface with very low interface state density critical for transistor performance.',
      technicalDetail: `DRY OXIDATION (Si + O₂ → SiO₂): Temperature 900-1,100°C. Oxidation rate: 2–10 nm/min. Creates highest quality oxide with fewest defects. Used for gate oxides (thin, <10 nm). Growth rate follows Deal-Grove model: x² + Ax = B(t+τ) where A, B are temperature-dependent constants.

WET OXIDATION (Si + 2H₂O → SiO₂ + 2H₂): Temperature 800-1,000°C. Rate 5-100× faster than dry. Rate: 10–500 nm/min. Lower oxide quality due to OH⁻ incorporation. Used for thick field oxide (LOCOS/STI) up to 500 nm.

HIGH PRESSURE OXIDATION (HIPOX): 1-25 atm pressure with steam. Lower temperature (750-900°C) reducing dopant diffusion. Faster growth rate.

ADVANCED GATE DIELECTRICS: Below 45nm node, thermal SiO₂ replaced by High-k dielectrics (HfO₂, ZrO₂, Al₂O₃) deposited by ALD. K-value 20-25 vs. 3.9 for SiO₂. Equivalent oxide thickness (EOT) <1 nm.

KEY METRICS: Oxide thickness uniformity <1% across wafer. Interface state density (Dit) <10¹⁰ /cm²/eV. Fixed oxide charge (Qf) <10¹⁰ /cm². Breakdown field >10 MV/cm.`,
      processFlow: [
        { step: 'Wafer Pre-clean', desc: 'HF dip removes native oxide; RCA clean ensures pristine silicon surface' },
        { step: 'Furnace Load', desc: 'Boat of 25-100 wafers loaded into horizontal/vertical quartz furnace' },
        { step: 'Ramp to Temperature', desc: 'Controlled ramp at 5-10°C/min to target 900-1100°C' },
        { step: 'Oxidation Cycle', desc: 'O₂ (dry) or H₂O (wet) flow controlled for target thickness' },
        { step: 'Anneal', desc: 'N₂ ambient anneal reduces interface states and stress' },
        { step: 'Cool Down', desc: 'Controlled cool at 3-5°C/min to prevent slip dislocations' },
        { step: 'Thickness Measurement', desc: 'Ellipsometry verifies thickness and uniformity across wafer' },
      ],
      inspectionTools: ['ellipsometer', 'xrd', 'dopant-profiler', 'optical-wafer-inspection'],
      companies: [],
      companyDetails: [
        { name: 'KLA Corporation', country: 'USA', role: 'Ellipsometry systems for oxide thickness and uniformity measurement (Arachnid, Spectra FX).' },
        { name: 'Nova Ltd.', country: 'Israel', role: 'Integrated process control for oxide thickness using OCD and X-ray metrology.' },
        { name: 'Thermo Fisher Scientific', country: 'USA', role: 'XRD/XRF systems for oxide composition and film quality analysis.' },
        { name: 'Shin-Etsu Chemical', country: 'Japan', role: 'Oxidation chemicals and furnace components.' },
      ]
    },

    {
      id: 'photolithography',
      slug: 'photolithography',
      stepNumber: '03',
      title: 'Photolithography',
      shortDesc: 'Printing nanoscale circuit blueprints onto the wafer using light — the most critical process step.',
      image: 'real_photolitho_1779418591399.png',
      color: '#a855f7',
      overview: 'Photolithography is the patterning engine of semiconductor manufacturing — the step that determines how small transistors can be made and defines the performance of every chip. It transfers the circuit design from a quartz photomask onto the wafer\'s photoresist coating using light. Modern EUV (Extreme Ultraviolet) lithography at 13.5 nm wavelength enables features smaller than 5 nm. A single chip requires 50-100 separate lithography exposures, each aligned to the previous with sub-nanometer accuracy.',
      technicalDetail: `PHOTORESIST COATING: Spin coating deposits 50-200 nm thick photoresist at 1,000-6,000 rpm. Uniformity ±0.5 nm. Soft bake 85-115°C removes solvent. Chemically amplified resists (CAR) amplify pattern contrast.

ALIGNMENT & EXPOSURE: Scanner moves wafer to each die position. Alignment marks measured using wafer alignment sensors. Global and local alignment corrections applied. EUV exposure at 13.5 nm wavelength from tin plasma source (Sn→EUV at 13.5nm). DUV at 193 nm ArF excimer laser with liquid immersion (water, n=1.44) for NA up to 1.35.

RESOLUTION: R = k₁ × λ/NA where k₁=0.25-0.35, λ=wavelength, NA=numerical aperture. EUV at NA=0.33 achieves <13 nm half-pitch. High-NA EUV (NA=0.55) targets <8 nm.

POST-EXPOSURE BAKE (PEB): 80-130°C bake drives acid-catalyzed deprotection reaction in CAR resists. Critical for CD uniformity.

DEVELOPMENT: Aqueous TMAH developer (0.26N) dissolves exposed (positive resist) or unexposed (negative) regions. Development time 20-60 seconds. CD determined at this step.

INSPECTION: After litho, CD-SEM measures feature widths; overlay metrology checks layer-to-layer alignment. Defect inspection with optical or e-beam systems.`,
      processFlow: [
        { step: 'HMDS Priming', desc: 'Hexamethyldisilazane promotes photoresist adhesion to wafer' },
        { step: 'Spin Coat Resist', desc: '50-200 nm photoresist at 1,000-6,000 RPM, ±0.5 nm uniformity' },
        { step: 'Soft Bake', desc: '85-115°C removes residual solvent, improves adhesion' },
        { step: 'Wafer Alignment', desc: 'Overlay marks measured, <0.3 nm alignment correction applied' },
        { step: 'EUV/DUV Exposure', desc: 'Light projects mask pattern through lens onto resist' },
        { step: 'Post-Exposure Bake', desc: '80-130°C drives acid-catalyzed deprotection in CAR resist' },
        { step: 'TMAH Development', desc: '0.26N developer dissolves exposed resist regions, 20-60s' },
        { step: 'CD-SEM Inspection', desc: 'Measure feature widths, overlay, defects; disposition wafer' },
      ],
      inspectionTools: ['cd-sem', 'overlay-sem', 'optical-wafer-inspection', 'ebeam-inspection'],
      companies: [],
      companyDetails: [
        { name: 'ASML Holding', country: 'Netherlands', role: 'Sole supplier of EUV scanners (TWINSCAN NXE/EXE). Also supplies DUV immersion scanners. Market cap >$260B.' },
        { name: 'KLA Corporation', country: 'USA', role: 'CD-SEM, overlay metrology (ARCHER), and reticle inspection systems used after every litho step.' },
        { name: 'Applied Materials', country: 'USA', role: 'VeritySEM CD-SEM systems and photoresist process tools.' },
        { name: 'Tokyo Electron', country: 'Japan', role: 'Lithius Pro coater/developer systems — coats and develops resist on the wafer.' },
        { name: 'Shin-Etsu Chemical', country: 'Japan', role: 'Photoresist materials (ArF, EUV) and photomask blanks.' },
        { name: 'JSR Corporation', country: 'Japan', role: 'Photoresists and resist additives for DUV and EUV processes.' },
      ]
    },

    {
      id: 'etching',
      slug: 'etching',
      stepNumber: '04',
      title: 'Etching',
      shortDesc: 'Precisely carving nanoscale 3D structures using plasma chemistry — chemistry meets physics.',
      image: 'real_etching_1779418641999.png',
      color: '#ef4444',
      overview: 'Etching selectively removes material in areas not protected by photoresist or hard mask, transferring the lithographic pattern into the underlying material. It is one of the most complex processes in semiconductor manufacturing — etching must be highly selective (removing target material but not the mask or adjacent layers), highly anisotropic (vertical sidewalls, not undercut), and extremely repeatable. Modern plasma etching achieves feature aspect ratios >50:1 for 3D NAND and <1nm sidewall roughness.',
      technicalDetail: `WET ETCHING: Chemical solutions dissolve material isotropically. Silicon: KOH, TMAH, or HF. Rate 1-10 μm/min. Oxide: HF or NH₄F. Rate 0.01-0.1 μm/min. Metal: H₃PO₄/HNO₃/CH₃COOH for Al. Used for: blanket removal, substrate cleaning, MEMS release.

REACTIVE ION ETCHING (RIE): RF energy (13.56 MHz) creates plasma from SF₆, Cl₂, CF₄. Both chemical (radicals) and physical (ion bombardment) removal. Pressure 10-100 mTorr. RF power 50-2000W. Anisotropic with near-vertical sidewalls. Rate 0.1-1 μm/min.

INDUCTIVELY COUPLED PLASMA (ICP): RF coil generates high-density plasma (10¹¹-10¹² /cm³). Separate bias RF controls ion energy independently. Rate 1-10 μm/min. Excellent uniformity, selectivity >100:1 for silicon vs. oxide.

DEEP RIE (DRIE) BOSCH PROCESS: Alternating etch (SF₆, 5-8 seconds) and passivation (C₄F₈, 2-5 seconds) cycles. Creates >50:1 aspect ratio features. Sidewall scalloping <50 nm. Used for TSVs and MEMS structures.

ATOMIC LAYER ETCHING (ALE): Self-limiting etch removes exactly one monolayer per cycle. Enables <1 nm etch depth control for gate recess and precise fin height trimming.

KEY PARAMETERS: Selectivity (etch rate ratio target/mask), Anisotropy (vertical/horizontal etch rate), Uniformity (±3% across 300mm wafer), Profile angle (88-90° for vertical features).`,
      processFlow: [
        { step: 'Mask Preparation', desc: 'Photoresist or hard mask (SiO₂/SiN) defines pattern on target layer' },
        { step: 'Plasma Strike', desc: 'RF power ignites process gas into plasma state (SF₆, Cl₂, CF₄)' },
        { step: 'Chemical Etch', desc: 'Reactive radicals (F*, Cl*) chemically react with target material' },
        { step: 'Physical Etch', desc: 'Ion bombardment provides directional anisotropy for vertical walls' },
        { step: 'Endpoint Detection', desc: 'OES monitors plasma emission to detect target layer consumption' },
        { step: 'Overetch', desc: 'Controlled 10-30% overetch ensures complete pattern transfer' },
        { step: 'Resist Strip', desc: 'O₂ plasma ash removes photoresist; wet clean removes residue' },
        { step: 'Profile Inspection', desc: 'CD-SEM and cross-section verify sidewall angle and depth' },
      ],
      inspectionTools: ['cd-sem', 'optical-wafer-inspection', 'ebeam-inspection', 'profilometer'],
      companies: [],
      companyDetails: [
        { name: 'Lam Research', country: 'USA', role: 'Plasma etch market leader. Kiyo etch system for conductor etch; Flex for dielectric etch.' },
        { name: 'Applied Materials', country: 'USA', role: 'Centris etch platforms; key supplier for conductor and dielectric etch processes.' },
        { name: 'Tokyo Electron', country: 'Japan', role: 'Etch equipment including the Tactras and Certas platforms.' },
        { name: 'KLA Corporation', country: 'USA', role: 'Optical and e-beam inspection after etch steps for defect detection.' },
        { name: 'Plasma-Therm', country: 'USA', role: 'Specialized etch tools for compound semiconductors, MEMS, and R&D.' },
      ]
    },

    {
      id: 'ion-implantation',
      slug: 'ion-implantation',
      stepNumber: '05',
      title: 'Ion Implantation',
      shortDesc: 'Firing dopant ions at near-light-speed deep into silicon to engineer electrical properties.',
      image: 'real_ion_implant_1779418669250.png',
      color: '#f97316',
      overview: 'Ion implantation is the process that creates the active regions of transistors by introducing carefully controlled amounts of dopant atoms (boron, phosphorus, arsenic, indium) into specific regions of the silicon substrate. Unlike thermal diffusion, implantation provides precise control over dopant dose (10¹² to 10¹⁶ atoms/cm²) and depth profile by adjusting beam energy (10 to 500 keV). It is used to form source/drain regions, wells, halos, threshold voltage adjust implants, and channel stop implants — typically 20+ separate implant steps per chip.',
      technicalDetail: `ION SOURCE: Dopant gas (BF₃, PH₃, AsH₃) is ionized by electron bombardment or gas field ionization. Extraction voltage 5-40 kV. Ion current 1-100 mA (high current) or 1-100 μA (high energy).

MASS ANALYSIS: Magnetic sector filter separates ions by mass/charge ratio. Only target ion (¹¹B⁺, ³¹P⁺, ⁷⁵As⁺) passes to acceleration column. Prevents implanting wrong species.

ACCELERATION: Ions accelerated through 10-500 kV potential. Energy determines penetration depth (projected range Rp). Boron 30 keV → Rp ≈ 100 nm; Arsenic 100 keV → Rp ≈ 70 nm.

BEAM SCANNING: Electrostatic (x) and magnetic (y) scanning ensures uniform dose across 300mm wafer. Uniformity ±0.5%. Dose measured by Faraday cup current integration.

CHANNELING: Crystal planes create channels where ions travel deeper. Tilting wafer 7° prevents channeling. Amorphizing pre-implant with Si or Ge fills channels.

POST-IMPLANT ANNEALING: Implant creates lattice damage (amorphous layer at high dose). Anneal restores crystal structure: RTA 900-1,100°C 10-60 sec (minimal diffusion); Spike anneal <1 sec; Laser anneal <1 ms (no diffusion). Dopant activation >95% at optimized conditions.`,
      processFlow: [
        { step: 'Photoresist Masking', desc: 'Thick resist (1-3 μm) blocks implant in protected regions' },
        { step: 'Ion Generation', desc: 'Gas ionized in arc/electron bombardment source' },
        { step: 'Mass Analysis', desc: 'Magnetic filter selects only target isotope' },
        { step: 'Beam Acceleration', desc: '10-500 keV acceleration sets implant depth' },
        { step: 'Beam Scan', desc: 'Electrostatic/magnetic scan delivers uniform dose across wafer' },
        { step: 'Dose Monitoring', desc: 'Faraday cup integrates beam current; target ±0.5% dose uniformity' },
        { step: 'Resist Strip', desc: 'Plasma ash + wet clean removes implanted resist residue' },
        { step: 'RTA Anneal', desc: '900-1,100°C for 10-60 sec activates dopants, repairs damage' },
      ],
      inspectionTools: ['dopant-profiler', 'xrd', 'ellipsometer', 'optical-wafer-inspection'],
      companies: [],
      companyDetails: [
        { name: 'Axcelis Technologies', country: 'USA', role: 'Purion family — dedicated ion implant systems for high-current, high-energy, and medium-current applications.' },
        { name: 'Applied Materials', country: 'USA', role: 'VIISta implant systems for high-energy and medium-current applications.' },
        { name: 'Varian (now Applied Materials)', country: 'USA', role: 'Legacy ion implant systems, now integrated into Applied Materials portfolio.' },
        { name: 'Thermo Fisher Scientific', country: 'USA', role: 'SIMS analysis tools for dopant depth profiling and dose verification.' },
      ]
    },

    {
      id: 'thin-film-deposition',
      slug: 'thin-film-deposition',
      stepNumber: '06',
      title: 'Thin Film Deposition',
      shortDesc: 'Growing perfect crystalline and amorphous material layers, one atom at a time.',
      image: 'real_deposition_1779418616958.png',
      color: '#22c55e',
      overview: 'Thin film deposition adds new material layers with precise thickness, composition, and electrical properties. It encompasses multiple techniques: PVD (physical vapor deposition) for metals, CVD (chemical vapor deposition) for dielectrics and polysilicon, PECVD for lower-temperature dielectrics, and ALD (atomic layer deposition) for ultra-thin high-k gate dielectrics. Modern transistors contain 10+ material layers, each deposited to atomic precision. ALD can deposit a single monolayer per cycle, enabling <1 nm films with perfect conformality on high-aspect-ratio features.',
      technicalDetail: `PVD (SPUTTERING): Target material bombarded by high-energy Ar⁺ ions (500-1000V bias). Atoms ejected and deposit on wafer. Materials: Al, Cu, Ti, TiN, W, CoWP. Rate 1-100 nm/min at 200-400°C. Excellent metal deposition but poor step coverage in high-AR features.

CVD: Gas-phase precursors react on heated wafer surface. Types: LPCVD (300-900°C, best uniformity), APCVD (atmospheric, fast), SACVD (subatmospheric). Materials: Poly-Si, SiO₂ (TEOS), Si₃N₄, W, TiN. Rate 10-1000 nm/min. Excellent conformality and step coverage.

PECVD: Plasma at 200-400°C enhances reactions without high thermal budget. Materials: SiO₂, Si₃N₄, SiC:H (low-k). Rate 50-500 nm/min. Used for inter-layer dielectrics (ILD) and passivation.

ALD: Two self-limiting half-reactions per cycle. Precursor A pulse → purge → Precursor B pulse → purge. One monolayer per cycle (0.1-0.5 Å/cycle). Materials: HfO₂ (gate dielectric), Al₂O₃ (barrier), TiN, Ru. Perfect conformality in <1nm features. Temperature: 100-400°C.

EPI (EPITAXIAL GROWTH): CVD or MBE grows single-crystal silicon or SiGe on single-crystal silicon substrate. Used for strained Si for higher mobility, SiGe source/drain for FinFET, and III-V compound semiconductors. RPCVD (reduced pressure CVD) at 600-1,000°C.`,
      processFlow: [
        { step: 'Surface Preparation', desc: 'HF clean removes native oxide; wafer temperature set to target' },
        { step: 'Chamber Conditioning', desc: 'Seasoning deposition stabilizes chamber walls and plasma' },
        { step: 'Precursor Flow', desc: 'Gas or metal target provides material source (CVD/PVD/ALD)' },
        { step: 'Deposition Cycle', desc: 'Film grows at target rate; ALD uses sequential half-reactions' },
        { step: 'In-situ Monitoring', desc: 'Quartz crystal microbalance or interferometry monitors thickness' },
        { step: 'Post-Dep Anneal', desc: 'Optional anneal improves film density, stress, and composition' },
        { step: 'Thickness Measurement', desc: 'Ellipsometry, XRR, or XRF measures thickness, density, composition' },
        { step: 'Uniformity Check', dest: '49-point or 121-point wafer map verifies ±1% uniformity' },
      ],
      inspectionTools: ['ellipsometer', 'xrd', 'profilometer', 'optical-wafer-inspection'],
      companies: [],
      companyDetails: [
        { name: 'Applied Materials', country: 'USA', role: 'Centura PVD, Producer CVD/ALD — largest equipment supplier for deposition processes.' },
        { name: 'Lam Research', country: 'USA', role: 'SPEED, Vector, Syndion CVD/ALD/EPI systems; Altus W CVD for tungsten fill.' },
        { name: 'ASM International', country: 'Netherlands', role: 'ALD equipment specialist — Pulsar ALD, Epoch PECVD. Major supplier for high-k gate dielectric ALD.' },
        { name: 'Tokyo Electron', country: 'Japan', role: 'PVD, CVD, and ALD systems including Triase, Probus, and Trias platforms.' },
        { name: 'Aixtron', country: 'Germany', role: 'MOVPE/MOCVD systems for compound semiconductor (GaN, InP, GaAs) deposition.' },
      ]
    },

    {
      id: 'cmp',
      slug: 'cmp',
      stepNumber: '07',
      title: 'Chemical Mechanical Planarization',
      shortDesc: 'Polishing the wafer to atomic flatness — essential for stacking 12+ metal layers.',
      image: null,
      color: '#eab308',
      overview: 'Chemical Mechanical Planarization (CMP) is the process of achieving global planarization of the wafer surface between fabrication layers. As transistors and metal interconnect layers are added, the surface topography becomes increasingly non-flat. CMP uses a combination of chemical slurry (that softens or reacts with the material) and mechanical abrasion (from a polishing pad) to selectively remove high points and create a globally flat surface. Without CMP, depth-of-focus limitations in lithography would prevent successful patterning of upper layers.',
      technicalDetail: `PROCESS MECHANISM: Wafer is held face-down against a rotating polishing pad (polyurethane). Slurry flows between wafer and pad containing: abrasive particles (Al₂O₃, SiO₂, CeO₂, 50-300 nm), chemical additives (oxidizers, complexing agents, pH buffers), and DI water. Chemical softening + mechanical abrasion removes material from high spots preferentially.

COPPER CMP: Two-step process — (1) bulk copper removal with H₂O₂/BTA slurry, then (2) barrier removal (TaN/Ta). Dishing <10 nm in 100 μm copper features. Erosion <5 nm in dense pattern areas. Selectivity Cu:TaN:SiO₂ = 100:100:1.

OXIDE/STI CMP: Ceria (CeO₂) slurry with high planarization efficiency. Removal rate 100-500 nm/min. Within-wafer non-uniformity (WIWNU) <3%. Stop on nitride with >100:1 selectivity.

POLISHING PARAMETERS: Platen rotation 30-150 rpm. Carrier rotation 30-150 rpm. Down pressure 1-5 psi. Slurry flow 150-300 mL/min. Temperature 20-40°C. Pad conditioning with diamond disk between wafers.

ENDPOINT DETECTION: In-situ optical interferometry detects film thickness in real time. Motor current change detects stop-layer. Spectral reflectometry achieves ±1 nm end-point control.

POST-CMP: Brush scrub cleaning removes slurry particles. Megasonic clean in dilute HF. Surface inspection by optical scanner for scratch, residue, and dishing defects.`,
      processFlow: [
        { step: 'Slurry Preparation', desc: 'Abrasive + chemical slurry formulated for target material' },
        { step: 'Pad Conditioning', desc: 'Diamond disc conditions pad surface for fresh asperity' },
        { step: 'Wafer Loading', desc: 'Carrier holds wafer face-down with controlled backpressure zones' },
        { step: 'Polish Cycle', desc: 'Chemical + mechanical removal at 1-5 psi, 50-150 rpm' },
        { step: 'Endpoint Detect', desc: 'In-situ interferometry detects target thickness; motor Δ for stop layer' },
        { step: 'Rinse & Unload', desc: 'DI water rinse prevents slurry drying and particle adhesion' },
        { step: 'Post-CMP Clean', desc: 'Brush scrub + megasonic removes particles and slurry residue' },
        { step: 'Planarity Inspection', desc: 'Profilometer and optical scanner verify flatness and defects' },
      ],
      inspectionTools: ['profilometer', 'ellipsometer', 'optical-wafer-inspection', 'ebeam-inspection'],
      companies: [],
      companyDetails: [
        { name: 'Applied Materials', country: 'USA', role: 'Reflexion LK Prime CMP — industry-leading multi-head CMP system for copper and dielectric planarization.' },
        { name: 'Ebara Corporation', country: 'Japan', role: 'CMP systems and polishing slurry dispensing. Supplies TSMC and Samsung fabs.' },
        { name: 'KLA Corporation', country: 'USA', role: 'Post-CMP inspection and profilometry tools including the Surfscan and P-series systems.' },
        { name: 'CMC Materials (Cabot)', country: 'USA', role: 'CMP slurries and polishing pads — critical consumables for copper and oxide CMP.' },
        { name: 'Entegris', country: 'USA', role: 'CMP pads, slurry dispensing systems, and process chemicals.' },
      ]
    },

    {
      id: 'metallization',
      slug: 'metallization',
      stepNumber: '08',
      title: 'Metallization & Interconnects',
      shortDesc: 'Wiring billions of transistors together with copper — 12 layers of nanoscale highways.',
      image: 'real_metrology_1779418693534.png',
      color: '#f59e0b',
      overview: 'Metallization creates the electrical wiring network that connects all transistors in an integrated circuit. Modern chips have 10-12 copper metal layers (interconnects) separated by insulating low-k dielectrics. These interconnects carry signals and power throughout the chip. The interconnect system is built using the dual damascene process — etching trenches and vias in the dielectric, then filling with copper and planarizing with CMP. Interconnect delay is now a greater performance limiter than transistor switching speed in advanced chips.',
      technicalDetail: `INTERCONNECT LAYERS: Local Interconnect (M0) above transistors — tungsten, 40-50nm pitch. Metal 1-2 (M1-M2) — copper, 50-90nm pitch, 30-50nm thick. Metal 3-8 — copper, 100-300nm pitch, 100-200nm thick. Upper metals (M9+) — power distribution, 500nm-several μm pitch, 200-500nm thick.

DUAL DAMASCENE PROCESS: (1) Deposit low-k dielectric (k=2.4-3.5) by CVD/PECVD. (2) Pattern via and trench by photolithography + etch. (3) Deposit barrier layer: TaN (prevents Cu diffusion) + Ta by PVD. (4) ALD TaN seed layer. (5) Cu ECP fill — electrolyte CuSO₄ + H₂SO₄ + additives. Current density 0.2-2 A/dm². Rate 0.5-1.5 μm/min. (6) Anneal 200-400°C to improve Cu grain size. (7) CMP removes overburden.

COPPER ECP: Superfilling — additives (suppressor, accelerator, leveler) create bottom-up fill of narrow trenches without voids. Filling trenches as small as 7 nm without seam or void.

LOW-k DIELECTRICS: Fluorinated silicate glass (FSG, k=3.5); Black Diamond (k=2.7); Extreme low-k (k<2.4 porous dielectric). Lower k reduces RC delay but increases mechanical fragility.

RESISTANCE TARGETS: Via resistance <10 Ω. Line resistance per unit length: M1 8-20 Ω/μm. Electromigration lifetime >10 years at 105°C.`,
      processFlow: [
        { step: 'Dielectric Deposition', desc: 'Low-k CVD dielectric (k=2.4-3.5) deposited 50-500 nm thick' },
        { step: 'Via Lithography', desc: 'Photoresist patterned for vertical connections between layers' },
        { step: 'Via Etch', desc: 'Plasma etch creates vertical vias (20-100nm) with 4:1-10:1 AR' },
        { step: 'Trench Litho & Etch', desc: 'Second exposure defines metal trenches; dual-damascene combined etch' },
        { step: 'Barrier Deposition', desc: 'PVD TaN/Ta prevents Cu diffusion into dielectric; ALD TaN seed' },
        { step: 'Copper ECP', desc: 'Bottom-up Cu electroplating fills trenches/vias without voids' },
        { step: 'Cu Anneal', desc: '200-400°C improves grain size, reduces resistance, relieves stress' },
        { step: 'Copper CMP', desc: 'Removes Cu overburden; barrier CMP achieves <50nm final flatness' },
      ],
      inspectionTools: ['optical-wafer-inspection', 'ebeam-inspection', 'profilometer', 'cd-sem'],
      companies: [],
      companyDetails: [
        { name: 'Applied Materials', country: 'USA', role: 'PVD (Endura), CVD dielectric (Producer), CMP (Reflexion), and ECP (Raider) systems for full interconnect flow.' },
        { name: 'Lam Research', country: 'USA', role: 'Dielectric etch (Flex), CVD (VECTOR), and ECP (Saber) systems for dual damascene interconnects.' },
        { name: 'Tokyo Electron', country: 'Japan', role: 'PECVD and PVD tools for dielectric and barrier layer deposition.' },
        { name: 'Cabot Microelectronics', country: 'USA', role: 'CMP slurries and pads for copper and barrier removal in interconnect CMP.' },
        { name: 'Entegris', country: 'USA', role: 'Dielectric precursor chemicals for CVD low-k films.' },
      ]
    },

    {
      id: 'wafer-inspection',
      slug: 'wafer-inspection',
      stepNumber: '09',
      title: 'Wafer Inspection & Metrology',
      shortDesc: 'Hunting nanoscale defects across hundreds of square centimeters — zero tolerance at scale.',
      image: 'real_metrology_1779418693534.png',
      color: '#06b6d4',
      overview: 'Wafer inspection and metrology is the quality control backbone of semiconductor manufacturing. Performed after every critical process step, inspection finds defects (particles, scratches, pattern defects, voids) while metrology measures process parameters (CD, overlay, film thickness). A modern fab performs 800-1,200 inspection and metrology steps per wafer. KLA Corporation dominates this market, providing >70% of process control equipment. Without comprehensive inspection, yield falls and defective chips reach customers.',
      technicalDetail: `OPTICAL INSPECTION: Brightfield (pattern defects) and darkfield (particles, scratches) modes. KLA Puma 9000: 193 nm illumination, 30-40 nm PSL sensitivity. Die-to-die comparison algorithm finds pattern anomalies. Throughput 30-100 wafers/hour.

E-BEAM INSPECTION: KLA eDR-7000 / CIRCL-8: 1-3 keV beam, <5nm resolution. Voltage contrast detects open/short circuits electrically without contacting. Captures buried defects missed by optical. Throughput 0.5-5 wafers/hour — used for sampling, not 100% inspection.

CD-SEM METROLOGY: Measures feature widths at specific sites (200-1000 per wafer). Hitachi CG7000, Applied VeritySEM: <1nm accuracy. Maps CD variation across wafer → feedback to lithography scanner.

OVERLAY METROLOGY: KLA ARCHER, ASML YieldStar: DBO (diffraction-based) or IBO (image-based). Measures layer-to-layer alignment at 100-300 sites per wafer. <0.3nm 3σ accuracy. APC (advanced process control) feedback closes loop to scanner.

FILM THICKNESS: KLA SpectraFx, Nova Prism: Spectroscopic ellipsometry at 200+ wafer sites per wafer. ±0.1 nm accuracy. OCD (optical CD) measures 3D profile of patterned features.

DEFECT REVIEW: After inspection, defect coordinates loaded into review SEM (KLA eDR, Applied SEMVision). Classifies defect type: killer vs. nuisance, particle vs. pattern. Informs process optimization.`,
      processFlow: [
        { step: 'Inspection Plan', desc: 'Recipe defines sites, modes, sensitivity based on yield risk' },
        { step: 'Optical Scan', desc: 'Laser or broadband light scans wafer at 30-100 wph' },
        { step: 'E-Beam Scan', desc: 'High-sensitivity electron beam samples critical locations' },
        { step: 'CD Measurement', desc: 'SEM measures 200-1000 critical dimension sites per wafer' },
        { step: 'Overlay Measurement', desc: 'Optical system measures 100-300 overlay sites per wafer' },
        { step: 'Defect Review', desc: 'Review SEM classifies defect type at each flagged location' },
        { step: 'Data Analysis', desc: 'Statistical process control (SPC) charts monitor trends' },
        { step: 'APC Feedback', desc: 'Automated corrections sent to scanner, etch, and deposition tools' },
      ],
      inspectionTools: ['optical-wafer-inspection', 'ebeam-inspection', 'cd-sem', 'overlay-sem', 'ellipsometer'],
      companies: [],
      companyDetails: [
        { name: 'KLA Corporation', country: 'USA', role: 'Dominant inspection/metrology supplier. Puma optical, eDR e-beam, ARCHER overlay, SpectraFx film thickness, P-series profilometry.' },
        { name: 'Applied Materials', country: 'USA', role: 'SEMVision defect review, VeritySEM CD-SEM systems for pattern measurement.' },
        { name: 'ASML', country: 'Netherlands', role: 'YieldStar overlay metrology system for after-exposure measurement.' },
        { name: 'Hitachi High-Tech', country: 'Japan', role: 'CG7000 CD-SEM series, LS-series surface inspection, and defect review SEMs.' },
        { name: 'Onto Innovation', country: 'USA', role: 'Iris series overlay metrology, Atlas film thickness systems.' },
        { name: 'Nova Ltd.', country: 'Israel', role: 'OCD metrology, X-ray metrology, and integrated process control.' },
      ]
    },

    {
      id: 'die-testing',
      slug: 'die-testing',
      stepNumber: '10',
      title: 'Electrical Die Testing (EDS)',
      shortDesc: 'Probing each die with thousands of test patterns to sort working chips from defective ones.',
      image: null,
      color: '#8b5cf6',
      overview: 'Electrical Die Sorting (EDS) tests every individual die on the wafer before it is cut and packaged. Using automated test equipment (ATE) with a probe card contacting each die\'s bond pads, the system applies test stimuli and measures electrical responses against specifications. Dies passing all tests are marked for packaging; failing dies are marked for scrap. This prevents expensive packaging of defective dies. Modern EDS achieves 50-95% yield on mature processes, with wafer maps tracking each die\'s pass/fail status and speed bin.',
      technicalDetail: `ATE SYSTEMS: Pin electronics provide driver/sensor circuits for each I/O pin. Tester channels: 512 to 8,192. Test time per die 1-100 seconds. Temperature range -40 to +150°C. Voltage range 0.5-5.5V. Frequency up to 40 GHz for RF devices.

PROBE CARDS: 100 to 10,000+ individual probe needles. Tungsten or beryllium-copper probes. Needle spacing 80-200 μm (matching die bond pad pitch). Contact force 10-30 g/probe. Contact resistance <1 Ω per probe. Advanced MEMS probe cards enable <30 μm pitch for advanced nodes.

DC PARAMETRIC TESTS: Supply current (Icc), output voltage levels (VOL, VOH), input threshold voltages (VIH, VIL), leakage currents (Ilkg), and resistance measurements.

AC TIMING TESTS: Clock frequency limits, setup/hold times, propagation delays (tpd), rise/fall times, and memory access times.

FUNCTIONAL TESTS: Logic pattern generation/verification using ATPG (Automatic Test Pattern Generation). Memory write/read cycles. Boundary scan (JTAG). Built-in self-test (BIST). Scan chain testing achieves >99% fault coverage.

BINNING: Pass Bin: meets all specs. Speed Bin: sorted by max frequency (e.g., 3.0 GHz, 3.2 GHz, 3.6 GHz). Voltage Bin: sorted by minimum operating voltage. Leakage Bin: for low-power premium grade. Fail: scrap.`,
      processFlow: [
        { step: 'Wafer Handling', desc: 'Robotic arm moves wafer to chuck; wafer map loaded into tester' },
        { step: 'Probe Contact', desc: 'Probe card lowered; 1,000+ pins contact each die simultaneously' },
        { step: 'DC Tests', desc: 'Supply current, voltage levels, leakage measured at multiple Vdd' },
        { step: 'AC Timing Tests', desc: 'Clock frequency, setup/hold, propagation delays verified' },
        { step: 'Functional Test', desc: 'ATPG patterns applied; BIST logic runs internal self-test' },
        { step: 'Temperature Stress', desc: 'Hot/cold testing at -40°C to +125°C verifies thermal margins' },
        { step: 'Binning', desc: 'Each die assigned to pass/speed/voltage/fail bin' },
        { step: 'Wafer Map', desc: 'Pass/fail map recorded; ink-marked failing dies before dicing' },
      ],
      inspectionTools: ['ebeam-inspection', 'optical-wafer-inspection', 'aoi'],
      companies: [],
      companyDetails: [
        { name: 'Advantest', country: 'Japan', role: 'T2000/V93000 ATE systems — leading tester for logic, memory, and SoC applications.' },
        { name: 'Teradyne', country: 'USA', role: 'UltraFLEX, Magnum ATE platforms for SoC, DRAM, and Flash testing.' },
        { name: 'FormFactor', country: 'USA', role: 'Probe cards and wafer probe systems for EDS testing.' },
        { name: 'MPI Corporation', country: 'Taiwan', role: 'Probe stations and wafer-level test systems for RF and power devices.' },
        { name: 'Verigy (now Advantest)', country: 'Singapore', role: 'Legacy ATE systems integrated into Advantest portfolio.' },
      ]
    },

    {
      id: 'dicing',
      slug: 'dicing',
      stepNumber: '11',
      title: 'Dicing & Die Separation',
      shortDesc: 'Cutting the wafer into individual dies using diamond blades or laser ablation.',
      image: null,
      color: '#ec4899',
      overview: 'After EDS testing, the processed wafer is diced into individual dies (chips) along the dicing streets (scribe lines) between dies. Two main methods are used: mechanical diamond blade dicing (most common) and stealth laser dicing (for fragile or thin wafers). The diced dies are held on a dicing tape stretched across a frame until picked and placed into packages. Die size ranges from less than 1 mm² (small sensors) to over 800 mm² (high-end GPU reticle-limit dies).',
      technicalDetail: `BLADE DICING: Diamond-coated or electroplated copper blade. Blade thickness 50-150 μm. Blade speed 20,000-80,000 rpm. Feed rate 0.5-5 mm/second. Coolant: DI water or dicing fluid at 1-2 L/min. Cut depth: full wafer + 10-50 μm into tape. Cut accuracy ±10-50 μm. Kerf loss: 50-200 μm per cut. Wafer thickness 700-780 μm pre-back-grind; often thinned to 50-300 μm first.

STEALTH DICING (LASER): Laser focused inside wafer creates subsurface modified zone without surface damage. Then wafer expanded by tape stretcher to separate dies along modified planes. Kerf-free — zero silicon loss. Better die strength than blade dicing. Used for thin wafers (<100 μm) and brittle materials (SiC, GaN, GaAs).

PLASMA DICING: Deep RIE plasma etch through dicing streets after photoresist masking. Used for very small street widths (<50 μm) enabling higher die density per wafer. Die strength 2× blade dicing. Used in advanced packaging (WLCSP).

POST-DICING: UV cure or heat release tape releases dies. Die attach film (DAF) on tape for flip-chip. Vacuum collet picks individual die for placement.

DICING EQUIPMENT: DISCO Corporation (Japan) is world leader — DAD series blade dicers, DFL series laser dicers. Other suppliers: Loadpoint (UK), Dyax (USA), Advanced Dicing Technologies (Singapore).`,
      processFlow: [
        { step: 'Back Grinding', desc: 'Wafer thinned to 50-300 μm using grinding wheel + CMP' },
        { step: 'Tape Mounting', desc: 'Dicing tape + frame mounted on back of wafer for die support' },
        { step: 'Street Alignment', desc: 'Vision system aligns blade to dicing streets (kerf lines)' },
        { step: 'First Cut (X-axis)', desc: 'Diamond blade cuts through all X-direction dicing streets' },
        { step: 'Rotate & Second Cut', desc: 'Wafer rotated 90° for Y-direction cuts completing die separation' },
        { step: 'Tape Expand', desc: 'Frame expanded to increase spacing between separated dies' },
        { step: 'Die Inspection', desc: 'Vision system checks die edge quality, chipping, and cracks' },
        { step: 'Die Pick', desc: 'Vacuum collet picks individual dies from tape for placement' },
      ],
      inspectionTools: ['optical-wafer-inspection', 'aoi', 'xray-inspection'],
      companies: [],
      companyDetails: [
        { name: 'DISCO Corporation', country: 'Japan', role: 'World\'s largest dicing equipment manufacturer. DAD blade and DFL laser dicing systems. ~70% market share.' },
        { name: 'Loadpoint Limited', country: 'UK', role: 'Blade dicing systems for compound semiconductors and advanced packaging.' },
        { name: 'Dyax Technologies', country: 'USA', role: 'Precision dicing and scribing systems for specialty applications.' },
        { name: 'Advanced Dicing Technologies', country: 'Singapore', role: 'Stealth dicing and scribing equipment for thin-wafer applications.' },
      ]
    },

    {
      id: 'packaging',
      slug: 'packaging',
      stepNumber: '12',
      title: 'Packaging & Assembly',
      shortDesc: 'Mounting, wiring, and encapsulating the bare die into a robust, testable package.',
      image: 'real_chip_pkg_1779418720672.png',
      color: '#14b8a6',
      overview: 'Packaging is the final manufacturing step where individual dies are mounted, interconnected, and encapsulated into protective packages suitable for printed circuit board (PCB) assembly. The package provides electrical connections from die pads to PCB, mechanical protection from handling and environment, and thermal management to dissipate heat. Advanced packaging (chiplets, 3D stacking, fan-out wafer-level packaging) is now a key differentiator as transistor scaling slows — combining multiple chiplets in one package to achieve system-level performance gains.',
      technicalDetail: `DIE ATTACH: Mount die on substrate using epoxy adhesive (filled with Ag for thermal), solder, or flip-chip bumps. Adhesive cure: 140-180°C for 1-4 hours. Die shear strength >100 g/mm². Flip-chip: solder bump reflow at 250-280°C.

WIRE BONDING: Ultra-thin gold (17-75 μm diameter) or copper wires connect die pads to substrate leads. Thermosonic bonding: 150-250°C + ultrasonic energy (60-120 kHz) + 20-100g force. Bond pull strength >8g (gold), >12g (copper). Throughput: 10-20 wires/second. Copper wire requires N₂ purge to prevent oxidation.

FLIP CHIP: C4 (Controlled Collapse Chip Connection) bumps (25-250 μm pitch) connect die face-down to substrate. Fine-pitch micro-bumps for 3D stacking: 10-25 μm pitch. Superior electrical performance (shorter interconnects) and thermal performance vs. wire bond.

ADVANCED PACKAGING: CoWoS (TSMC) interposer-based 2.5D packaging integrates HBM memory + logic die on Si interposer. FOVEROS (Intel) 3D stacking with face-to-face die-to-die bonding at 10 μm pitch. FOWLP: dies embedded in molded panel, fan-out RDL connects die pads.

MOLDING: Epoxy molding compound (EMC) injected at 170-200°C, 400-800 psi, 30-120 sec. Post-cure 150-180°C for 2-24 hours. Protects die and wire bonds from moisture and mechanical stress.

PACKAGE TYPES: SOIC (8-28 pins), TSOP (28-100 pins), BGA (169-1000+ pins), FCBGA (flip chip BGA), WLCSP (wafer-level chip scale), MCM (multi-chip module), SiP (system-in-package).`,
      processFlow: [
        { step: 'Die Attach', desc: 'Die placed on substrate with epoxy/solder; cure at 140-180°C' },
        { step: 'Plasma Clean', desc: 'O₂/Ar plasma cleans bond pads for reliable wire bond adhesion' },
        { step: 'Wire Bonding', desc: 'Au/Cu wires thermosonically bonded at 10-20 wires/second' },
        { step: 'Flip Chip Reflow', desc: 'For flip chip: solder bump reflow at 250-280°C in N₂ ambient' },
        { step: 'Underfill Dispense', desc: 'Capillary underfill protects flip chip bumps from thermal stress' },
        { step: 'Mold Encapsulation', desc: 'EMC injected at 170-200°C, 400-800 psi; post-cure 150-180°C' },
        { step: 'Trim & Form', desc: 'Excess lead material cut; leads formed to gull-wing or J-bend shape' },
        { step: 'Marking', desc: 'Product/date codes laser-marked or ink-jet printed at 300-1200 dpi' },
      ],
      inspectionTools: ['xray-inspection', 'aoi', 'optical-wafer-inspection'],
      companies: [],
      companyDetails: [
        { name: 'Kulicke & Soffa (K&S)', country: 'USA', role: 'Wire bonding systems — IConn Pro, KATALYST; industry leader with >50% market share.' },
        { name: 'ASMPT (ASM Pacific Technology)', country: 'Hong Kong', role: 'Complete packaging solutions including die attach, wire bonding, flip chip, and FOWLP.' },
        { name: 'Besi (BE Semiconductor)', country: 'Netherlands', role: 'Die attach (FCmL flip chip, Esec), wire bonding, and molding systems.' },
        { name: 'Panasonic Factory Solutions', country: 'Japan', role: 'Molding equipment and automation for semiconductor assembly.' },
        { name: 'Nordson DAGE', country: 'USA', role: 'Bond pull/shear testers and X-ray inspection systems for package quality.' },
        { name: 'Sumitomo Bakelite', country: 'Japan', role: 'Epoxy molding compounds (EMC) — critical material for chip encapsulation.' },
      ]
    },

    {
      id: 'final-testing',
      slug: 'final-testing',
      stepNumber: '13',
      title: 'Final Testing & Reliability',
      shortDesc: 'The last line of defense — stress-testing every packaged chip before it ships to customers.',
      image: null,
      color: '#64748b',
      overview: 'Final package testing is the last quality gate before packaged chips ship to customers. Unlike EDS (which tests unpackaged dies on the wafer), final test verifies the complete assembled package including die, wire bonds/solder joints, substrate, and package interconnects under stress conditions (temperature, voltage extremes). Key screens include burn-in (accelerated thermal aging to eliminate infant mortality failures), final electrical test, and reliability qualification. Only chips passing all screens ship as Grade 1 production quality.',
      technicalDetail: `BURN-IN: Packaged devices inserted into burn-in boards. Temperature: 125-150°C. Voltage: Vdd × 1.1-1.3 (elevated stress). Duration: 24-168 hours. Eliminates early-life failures following Bathtub Curve (infant mortality phase). Burn-in boards hold 500-5,000 devices simultaneously.

FINAL ELECTRICAL TEST: Full parametric and functional test at temperature extremes (-40°C, 25°C, 125°C). All tests from EDS repeated plus package-level measurements. Contact resistance through package substrate leads/balls checked. RF characterization for wireless devices. Test time 5-300 seconds per device.

RELIABILITY QUALIFICATION: HTOL (High Temperature Operating Life) 1,000 hours at 125°C, Vdd stress. HAST (Highly Accelerated Stress Test) 130°C, 85% RH, 33 PSIG steam — 96-264 hours. TCB (Temperature Cycling, Biased) -65°C to +150°C for 1,000-2,000 cycles. ESD (Electrostatic Discharge) HBM (Human Body Model), CDM (Charged Device Model) testing. Meets JEDEC JESD22 qualification standards.

OUTGOING QUALITY CONTROL: AQL (Acceptable Quality Level) sampling. Cpk (process capability index) monitoring for all key parameters. DPPM (Defective Parts Per Million) targets: <10 DPPM for automotive, <100 DPPM for consumer.`,
      processFlow: [
        { step: 'Package Incoming', desc: 'Visual inspection of mold quality, marking, and lead/ball coplanarity' },
        { step: 'Burn-In Loading', desc: 'Devices inserted into burn-in boards; loaded into oven' },
        { step: 'Thermal Burn-In', desc: '125-150°C, elevated Vdd × 1.2 for 24-168 hours' },
        { step: 'Final Electrical Test', desc: 'Full functional + parametric test at -40°C, 25°C, 125°C' },
        { step: 'Reliability Stress', desc: 'HAST, HTOL, TCB stress on sample lots per JEDEC JESD22' },
        { step: 'AOI & X-Ray', desc: 'Visual and X-ray inspection of solder balls and wire bonds' },
        { step: 'Tape & Reel', desc: 'Passing devices loaded into carrier tape and reeled for SMT' },
        { step: 'Traceability', desc: 'Lot traceability code recorded linking chip to wafer, test, and QC data' },
      ],
      inspectionTools: ['aoi', 'xray-inspection', 'optical-wafer-inspection'],
      companies: [],
      companyDetails: [
        { name: 'Advantest', country: 'Japan', role: 'T2000, V93000, T5700 series ATE — leading packaged device testers for logic, memory, SoC.' },
        { name: 'Teradyne', country: 'USA', role: 'UltraFLEX platform for final test of high-speed SoC and network processors.' },
        { name: 'Cohu', country: 'USA', role: 'Handler systems and ATE for final test of automotive and consumer ICs.' },
        { name: 'Nordson DAGE', country: 'USA', role: 'Bond pull/shear, X-ray, and acoustic microscopy for package reliability testing.' },
        { name: 'Multitest (now Cohu)', country: 'Germany', role: 'Test handlers for final package test including gravity-feed and strip handlers.' },
      ]
    },
  ]
};
