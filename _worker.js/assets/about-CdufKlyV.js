import { V as jsxRuntimeExports } from "./server-BI10_YHG.js";
import { C as CompanyHero, o as about, R as Reveal, a as SplitRow, S as SectionHead } from "./router-DV9njkLu.js";
import { S as Steps, b as ClosingPhoto } from "./Blocks-BbOFtMfj.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...about.hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", "aria-label": about.story.title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "story", title: about.story.title, image: about.story.image, alt: about.story.alt, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose", children: about.story.paragraphs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: p }, p)) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "approach", title: about.approach.title, image: about.approach.image, alt: about.approach.alt, reverse: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose", children: about.approach.paragraphs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: p }, p)) }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section--flush", "aria-labelledby": "how-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "how-title", title: about.process.title, lead: about.process.lead }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Steps, { steps: about.process.steps, cols: 4 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClosingPhoto, { ...about.closing })
  ] });
}
export {
  Page as component
};
