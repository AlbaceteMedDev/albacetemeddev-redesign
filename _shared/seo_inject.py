#!/usr/bin/env python3
"""Inject per-page SEO: title, meta description, canonical, OG/Twitter, JSON-LD.
Idempotent: replaces the favicon→twitter block and any prior JSON-LD it injected.
Run from repo root:  python3 _shared/seo_inject.py
"""
import json, os, re, sys

BASE = "https://albacetemeddev-redesign.pages.dev"
ORG_ID = BASE + "/#organization"

ORG = {
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Albacete MedDev",
    "url": BASE + "/",
    "logo": BASE + "/assets/img/favicon-512.png",
    "image": BASE + "/assets/img/og-image.png",
    "description": "Medical device distribution and practice operations partner — advanced wound care products, compliance, revenue cycle, and legal support for specialty practices.",
    "telephone": "+1-551-497-3428",
    "email": "gabe@albacetemeddev.com",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-551-497-3428",
        "email": "gabe@albacetemeddev.com",
        "contactType": "sales",
        "areaServed": "US",
    },
}

def crumbs(*items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + p}
            for i, (n, p) in enumerate(items)
        ],
    }

def product(name, desc, path, manufacturer=None):
    p = {
        "@type": "Product",
        "name": name,
        "description": desc,
        "url": BASE + path,
        "brand": {"@type": "Brand", "name": "Albacete MedDev"},
        "category": "Medical Device",
    }
    if manufacturer:
        p["manufacturer"] = {"@type": "Organization", "name": manufacturer}
    return p

def service(name, desc, path):
    return {
        "@type": "Service",
        "name": name,
        "description": desc,
        "url": BASE + path,
        "provider": {"@id": ORG_ID},
        "areaServed": "US",
    }

PAGES = {
    "index.html": {
        "path": "/",
        "title": "Albacete MedDev | Wound Care Products & Practice Partner",
        "desc": "Advanced wound care products, compliance, revenue cycle, and legal support for specialty practices. One operating partner with 20+ years of wound care depth.",
        "ld": [ORG, {"@type": "WebSite", "@id": BASE + "/#website", "url": BASE + "/", "name": "Albacete MedDev", "publisher": {"@id": ORG_ID}}],
    },
    "about/index.html": {
        "path": "/about/",
        "title": "About Albacete MedDev | Wound Care Operations Experts",
        "desc": "Founded to close the gap between product distribution and practice reality. 20+ years of wound care operations — compliance embedded, support direct.",
        "ld": [{"@type": "AboutPage", "name": "About Albacete MedDev", "url": BASE + "/about/", "about": {"@id": ORG_ID}}, crumbs(("Home", "/"), ("About", "/about/"))],
    },
    "why-partner/index.html": {
        "path": "/why-partner/",
        "title": "Why Partner With Albacete MedDev | Beyond Distribution",
        "desc": "Most distributors hand you a product and walk away. We stay — compliance, coding, training, audit defense, and a 24-hour escalation line, included.",
        "ld": [crumbs(("Home", "/"), ("Why Partner", "/why-partner/"))],
    },
    "products/index.html": {
        "path": "/products/",
        "title": "Advanced Wound Care Products & Solutions | Albacete MedDev",
        "desc": "Autologous biologics, collagen, ultrasound therapy, exosomes, amniotic allografts, NPWT, and wholesale supply — portal-integrated and payer-aligned.",
        "ld": [{"@type": "CollectionPage", "name": "Products & Solutions", "url": BASE + "/products/"}, crumbs(("Home", "/"), ("Products & Solutions", "/products/"))],
    },
    "products/actigraft/index.html": {
        "path": "/products/actigraft/",
        "title": "ActiGraft+ Whole Blood Clot Therapy | Albacete MedDev",
        "desc": "Point-of-care autologous whole blood clot system. No centrifuge, 5-10 minute coagulation, HCPCS G0465 under NCD 270.3. 173% healing advantage in 2024 RCT.",
        "ld": [product("ActiGraft+", "Autologous whole blood clot wound care system — point-of-care, centrifuge-free, HCPCS G0465 eligible under NCD 270.3.", "/products/actigraft/", "Legacy Medical Consultants"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("ActiGraft+", "/products/actigraft/"))],
    },
    "products/ultramist/index.html": {
        "path": "/products/ultramist/",
        "title": "UltraMist Ultrasound Therapy (CPT 97610) | Albacete MedDev",
        "desc": "FDA-cleared non-contact 40 kHz ultrasound delivered through saline mist. Painless 3-20 minute sessions, CPT 97610 — with full documentation support.",
        "ld": [product("UltraMist Therapy", "Non-contact low-frequency 40 kHz ultrasound therapy delivered via sterile saline mist. FDA-cleared, CPT 97610.", "/products/ultramist/", "Sanuwave"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("UltraMist", "/products/ultramist/"))],
    },
    "products/collagen/index.html": {
        "path": "/products/collagen/",
        "title": "Collagen Wound Care Program | Albacete MedDev",
        "desc": "Type I bovine collagen program for post-op incisions and chronic wounds. Dual HCPCS pathways, portal-integrated tracking, payer-aligned documentation.",
        "ld": [product("Collagen Wound Care Program", "Type I bovine collagen dressings for post-operative incision healing and chronic wounds — dual-pathway HCPCS coding.", "/products/collagen/"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("Collagen Program", "/products/collagen/"))],
    },
    "products/exosomes/index.html": {
        "path": "/products/exosomes/",
        "title": "Exosomes & Birth Tissue Biologics | Albacete MedDev",
        "desc": "Wharton's Jelly MSC exosomes and fresh, never-frozen placental biologics. FDA-registered facility, cGMP processing, ISO 5 clean rooms, NTA-validated.",
        "ld": [product("Exosomes & Birth Tissue Biologics", "Wharton's Jelly MSC-derived exosomes and fresh-processed placental biologics — cGMP, FDA-registered, NTA-validated.", "/products/exosomes/"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("Exosomes & Biologics", "/products/exosomes/"))],
    },
    "products/adhesion-barrier/index.html": {
        "path": "/products/adhesion-barrier/",
        "title": "Laparoscopic Adhesion Barrier (HCPCS C1762) | Albacete",
        "desc": "Dual-layer, chorion-free amniotic membrane for open, laparoscopic, and robotic surgery. Deploys through a 10-12 mm trocar in 3-5 minutes. HCPCS C1762.",
        "ld": [product("Amniotic Membrane Adhesion Barrier", "Dual-layer, chorion-free amniotic membrane allograft for adhesion prevention in open, laparoscopic, and robotic surgery. HCPCS C1762.", "/products/adhesion-barrier/"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("Adhesion Barrier", "/products/adhesion-barrier/"))],
    },
    "products/advanced-biologics/index.html": {
        "path": "/products/advanced-biologics/",
        "title": "Advanced Biologics: Microlyte SAM & Membrane Wraps",
        "desc": "Microlyte SAM antimicrobial matrix and amniotic membrane wraps — one portfolio covering every wound acuity. FDA 510(k), HCPCS A2005, BioLab partnership.",
        "ld": [product("Advanced Biologics Portfolio", "Microlyte SAM antimicrobial matrix and amniotic membrane wraps (Tri-Membrane, Membrane Wrap, Membrane Wrap Lyte) covering every wound acuity.", "/products/advanced-biologics/", "BioLab Sciences"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("Advanced Biologics", "/products/advanced-biologics/"))],
    },
    "products/microdoc/index.html": {
        "path": "/products/microdoc/",
        "title": "MicroDoc Disposable NPWT | Albacete MedDev",
        "desc": "Single-use negative pressure wound therapy for outpatient and home health. No rentals, no capital equipment, no return logistics — HCPCS-coded and ready.",
        "ld": [product("MicroDoc NPWT", "Disposable, single-use negative pressure wound therapy for outpatient and home health workflows — no equipment rental or capital investment.", "/products/microdoc/"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("MicroDoc NPWT", "/products/microdoc/"))],
    },
    "products/wholesaler/index.html": {
        "path": "/products/wholesaler/",
        "title": "Wholesale Medical Supplies, HCPCS-Coded | Albacete MedDev",
        "desc": "FDA-approved wound care supplies at wholesale pricing — foam, alginate, collagen, antimicrobials, compression. Ships HCPCS-coded and LCD-aligned.",
        "ld": [service("Medical Supplies Wholesale Distribution", "FDA-approved medical supplies at wholesale pricing with HCPCS coding and LCD/NCD-aligned documentation.", "/products/wholesaler/"), crumbs(("Home", "/"), ("Products & Solutions", "/products/"), ("Wholesaler", "/products/wholesaler/"))],
    },
    "portal/index.html": {
        "path": "/portal/",
        "title": "Practice Portal: Tracking, Ordering & Compliance | Albacete",
        "desc": "One portal for patient tracking, ordering, compliance documentation, and utilization reporting. Role-based access, audit-ready, real-time claims visibility.",
        "ld": [service("Practice Portal", "Unified portal for patient tracking, product ordering, compliance documentation, and utilization reporting with role-based access.", "/portal/"), crumbs(("Home", "/"), ("Portal & Support", "/portal/"))],
    },
    "consulting/index.html": {
        "path": "/consulting/",
        "title": "Specialty Practice Consulting | Albacete MedDev",
        "desc": "Advisory across coding, denials, operations, formulary design, and payer coverage — grounded in 20+ years inside wound care practices.",
        "ld": [service("Consultative Services", "Strategic advisory for specialty practices — coding, denials, operations, formulary design, and payer coverage.", "/consulting/"), crumbs(("Home", "/"), ("Consulting", "/consulting/"))],
    },
    "revenue-cycle/index.html": {
        "path": "/revenue-cycle/",
        "title": "Revenue Cycle Management for Practices | Albacete MedDev",
        "desc": "Portfolio analysis and AcuityMD-powered benchmarking uncover 8 types of revenue leakage. Typical 15-35% recovery in year one, zero added clinical work.",
        "ld": [service("Revenue Cycle Management", "Portfolio analysis and peer benchmarking that uncover revenue leakage — typical 15-35% recovery in year one with zero workflow disruption.", "/revenue-cycle/"), crumbs(("Home", "/"), ("Revenue Cycle", "/revenue-cycle/"))],
    },
    "legal-guidance/index.html": {
        "path": "/legal-guidance/",
        "title": "In-House Medical-Legal Counsel | Albacete MedDev",
        "desc": "Dedicated medical-legal counsel for audits, board complaints, denials, Stark/AKS, and HIPAA — 24-hour response, included in the partnership.",
        "ld": [service("Legal Guidance", "In-house medical-legal counsel for audits, complaints, denials, Stark/AKS, HIPAA, and contracts — included in the partnership.", "/legal-guidance/"), crumbs(("Home", "/"), ("Legal Guidance", "/legal-guidance/"))],
    },
    "contact/index.html": {
        "path": "/contact/",
        "title": "Contact Albacete MedDev | Schedule a Consultation",
        "desc": "Direct access to our operations and clinical leads — no gatekeepers. Call 551-497-3428 or schedule a 30-minute consultation for your practice.",
        "ld": [{"@type": "ContactPage", "name": "Contact Albacete MedDev", "url": BASE + "/contact/"}, crumbs(("Home", "/"), ("Contact", "/contact/"))],
    },
    "scientific-portfolio/index.html": {
        "path": "/scientific-portfolio/",
        "title": "Wound Care Science: 3 Platforms, 1 Cascade | Albacete",
        "desc": "Collagen for MMP neutralization, Microlyte SAM for biofilm, amniotic membrane for regeneration — three platforms mapped to the chronic wound cascade.",
        "ld": [crumbs(("Home", "/"), ("Scientific Portfolio", "/scientific-portfolio/"))],
    },
}

FAVICON_LINES = """  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">"""

def build_block(cfg):
    url = BASE + cfg["path"]
    ld = {"@context": "https://schema.org", "@graph": cfg["ld"]}
    ld_json = json.dumps(ld, separators=(",", ":"), ensure_ascii=False)
    return f"""{FAVICON_LINES}
  <link rel="canonical" href="{url}">
  <!-- Open Graph / link previews -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Albacete MedDev">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{cfg['title']}">
  <meta property="og:description" content="{cfg['desc']}">
  <meta property="og:image" content="{BASE}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{cfg['title']}">
  <meta name="twitter:description" content="{cfg['desc']}">
  <meta name="twitter:image" content="{BASE}/assets/img/og-image.png">
  <!-- Structured data -->
  <script type="application/ld+json">{ld_json}</script>"""

BLOCK_RE = re.compile(
    r"  <!-- Favicons -->.*?(?:  <script type=\"application/ld\+json\">.*?</script>|  <meta name=\"twitter:image\"[^>]*>)",
    re.DOTALL,
)
TITLE_RE = re.compile(r"<title>.*?</title>", re.DOTALL)
DESC_RE = re.compile(r'<meta name="description" content="[^"]*">')

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    changed = 0
    for rel, cfg in PAGES.items():
        p = os.path.join(root, rel)
        if not os.path.exists(p):
            print(f"MISSING: {rel}"); continue
        with open(p, encoding="utf-8") as f:
            html = f.read()
        orig = html
        html = TITLE_RE.sub(f"<title>{cfg['title']}</title>", html, count=1)
        html = DESC_RE.sub(f'<meta name="description" content="{cfg["desc"]}">', html, count=1)
        if BLOCK_RE.search(html):
            html = BLOCK_RE.sub(lambda m: build_block(cfg), html, count=1)
        else:
            print(f"NO BLOCK MARKER: {rel} — inserting before </head>")
            html = html.replace("</head>", build_block(cfg) + "\n</head>", 1)
        if html != orig:
            with open(p, "w", encoding="utf-8") as f:
                f.write(html)
            changed += 1
    print(f"Updated {changed}/{len(PAGES)} pages")

if __name__ == "__main__":
    sys.exit(main())
