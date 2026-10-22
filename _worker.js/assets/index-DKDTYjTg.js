import { r as reactExports, V as jsxRuntimeExports } from "./server-BI10_YHG.js";
import { p as IDENT_VIDEO, A as AppLink, P as Picture, n as ArrowIcon, q as PEPTIDE_BY_KEY, S as SectionHead, R as Reveal, r as PhotoCardGrid, s as PhotoCard, a as SplitRow, u as PRODUCT_BY_SLUG, b as StatementPanel, E as EditorialGrid, i as EditorialCard, d as Panel, m as contact, I as InfoBand$1 } from "./router-DV9njkLu.js";
import { h as heroSlides, o as offer, m as marqueeNames, r as railTabs, p as peptidePanel, a as productsHead, c as categoryCards, P as PEPTIDE_NOTE, R as Rail, b as PeptideTile, d as ProductTile, E as EndTile, e as railEnd, f as approach, s as story, g as services, j as software, k as evidence, l as closing, i as info } from "./home-CqZPuHt-.js";
import { P as PeptideLabel } from "./PeptideLabel-Bx01421u.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function IdentVideo({ label = "Watch our introduction" }) {
  const dialogRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const open = () => {
    const d = dialogRef.current;
    if (!d) return;
    d.showModal();
    videoRef.current?.play().catch(() => void 0);
  };
  const close = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "hero-play", onClick: open, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "play-dot", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", width: "14", height: "14", focusable: "false", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4.5v11l9-5.5z", fill: "currentColor" }) }) }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "dialog",
      {
        ref: dialogRef,
        className: "ident-dialog",
        "aria-label": label,
        onClose: () => videoRef.current?.pause(),
        onClick: (e) => {
          if (e.target === dialogRef.current) close();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn ident-close", "aria-label": "Close", onClick: close, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", width: "18", height: "18", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 5l10 10M15 5 5 15", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("video", { ref: videoRef, controls: true, playsInline: true, preload: "none", width: 1600, height: 900, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: IDENT_VIDEO.landscape.webm, type: "video/webm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: IDENT_VIDEO.landscape.mp4, type: "video/mp4" })
          ] })
        ]
      }
    )
  ] });
}
function HeroMosaic({ slides, label = "Highlights" }) {
  const trackRef = reactExports.useRef(null);
  const [index, setIndex] = reactExports.useState(0);
  const n = slides.length;
  const step = reactExports.useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return el.clientWidth + gap;
  }, []);
  reactExports.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = step();
        if (s > 0) setIndex(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / s))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, step]);
  const go = reactExports.useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el) return;
      const target = Math.max(0, Math.min(n - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: target * step(), behavior: reduce ? "auto" : "smooth" });
      setIndex(target);
    },
    [n, step]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero", "aria-labelledby": "hero-title", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-carousel", role: "region", "aria-roledescription": "carousel", "aria-label": label, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "hero-track",
          ref: trackRef,
          tabIndex: 0,
          onKeyDown: (e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(index + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(index - 1);
            }
          },
          children: slides.map((s, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "hero-slide", role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} of ${n}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-copy", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: s.eyebrow }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { id: i === 0 ? "hero-title" : void 0, className: "hero-title", children: s.title.map((line, li) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  li > 0 ? " " : null,
                  line
                ] }, line)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hero-lead", children: s.lead }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: s.primary.href, className: "btn btn--primary", tabIndex: i === index ? 0 : -1, children: s.primary.label }),
                  s.secondary ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: s.secondary.href, className: "btn btn--outline", tabIndex: i === index ? 0 : -1, children: s.secondary.label }) : null,
                  s.play ? /* @__PURE__ */ jsxRuntimeExports.jsx(IdentVideo, {}) : null
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mosaic", children: s.tiles.map((t, k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mo mo-${"abcd"[k]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Picture,
                {
                  image: t.image,
                  alt: t.alt,
                  sizes: k === 0 ? "(max-width: 760px) 56vw, (max-width: 1023px) 50vw, 34vw" : "(max-width: 760px) 40vw, (max-width: 1023px) 36vw, 22vw",
                  priority: i === 0,
                  draggable: false
                }
              ) }, t.image + k)) })
            ] }, s.id);
          })
        }
      ),
      n > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn hero-arrow hero-arrow--prev", "aria-label": "Previous", onClick: () => go(index - 1), disabled: index === 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, { dir: "left" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn hero-arrow hero-arrow--next", "aria-label": "Next", onClick: () => go(index + 1), disabled: index === n - 1, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}) })
      ] }) : null
    ] }),
    n > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-dots", children: slides.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "hero-dot", "aria-label": `Slide ${i + 1} of ${n}`, "aria-current": i === index ? "true" : void 0, onClick: () => go(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}) }, s.id)) }) : null
  ] });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HeroMosaic, { slides: heroSlides, label: "Highlights" });
}
function OfferTiles() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--tight", "aria-label": "What we offer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "tiles", children: offer.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: o.href, className: "tile-link", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
      o.label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arrow", "aria-hidden": "true", children: "→" })
  ] }) }, o.href)) }) });
}
function Marquee() {
  const list = (hidden) => /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { "aria-hidden": hidden || void 0, children: marqueeNames.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: n }, n)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "marquee", "aria-label": "Products we carry", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marquee-view", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "marquee-track", children: [
    list(false),
    list(true)
  ] }) }) });
}
function Products() {
  const [active, setActive] = reactExports.useState(railTabs[0].id);
  const tab = railTabs.find((t) => t.id === active) ?? railTabs[0];
  const peptideHero = PEPTIDE_BY_KEY[peptidePanel.cardKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "portfolio", "aria-labelledby": "products-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "products-title", eyebrow: productsHead.eyebrow, title: productsHead.title, link: productsHead.link }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoCardGrid, { cols: 3, children: categoryCards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoCard, { eyebrow: c.eyebrow, title: c.title, text: c.text, cta: c.cta, image: c.image, alt: c.alt, tone: c.tone, priority: true }, c.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { className: "stack", "aria-label": peptidePanel.eyebrow, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SplitRow,
      {
        id: "peptides-panel",
        eyebrow: peptidePanel.eyebrow,
        title: peptidePanel.title,
        cta: peptidePanel.cta,
        reverse: true,
        className: "split--peptides",
        media: peptideHero ? /* @__PURE__ */ jsxRuntimeExports.jsx(PeptideLabel, { card: peptideHero, sizes: "(max-width: 900px) 92vw, 44vw" }) : void 0,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: peptidePanel.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reg-note reg-note--on-grey", children: PEPTIDE_NOTE })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabs", role: "tablist", "aria-label": "Product groups", children: railTabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          role: "tab",
          id: `tab-${t.id}`,
          className: "tab",
          "aria-selected": active === t.id,
          "aria-controls": "rail-panel",
          tabIndex: active === t.id ? 0 : -1,
          onClick: () => setActive(t.id),
          onKeyDown: (e) => {
            const i = railTabs.findIndex((x) => x.id === t.id);
            if (e.key === "ArrowRight") setActive(railTabs[(i + 1) % railTabs.length].id);
            if (e.key === "ArrowLeft") setActive(railTabs[(i - 1 + railTabs.length) % railTabs.length].id);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: t.num }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
          ]
        },
        t.id
      )) }),
      tab.id === "peptides" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reg-note", style: { background: "var(--band)", marginTop: 0, marginBottom: 16 }, children: PEPTIDE_NOTE }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "tabpanel", id: "rail-panel", "aria-labelledby": `tab-${tab.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Rail, { label: "Products", resetKey: tab.id, children: [
        tab.id === "peptides" ? tab.peptides.map((key) => {
          const card = PEPTIDE_BY_KEY[key];
          return card ? /* @__PURE__ */ jsxRuntimeExports.jsx(PeptideTile, { card }, key) : null;
        }) : tab.products.map((slug) => {
          const p = PRODUCT_BY_SLUG[slug];
          return p ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductTile, { product: p }, slug) : null;
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EndTile, { label: railEnd.label, href: railEnd.href })
      ] }) })
    ] })
  ] }) });
}
function Statement() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-label": approach.eyebrow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "approach-title", eyebrow: approach.eyebrow, title: approach.title, text: approach.text, cta: approach.cta, image: approach.image, alt: approach.alt }) }) });
}
function Questions() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "clinical-approach", "aria-labelledby": "story-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "story-title", eyebrow: story.eyebrow, title: story.title, lead: story.body, link: story.link }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialGrid, { cols: 3, as: "ol", children: story.steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialCard, { as: "li", num: s.num, title: s.title, text: s.text, href: s.cta.href, linkLabel: s.cta.strong, image: s.image, alt: s.alt, tone: "grey" }, s.num)) }) })
  ] }) });
}
function Services() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: "services", "aria-labelledby": "services-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHead,
      {
        id: "services-title",
        eyebrow: services.eyebrow,
        title: services.title,
        aside: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: services.aside }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: services.cta.href, className: "btn btn--primary", children: services.cta.label })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoCardGrid, { cols: 3, children: services.cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoCard, { eyebrow: c.eyebrow, title: c.title, text: c.text, cta: c.cta, image: c.image, alt: c.alt, tone: c.tone }, c.cta.href)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "software-panel", tone: "navy", eyebrow: software.eyebrow, title: software.title, cta: software.cta, image: software.image, alt: software.alt, reverse: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: software.text }) })
    ] })
  ] }) });
}
function EvidenceTeaser() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", "aria-labelledby": "evidence-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "evidence-title", eyebrow: evidence.eyebrow, title: evidence.title, lead: evidence.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialGrid, { cols: 2, children: evidence.cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialCard, { label: c.label, title: c.title, text: c.text, href: c.href, linkLabel: c.linkLabel, image: c.image, alt: c.alt, tone: "grey" }, c.href)) }) })
  ] }) });
}
function Closing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "cta-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", scrim: "left", image: closing.image, imageAlt: closing.alt, className: "cta-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cta-body", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: closing.eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "cta-title", className: "cta-title", children: closing.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cta-text", children: closing.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: closing.cta.href, className: "btn btn--light", children: closing.cta.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "cta-contact", href: contact.tel, children: contact.phone }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "cta-contact", href: contact.mailto, children: contact.email })
    ] })
  ] }) }) }) });
}
function InfoBand() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand$1, { title: info.title, notes: info.notes });
}
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OfferTiles, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Marquee, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Products, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Statement, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Questions, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Services, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EvidenceTeaser, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Closing, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, {})
  ] });
}
export {
  Home as component
};
