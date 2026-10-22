import { V as jsxRuntimeExports } from "./server-8tMNU4vV.js";
import { C as CompanyHero, F as consulting, S as SectionHead, R as Reveal, a as SplitRow, b as StatementPanel } from "./router-feRooyJ-.js";
import { C as Cards, B as Bullets, a as CtaPanel } from "./Blocks-C63Axk7n.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...consulting.hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "advisory", "aria-labelledby": "advisory-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "advisory-title", title: consulting.advisory.title, lead: consulting.advisory.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cards, { items: consulting.advisory.cards, cols: 3 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "closer-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SplitRow, { id: "closer", title: consulting.closer.title, image: consulting.closer.image, alt: consulting.closer.alt, reverse: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: consulting.closer.text }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bullets, { items: consulting.closer.bullets })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "promise-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "promise-title", title: consulting.promise.title, text: consulting.promise.text, cta: consulting.promise.cta, image: consulting.promise.image, alt: consulting.promise.alt }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CtaPanel, { title: consulting.closing.title, text: consulting.closing.text, cta: consulting.closing.cta, secondary: consulting.closing.secondary })
  ] });
}
export {
  Page as component
};
