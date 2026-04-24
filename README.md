# Albacete MedDev — Website

Production source for **albacetemeddev.com**.

A static site (HTML / CSS / JS, no build step) for Albacete MedDev — advanced wound care solutions for clinical practices, surgical groups, and healthcare organizations.

## Structure

```
/
├── index.html                      # Homepage
├── about/                          # About page
├── consulting/                     # Consultative services
├── contact/                        # Contact form
├── legal-guidance/                 # In-house medical-legal counsel
├── portal/                         # Provider portal landing
├── revenue-cycle/                  # Revenue cycle management (AcuityMD partnership)
├── scientific-portfolio/           # Clinical science & evidence base
├── why-partner/                    # Partnership overview
├── products/
│   ├── index.html                  # Portfolio landing
│   ├── actigraft/                  # ActiGraft+ whole blood clot
│   ├── adhesion-barrier/           # Dual-layer amniotic adhesion barrier
│   ├── advanced-biologics/         # BioLab Sciences amniotic allografts
│   ├── collagen/                   # Collagen Program
│   ├── exosomes/                   # Exosomes & birth tissue
│   ├── microdoc/                   # MicroDoc NPWT
│   ├── ultramist/                  # UltraMist low-frequency ultrasound
│   └── wholesaler/                 # Medical supplies wholesale distribution
└── assets/
    ├── css/styles.css              # Global design system + components
    ├── js/app.js                   # Splash, nav, reveals, FAQ, mobile menu
    └── images/                     # Product photography (transparent PNGs)
```

## Local preview

```bash
# From the repo root
python3 -m http.server 4321
# Then open http://localhost:4321/
```

No build step. Edit HTML/CSS/JS directly and refresh.

## Deployment

Hosted on **Cloudflare Pages** with GitHub auto-deploy on push to `main`.

## Design system

- **Palette** — Navy `#0f1322` (ink), warm gold `#d4a94a`, snow, fog, mist
- **Typography** — Sora (display) / DM Sans (body) / JetBrains Mono (code)
- **Cache-busting** — `?v=N` query string on `styles.css` and `app.js` — bump after CSS/JS changes

## Editing conventions

- Nav + footer are duplicated in every page (no templating). When adding a new section page, propagate the desktop dropdown, mobile submenu, and footer links across all pages.
- Each product page follows the same hero → problem → mechanism → workflow → coding/coverage → FAQ → CTA rhythm.
- Scroll-reveal animations use the `.scroll-reveal` class + optional `data-stagger` attribute.

---

© Albacete MedDev — advanced wound care solutions.
