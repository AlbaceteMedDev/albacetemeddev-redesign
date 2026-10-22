import { V as jsxRuntimeExports } from "./server-8tMNU4vV.js";
import { C as CompanyHero, D as revenueCycle, S as SectionHead, R as Reveal, d as Panel } from "./router-feRooyJ-.js";
import { c as Checklist, O as Outline, P as Process, C as Cards, d as Chips, b as ClosingPhoto } from "./Blocks-C63Axk7n.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...revenueCycle.hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "problem", "aria-labelledby": "problem-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "problem-title", className: "co-intro", title: revenueCycle.problem.title, aside: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose", children: revenueCycle.problem.paragraphs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: p }, p)) }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "promise-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", className: "co-two", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "promise-title", children: revenueCycle.promise.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: revenueCycle.promise.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Checklist, { items: revenueCycle.promise.list })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outline, { title: revenueCycle.promise.outline.title, items: revenueCycle.promise.outline.items })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section--flush", id: "process", "aria-labelledby": "process-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "process-title", title: revenueCycle.process.title, lead: revenueCycle.process.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Process, { image: revenueCycle.process.image, alt: revenueCycle.process.alt, steps: revenueCycle.process.steps }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", "aria-labelledby": "findings-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "findings-title", title: revenueCycle.findings.title, lead: revenueCycle.findings.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cards, { items: revenueCycle.findings.cards, cols: 4, white: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", "aria-labelledby": "settings-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "settings-title", title: revenueCycle.settings.title, lead: revenueCycle.settings.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Chips, { items: revenueCycle.settings.items }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClosingPhoto, { ...revenueCycle.closing })
  ] });
}
export {
  Page as component
};
