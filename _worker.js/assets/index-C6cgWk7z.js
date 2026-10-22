import { r as reactExports, V as jsxRuntimeExports } from "./server-O62Ku6QH.js";
import { z as CATEGORIES, h as SubNav, d as Panel, B as PRODUCTS_HUB, A as AppLink, P as Picture, S as SectionHead, R as Reveal, b as StatementPanel, I as InfoBand, u as PRODUCT_BY_SLUG } from "./router-Bw2Lf1rI.js";
import { P as ProductCard, b as ProductPicture } from "./shared-T5J182qJ.js";
import { l as closing, i as info } from "./home-CwxrNy_I.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./PeptideLabel-BdrnGem9.js";
const NOTES = {
  amchoplast: "Dehydrated membrane",
  "membrane-wrap-hydro": "Hydrated membrane",
  activate: "Dehydrated membrane",
  palisade: "Dehydrated membrane",
  "sentry-sl": "Dehydrated membrane",
  "membrane-wrap": "Membrane sheet",
  "tri-membrane-wrap": "Triple-layer membrane",
  "xcell-amnio-matrix": "Lyophilized membrane",
  palingen: "Air-dried membrane",
  apis: "Matrix sheet",
  microlyte: "Ultrathin matrix",
  "microlyte-painguard": "Ultrathin matrix",
  "myriad-matrix": "Perforated matrix sheet",
  interfyl: "Flowable · particulate",
  xcellistem: "Wound powder",
  ultramist: "Non-contact device",
  arobella: "Console · handpiece",
  microdoc: "Portable single-use device",
  actigraft: "Point-of-care system",
  "adhesion-barrier": "Surgical membrane",
  peptides: "Pharmacy channels",
  exosomes: "Research & product review",
  wholesaler: "Multiple formats",
  ovena: "Patient & caregiver supplies"
};
const SCENES = {
  peptides: {
    image: "peptides-scene",
    alt: "Pharmacist and clinician reviewing a product in a pharmacy"
  },
  ovena: {
    image: "ovena",
    alt: "Ovena wound care kit in a home care setting"
  }
};
const CARD_SIZES = "(max-width: 640px) 94vw, (max-width: 1023px) 46vw, 31vw";
const HERO_TILES = [{
  image: "amchoplast",
  alt: "AmchoPlast carton"
}, {
  image: "microlyte-pack",
  alt: "Microlyte Matrix navy carton from Imbed Biosciences with its foil pouch"
}, {
  image: "ultramist",
  alt: "SANUWAVE UltraMIST unit with its handpiece docked"
}];
function MemberMedia({
  m
}) {
  const p = PRODUCT_BY_SLUG[m.slug];
  if (p) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductPicture, { product: p, sizes: CARD_SIZES });
  const s = SCENES[m.slug];
  if (!s) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pmedia", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: s.image, alt: s.alt, sizes: CARD_SIZES }) });
}
function ProductsHub() {
  const [cat, setCat] = reactExports.useState("");
  const [q, setQ] = reactExports.useState("");
  reactExports.useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      setCat("");
      setQ("");
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({
        block: "start"
      }), 0);
    };
    jump();
    window.addEventListener("hashchange", jump);
    return () => window.removeEventListener("hashchange", jump);
  }, []);
  const needle = q.trim().toLowerCase();
  const groups = reactExports.useMemo(() => CATEGORIES.map((c) => ({
    ...c,
    members: c.members.filter((m) => !needle || [m.name, m.maker, m.text, NOTES[m.slug] ?? ""].join(" ").toLowerCase().includes(needle))
  })), [needle]);
  const visible = groups.filter((g) => (!cat || g.id === cat) && g.members.length > 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubNav, { title: "Products & solutions", titleHref: "/products", items: CATEGORIES.map((c) => ({
      href: `#${c.id}`,
      label: c.label
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide section section--tight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", className: "hub-hero", "aria-labelledby": "hub-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: PRODUCTS_HUB.eyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "hub-title", className: "h1", children: PRODUCTS_HUB.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead lead--lg", children: PRODUCTS_HUB.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: "/contact", className: "btn btn--primary", children: "Talk with our team" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hub-mosaic", children: HERO_TILES.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: t.image, alt: t.alt, sizes: i === 0 ? "(max-width: 900px) 55vw, 26vw" : "(max-width: 900px) 40vw, 20vw", priority: true }) }, t.image)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section section--flush", "aria-label": "Product catalog", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tools", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "visual-search", children: "Find a product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "visual-search", className: "input", type: "search", placeholder: "Try Hydro, membrane, or ultrasound…", value: q, onChange: (e) => setQ(e.target.value), autoComplete: "off" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tools-meta", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "link-arrow", onClick: () => {
          setQ("");
          setCat("");
        }, children: "Reset" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "filter-label", id: "cat-label", style: {
        marginBottom: 10
      }, children: "Explore by category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs", role: "group", "aria-labelledby": "cat-label", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "tab", "aria-pressed": cat === "", onClick: () => setCat(""), children: "All categories" }),
        CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "tab", "aria-pressed": cat === c.id, onClick: () => setCat(c.id), children: c.label }, c.id))
      ] }),
      visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "no-results", role: "status", children: "No products match. Try another term or reset the filters." }) : visible.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: g.id, className: "catalog-group", "aria-labelledby": `${g.id}-title`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: `${g.id}-title`, title: g.label, lead: g.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pgrid", children: g.members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { href: m.href, maker: m.maker, name: m.name, text: m.text, note: NOTES[m.slug], media: /* @__PURE__ */ jsxRuntimeExports.jsx(MemberMedia, { m }) }, m.slug)) })
      ] }, g.id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide section section--tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "hub-closing", eyebrow: closing.eyebrow, title: closing.title, text: closing.body, cta: closing.cta, image: closing.image, alt: closing.alt }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: info.title, notes: info.notes })
  ] });
}
export {
  ProductsHub as component
};
