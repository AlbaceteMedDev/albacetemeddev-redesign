import { V as jsxRuntimeExports } from "./server-fgfgMKQ2.js";
import { C as CompanyHero, w as whyPartner, S as SectionHead, R as Reveal, a as SplitRow, b as StatementPanel } from "./router-DUDDTNM3.js";
import { C as Cards, B as Bullets, a as CtaPanel } from "./Blocks-BvvOxwoO.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...whyPartner.hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "pillars", "aria-labelledby": "pillars-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "pillars-title", title: whyPartner.pillars.title, lead: whyPartner.pillars.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cards, { items: whyPartner.pillars.cards, cols: 3 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "closer-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SplitRow, { id: "closer", title: whyPartner.closer.title, image: whyPartner.closer.image, alt: whyPartner.closer.alt, reverse: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: whyPartner.closer.text }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bullets, { items: whyPartner.closer.bullets })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "promise-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "promise-title", title: whyPartner.promise.title, text: whyPartner.promise.text, cta: whyPartner.promise.cta, image: whyPartner.promise.image, alt: whyPartner.promise.alt }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CtaPanel, { title: whyPartner.closing.title, text: whyPartner.closing.text, cta: whyPartner.closing.cta, secondary: whyPartner.closing.secondary })
  ] });
}
export {
  Page as component
};
