import { V as jsxRuntimeExports } from "./server-CuIGe7e9.js";
import { K as Route, u as PRODUCT_BY_SLUG, h as SubNav, d as Panel, A as AppLink, R as Reveal, a as SplitRow, S as SectionHead, E as EditorialGrid, i as EditorialCard, b as StatementPanel, I as InfoBand } from "./router-vytYg3Bb.js";
import { b as ProductPicture, F as Facts, a as Faq, c as altFor, R as RelatedRail } from "./shared-DfbD-KiU.js";
import { i as info } from "./home-FMvBb3xF.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./PeptideLabel-DJrIOyEo.js";
const PHOTO = {
  reading: {
    image: "evidence-reading",
    alt: "Clinician reading and taking notes"
  },
  extras: {
    image: "services-billing",
    alt: "Practice administrator reviewing billing documents"
  },
  next: {
    image: "clinical-consult",
    alt: "Clinician in consultation with a patient and family member"
  }
};
const BAND_PHOTO = {
  exosomes: {
    image: "clinical-lab",
    alt: "Scientist examining a sample at a microscope"
  },
  wholesaler: {
    image: "practice-supply",
    alt: "Practice staff reviewing supplies together"
  }
};
function ProductPage() {
  const {
    slug
  } = Route.useParams();
  const p = PRODUCT_BY_SLUG[slug];
  if (!p) return null;
  let side = false;
  const flip = () => side = !side;
  const subnav = p.anchors.length ? p.anchors : p.family.length ? [{
    href: "#family",
    label: p.categoryLabel
  }] : [];
  const notes = [...p.disclaimers];
  if (p.imageCaption && p.imageCaption !== "Manufacturer reference" && !notes.includes(p.imageCaption)) notes.push(p.imageCaption);
  notes.push(...info.notes);
  const band = BAND_PHOTO[p.slug] ?? PHOTO.next;
  const mediaIsPlate = Boolean(p.reference || p.identity || !p.image);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    subnav.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(SubNav, { title: p.name, titleHref: "/products", items: subnav }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide section section--tight stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "navy", className: "phero", "aria-labelledby": "product-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "phero-copy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: "/products", className: "phero-back", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "←" }),
            " All products"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: p.maker }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "product-title", className: "phero-title", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "phero-deck", children: p.deck }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
            p.cta ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: p.cta.href, className: "btn btn--light", children: p.cta.label }) : null,
            p.source ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: p.source.href, className: "link-arrow link-arrow--on-dark", children: [
              p.source.label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: p.source.external ? "↗" : "→" })
            ] }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "phero-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductPicture, { product: p, sizes: "(max-width: 900px) 100vw, 52vw", priority: true }) })
      ] }),
      p.specs.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "grey", as: "div", "aria-label": "Specifications", children: /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "spec-strip", children: p.specs.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: s.k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: s.v })
      ] }, s.k)) }) }) : null,
      p.overview ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "overview", eyebrow: p.overview.eyebrow, title: p.overview.title, reverse: flip(), plate: mediaIsPlate, media: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductPicture, { product: p, variant: "reference", sizes: "(max-width: 900px) 92vw, 44vw" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: p.overview.text }) }) }) : null,
      p.overview?.cards.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facts, { items: p.overview.cards }) }) : null,
      p.extras.map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: `extra-${i + 1}`, eyebrow: x.eyebrow, title: x.title, reverse: flip(), image: PHOTO.extras.image, alt: PHOTO.extras.alt, cta: x.links[0], secondary: x.links[1], children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: x.text }) }) }, x.title)),
      p.reading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SplitRow, { id: "clinical-reading", eyebrow: p.reading.eyebrow, title: p.reading.title, reverse: flip(), image: PHOTO.reading.image, alt: PHOTO.reading.alt, cta: p.reading.library ?? void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: p.reading.text }),
        p.reading.references.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "refs", children: p.reading.references.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "refs-meta", children: r.meta }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: r.href, target: "_blank", rel: "noopener noreferrer", children: r.citation })
        ] }, r.href)) }) : null
      ] }) }) : null,
      p.sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", id: s.id, "aria-labelledby": `${s.id}-title`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: `${s.id}-title`, eyebrow: s.eyebrow, title: s.title, lead: s.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Facts, { items: s.items })
      ] }, s.id)),
      p.faq.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "grey", id: "faq", "aria-labelledby": "faq-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "faq-title", eyebrow: p.faqEyebrow || void 0, title: p.faqTitle ?? p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { items: p.faq.map((f) => ({
          q: f.q,
          a: f.a
        })) })
      ] }) }) }) : null,
      p.family.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", id: "family", "aria-labelledby": "family-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "family-title", eyebrow: p.maker, title: p.categoryLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialGrid, { cols: 3, children: p.family.map((f) => {
          const fp = PRODUCT_BY_SLUG[f.slug];
          return fp?.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialCard, { label: f.maker, title: f.name, text: f.text, href: f.href, linkLabel: "Explore", image: fp.image, alt: altFor(fp), tone: "grey" }, f.slug) : null;
        }) })
      ] }) : null,
      p.next ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { id: "resources", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "next-title", eyebrow: p.next.eyebrow, title: p.next.title, text: p.next.text, cta: p.next.cta ?? void 0, image: PHOTO.next.image, alt: PHOTO.next.alt }) }) : null,
      p.ctaBand ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", scrim: "center", image: band.image, imageAlt: band.alt, className: "statement", "aria-labelledby": "band-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "statement-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "band-title", className: "statement-title", children: p.ctaBand.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "statement-text", children: p.ctaBand.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          p.ctaBand.primary ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: p.ctaBand.primary.href, className: "btn btn--light", children: p.ctaBand.primary.label }) : null,
          p.ctaBand.secondary ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: p.ctaBand.secondary.href, className: "link-arrow link-arrow--on-dark", children: [
            p.ctaBand.secondary.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) : null
        ] })
      ] }) }) }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedRail, { product: p }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: info.title, notes })
  ] });
}
export {
  ProductPage as component
};
