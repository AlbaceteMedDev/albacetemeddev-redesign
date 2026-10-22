import { V as jsxRuntimeExports } from "./server-DM2Y2zLv.js";
import { e as cx, A as AppLink, P as Picture, M as CATEGORY_BY_ID, u as PRODUCT_BY_SLUG, S as SectionHead } from "./router-B1KkamcG.js";
import { R as Rail, d as ProductTile, E as EndTile } from "./home-DJdpE8Hb.js";
const altFor = (p) => p.imageAlt && p.imageAlt !== "Albacete MedDev" ? p.imageAlt : p.name;
function ProductPicture({ product, sizes, priority, variant = "main", className }) {
  const ref = variant === "reference" ? product.reference : null;
  if (ref) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx("pmedia pmedia--plate", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: ref, alt: altFor(product), sizes, priority }),
      product.imageCaption ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pmedia-cap", children: product.imageCaption }) : null
    ] });
  }
  if (product.image) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("pmedia", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: product.image, alt: altFor(product), sizes, priority }) });
  }
  if (product.identity) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("pmedia pmedia--plate", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.identity, alt: altFor(product), width: 500, height: 152, loading: priority ? "eager" : "lazy", decoding: "async" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("pmedia pmedia--name", className), role: "img", "aria-label": product.name, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: product.name }) });
}
function Facts({ items, tone = "grey" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "facts", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: cx("fact", tone === "white" && "fact--white"), children: [
    it.tag ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fact-tag", children: it.tag }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: it.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: it.text })
  ] }, it.title)) });
}
function Faq({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "faq", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: it.q }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "faq-a", children: it.a })
  ] }, it.q)) });
}
function ProductCard({ href, maker, name, text, note, media, external }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "prod", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prod-media", children: media }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prod-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "prod-maker", children: maker }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "prod-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href, className: "stretch", children: name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "prod-text", children: text }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prod-foot", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "prod-note", children: note ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "prod-arrow", "aria-hidden": "true", children: external ? "↗" : "→" })
      ] })
    ] })
  ] });
}
function RelatedRail({ product }) {
  const cat = CATEGORY_BY_ID[product.category];
  if (!cat) return null;
  const others = cat.members.filter((m) => m.slug !== product.slug).map((m) => PRODUCT_BY_SLUG[m.slug]).filter((p) => Boolean(p));
  if (!others.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section section--tight", "aria-labelledby": "related-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "related-title", eyebrow: cat.label, title: cat.text, link: { label: "View the full portfolio", href: `/products#${cat.id}` } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Rail, { label: cat.label, children: [
      others.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductTile, { product: p }, p.slug)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EndTile, { label: "View the full portfolio", href: "/products" })
    ] })
  ] }) });
}
export {
  Facts as F,
  ProductCard as P,
  RelatedRail as R,
  Faq as a,
  ProductPicture as b,
  altFor as c
};
