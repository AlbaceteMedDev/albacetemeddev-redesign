import { r as reactExports, V as jsxRuntimeExports } from "./server-BUpjg61o.js";
import { A as AppLink, d as Panel, G as PEPTIDES, S as SectionHead, R as Reveal, P as Picture, I as InfoBand, H as PEPTIDE_CARDS, e as cx, J as Route, h as SubNav } from "./router-CCpBSQQs.js";
import { P as PeptideLabel } from "./PeptideLabel-AqYMFi0D.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const GATE = {
  key: "amd-pep-pro",
  title: "For licensed prescribers and practice staff",
  body: "This page describes compounded preparations that licensed prescribers can request for their patients or practices. It is not intended for patients or consumers. Compounded preparations are not FDA-approved.",
  confirm: "I am a licensed prescriber or practice staff acting for one",
  leave: { label: "Leave this page", href: "/products" }
};
const BACK_LINK = { label: "All products", href: "/products" };
const SUBNAV = [
  { href: "#channels", label: "Supply channels" },
  { href: "#before-you-order", label: "Before you order" },
  { href: "#catalog", label: "The catalog" },
  { href: "#pricing", label: "Pricing & onboarding" }
];
const CHANNEL_EXTRA_ROWS = {
  "MyPharmacyOrder — 503A": { k: "Sign-up", v: "mypharmacyorder.com" },
  "MyViaHealth — 503A/B": { k: "Catalog", v: "Full peptide range + blends" }
};
const CHANNELS_PHOTO = { image: "practice-supply", alt: "Practice staff reviewing supplies together" };
const PRICING = {
  eyebrow: "Pricing & onboarding",
  title: "Get the clinic price list.",
  text: "Clinic pricing across both channels, volume tiers, and onboarding for portal ordering — shared with verified practices, typically same day.",
  primary: {
    label: "Request pricing",
    href: "mailto:gabe@albacetemeddev.com?subject=Peptide%20clinic%20price%20list%20request&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf."
  },
  secondary: { label: "Schedule a consultation", href: "/contact" },
  image: "services-consulting",
  alt: "Consultant walking with a clinician in a practice corridor"
};
const EMPTY = { text: "No catalog entries match those filters.", clear: "Clear filters" };
const PREPARATIONS_LABEL = "Available preparations";
const INFO_TITLE = "Important information";
const BEFORE_LINKS = [
  { text: "www.fda.gov/medwatch", href: "https://www.fda.gov/medwatch" },
  { text: "1-800-FDA-1088", href: "tel:+18003321088" },
  { text: "551-497-3428", href: "tel:+15514973428" }
];
const KEY = GATE.key;
const done = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
function PeptidesGate() {
  const ref = reactExports.useRef(null);
  const confirmed = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const root = document.documentElement;
    const d = ref.current;
    if (!d || done()) {
      root.classList.remove("pep-gate-wait");
      return;
    }
    confirmed.current = false;
    if (!d.open) d.showModal();
    root.classList.add("pep-gate-open");
    root.classList.remove("pep-gate-wait");
    d.focus({ preventScroll: true });
    return () => {
      root.classList.remove("pep-gate-open", "pep-gate-wait");
      if (d.open) d.close();
    };
  }, []);
  const confirm = () => {
    confirmed.current = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
    }
    document.documentElement.classList.remove("pep-gate-open");
    ref.current?.close();
    const main = document.getElementById("main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      ref,
      className: "pep-gate",
      "aria-labelledby": "pep-gate-title",
      "aria-describedby": "pep-gate-body",
      tabIndex: -1,
      onCancel: (e) => e.preventDefault(),
      onClose: () => {
        if (confirmed.current || done()) return;
        requestAnimationFrame(() => {
          const d = ref.current;
          if (d && d.isConnected && !d.open) d.showModal();
        });
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "pep-gate-title", className: "pep-gate-title", children: GATE.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "pep-gate-body", className: "pep-gate-body", children: GATE.body }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-gate-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn--primary", onClick: confirm, children: GATE.confirm }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: GATE.leave.href, className: "btn btn--outline", children: GATE.leave.label })
        ] })
      ]
    }
  );
}
function splitNotice(text) {
  const i = text.indexOf(". ");
  return i < 0 ? [text, ""] : [text.slice(0, i + 1), text.slice(i + 1)];
}
function PeptidesHero() {
  const [strong, rest] = splitNotice(PEPTIDES.notice);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide pep-hero-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "photo", as: "div", image: PEPTIDES.image, imageAlt: PEPTIDES.imageAlt, scrim: "left", className: "pep-hero", priority: true, "aria-labelledby": "pep-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body pep-hero-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: BACK_LINK.href, className: "pep-back", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "←" }),
          " ",
          BACK_LINK.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: PEPTIDES.maker }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "pep-title", className: "h1", children: PEPTIDES.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead lead--lg pep-hero-lead", children: PEPTIDES.deck }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: PEPTIDES.cta.href, className: "btn btn--light", children: PEPTIDES.cta.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: PEPTIDES.source.href, className: "link-arrow link-arrow--on-dark", children: [
            PEPTIDES.source.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-hero-caption", children: PEPTIDES.imageCaption })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pep-notice", role: "note", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: strong }),
      rest
    ] })
  ] });
}
function PeptidesChannels() {
  const c = PEPTIDES.channels;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "channels", "aria-labelledby": "channels-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "channels-title", eyebrow: c.eyebrow, title: c.title, lead: c.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "pep-channels", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-channels-photo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: CHANNELS_PHOTO.image, alt: CHANNELS_PHOTO.alt, sizes: "(max-width: 1023px) 96vw, 32vw" }) }),
      c.panels.map((p) => {
        const [name, code] = p.title.split(" — ");
        const extra = CHANNEL_EXTRA_ROWS[p.title];
        const rows = extra ? [...p.rows, extra] : [...p.rows];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "pep-channel", "aria-label": p.title, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "h3", children: [
            name,
            code ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-ch-code", children: code })
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "spec", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: r.k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: r.v })
          ] }, r.k)) })
        ] }, p.title);
      })
    ] })
  ] }) });
}
function linkify(text) {
  const out = [];
  let rest = text;
  let n = 0;
  while (rest) {
    let best = null;
    for (const l of BEFORE_LINKS) {
      const i = rest.indexOf(l.text);
      if (i >= 0 && (!best || i < best.i)) best = { i, l };
    }
    if (!best) {
      out.push(rest);
      break;
    }
    if (best.i > 0) out.push(rest.slice(0, best.i));
    out.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: best.l.href, rel: best.l.href.startsWith("http") ? "noopener" : void 0, children: best.l.text }, n++)
    );
    rest = rest.slice(best.i + best.l.text.length);
  }
  return out;
}
function PeptidesBefore() {
  const b = PEPTIDES.before;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section section--flush", id: "before-you-order", "aria-labelledby": "before-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "pep-before", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-before-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "before-title", className: "h2", children: b.title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-before-body", children: [
      b.paragraphs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: p.lead }),
        " ",
        p.lead.startsWith("Adverse events") ? linkify(p.text) : p.text
      ] }, p.lead)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-before-foot", children: b.foot })
    ] })
  ] }) }) });
}
function PeptidesPricing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section section--flush", id: "pricing", "aria-labelledby": "pricing-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", as: "div", image: PRICING.image, imageAlt: PRICING.alt, scrim: "center", className: "statement pep-pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "statement-body", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: PRICING.eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "pricing-title", className: "statement-title", children: PRICING.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "statement-text", children: PRICING.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "btn btn--light", href: PRICING.primary.href, children: PRICING.primary.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { className: "btn btn--outline-light", href: PRICING.secondary.href, children: PRICING.secondary.label })
    ] })
  ] }) }) }) });
}
function PeptidesInfo() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: INFO_TITLE, notes: [PEPTIDES.notice, PEPTIDES.before.foot] });
}
function matches(c, f, q) {
  return (!f.cat || c.cat === f.cat) && (!f.ch || c.channels.includes(f.ch)) && (!f.status || c.status === f.status) && (!q || c.search.includes(q));
}
function PeptidesCatalog({ filters, onChange }) {
  const cat = PEPTIDES.catalog;
  const [q, setQ] = reactExports.useState(filters.q ?? "");
  const total = PEPTIDE_CARDS.length;
  const needle = q.toLowerCase().trim();
  const visible = reactExports.useMemo(() => new Set(PEPTIDE_CARDS.filter((c) => matches(c, filters, needle)).map((c) => c.key)), [filters.cat, filters.ch, filters.status, needle]);
  const shown = visible.size;
  const active = !!(filters.cat || filters.ch || filters.status || needle);
  const latest = reactExports.useRef({ filters, onChange });
  latest.current = { filters, onChange };
  const first = reactExports.useRef(true);
  reactExports.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => latest.current.onChange({ ...latest.current.filters, q: q.trim() || void 0 }), 250);
    return () => window.clearTimeout(t);
  }, [q]);
  const toggle = (k, v) => onChange({ ...filters, q: q.trim() || void 0, [k]: filters[k] === v || !v ? void 0 : v });
  const clearAll = () => {
    setQ("");
    onChange({});
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band pep-store", id: "catalog", "aria-labelledby": "catalog-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "catalog-title", eyebrow: cat.eyebrow, title: cat.title, lead: cat.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-shop", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "pep-rail", "aria-label": "Catalog filters", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 20 20", width: "18", height: "18", "aria-hidden": "true", focusable: "false", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "8.5", r: "5.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13 13l4.5 4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "search", value: q, onChange: (e) => setQ(e.target.value), placeholder: cat.searchPlaceholder, "aria-label": cat.searchLabel, autoComplete: "off", enterKeyHint: "search" })
        ] }),
        cat.filterGroups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-pill-row", role: "group", "aria-label": g.aria, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-pill-label", children: g.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-pill-scroll", children: g.pills.map((p) => {
            const k = p.filter;
            const on = (filters[k] ?? "") === p.value;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: cx("pep-pill", on && "is-on"), "aria-pressed": on, onClick: () => toggle(k, p.value), children: p.label }, p.value || "all");
          }) })
        ] }, g.label))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-results pepx-results", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-toolbar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pep-count", "aria-live": "polite", children: [
            "Showing ",
            shown,
            " of ",
            total
          ] }),
          active ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "pep-clear", onClick: clearAll, children: cat.clearLabel }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "pep-legend", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: cat.legend.summary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-legend-rows", children: cat.legend.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-legend-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("pep-chip", r.chipClass), children: r.chip }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: r.text })
          ] }, r.chip)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-legend-foot", children: cat.legend.foot })
        ] }),
        PEPTIDES.categories.map((sec) => {
          const key = sec.id.replace(/^cat-/, "");
          const cards = PEPTIDE_CARDS.filter((c) => c.cat === key);
          const any = cards.some((c) => visible.has(c.key));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: sec.id, className: "pep-cat", hidden: !any, "aria-labelledby": `${sec.id}-title`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "pep-cat-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: `${sec.id}-title`, children: sec.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: sec.text })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-grid", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { card: c, hidden: !visible.has(c.key) }, c.key)) })
          ] }, sec.id);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pep-empty", hidden: shown !== 0, children: [
          EMPTY.text,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "pep-clear-inline", onClick: clearAll, children: EMPTY.clear })
        ] })
      ] })
    ] })
  ] }) });
}
function Card({ card, hidden }) {
  const noteId = card.request ? card.request.describedBy : `pep-ord-${card.key}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "pep-card", "data-key": card.key, hidden, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pep-card-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PeptideLabel, { card, sizes: "(max-width: 640px) 92vw, (max-width: 1279px) 44vw, 330px" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-card-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-chips", children: [
        card.chips.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("pep-chip", ch.cls), children: ch.label }, ch.label)),
        card.channels.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-chip pep-chip--ch", children: c }, c))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "pep-name", children: card.name }),
      card.mech ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-mech", children: card.mech }) : null,
      card.note ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-note", children: card.note }) : null,
      card.rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "pep-details", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { children: [
          PREPARATIONS_LABEL,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-pres", children: card.preparations })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "pep-rows", children: card.rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-row-meta", children: r.meta })
        ] }, i)) })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-order", children: [
        card.request ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "pep-req link-arrow", href: card.request.href, "aria-describedby": card.request.describedBy, children: [
          card.request.label,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-na", children: card.na }),
        card.orderNote ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pep-ord-note", id: noteId, children: card.orderNote }) : null
      ] })
    ] })
  ] });
}
const HOLD = `(function(h){try{if(sessionStorage.getItem('${GATE.key}')==='1')return}catch(e){}h.classList.add('pep-gate-wait');setTimeout(function(){if(!h.classList.contains('pep-gate-open'))h.classList.remove('pep-gate-wait')},6000)})(document.documentElement)`;
function Page() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const onChange = (next) => navigate({
    search: {
      cat: next.cat || void 0,
      ch: next.ch || void 0,
      status: next.status || void 0,
      q: next.q || void 0
    },
    replace: true,
    resetScroll: false,
    viewTransition: false
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: {
      __html: HOLD
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubNav, { title: PEPTIDES.name, titleHref: PEPTIDES.href, items: [...SUBNAV] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesHero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesChannels, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesBefore, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesCatalog, { filters, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesPricing, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesInfo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeptidesGate, {})
  ] });
}
export {
  Page as component
};
