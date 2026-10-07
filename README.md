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

## October 2026 physician experience

The homepage uses an ivory reading surface with navy and gold accents, real product imagery, and direct paths to the existing portfolio, evidence library, and practice services. `assets/css/physician.css` contains the shared readability and responsive refinements. `assets/js/physician.js` progressively enhances catalog and evidence filtering and keyboard accessibility.

- The 15 live portfolio entries are preserved. The evidence library covers a broader set of research entries.
- Evidence explanations and full source titles are available in native disclosures. Existing study summaries and grades are not a new literature review.
- Page-opening videos, decorative particles, animated metrics, and moving buttons are removed from the browsing experience.
- The contact form prepares a `mailto:` message for the visitor to review and send. It does not submit to a server.
- Clinical resources navigation is duplicated across the public HTML pages; `_shared/nav.html` holds the same markup.
- Run `node --check assets/js/app.js`, `node --check assets/js/physician.js`, and `node --test tests/services-brief.test.cjs` before publishing.
