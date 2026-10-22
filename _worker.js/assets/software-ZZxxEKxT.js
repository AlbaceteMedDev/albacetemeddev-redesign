import { V as jsxRuntimeExports } from "./server-BUpjg61o.js";
import { R as Reveal, c as SOFTWARE, P as Picture, S as SectionHead, d as Panel, b as StatementPanel, I as InfoBand, A as AppLink } from "./router-CCpBSQQs.js";
import { C as ClinicalStyles, H as Html } from "./Html-Dk7uOa5Z.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicalStyles, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "hero", "aria-labelledby": "software-h1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero cl-hero--navy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-crumbs", children: SOFTWARE.hero.crumbs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "software-h1", className: "cl-hero-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.hero.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-hero-lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.hero.lead }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: SOFTWARE.hero.primary.href, className: "btn btn--light cl-ext", target: "_blank", rel: "noopener", children: SOFTWARE.hero.primary.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: SOFTWARE.hero.secondary.href, className: "link-arrow link-arrow--on-dark", children: [
            SOFTWARE.hero.secondary.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-hero-media", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-report", role: "figure", "aria-label": SOFTWARE.report.aria, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: SOFTWARE.report.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sw-chip", children: SOFTWARE.report.chip })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sw-mesh", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: SOFTWARE.report.image, alt: SOFTWARE.report.alt, sizes: "(max-width: 900px) 92vw, 44vw", priority: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "sw-metrics", children: SOFTWARE.report.metrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "sw-k", children: m.k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "sw-v", children: m.v })
        ] }, m.k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sw-pipe", "aria-label": "Pipeline", children: SOFTWARE.report.steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sw-step", children: s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sw-foot", children: SOFTWARE.report.foot.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f }, f)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sw-cap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: SOFTWARE.report.caption }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: SOFTWARE.report.link.href, target: "_blank", rel: "noopener", className: "cl-ext", children: SOFTWARE.report.link.label })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "why", "aria-labelledby": "why-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "why-title", eyebrow: SOFTWARE.why.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.why.title }), aside: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: SOFTWARE.why.aside }), className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-photo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: SOFTWARE.why.image, alt: SOFTWARE.why.alt, sizes: "(max-width: 1440px) 96vw, 1376px" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "cl-grid-3", style: {
        padding: 0,
        listStyle: "none"
      }, children: SOFTWARE.why.cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "cl-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "cl-num", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: c.num }),
          " ",
          c.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: c.text })
      ] }, c.num)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: "platform", "aria-labelledby": "platform-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "platform-title", eyebrow: SOFTWARE.platform.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.platform.title }), aside: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: SOFTWARE.platform.aside }), className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-platform", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-spec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: SOFTWARE.platform.spec.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "spec", children: SOFTWARE.platform.spec.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: r.k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: r.v })
          ] }, r.k)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-posture", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: SOFTWARE.platform.posture.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: SOFTWARE.platform.posture.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "cl-list", children: SOFTWARE.platform.posture.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: it }) }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "sw-framing", html: SOFTWARE.platform.posture.framing })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sw-partners", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: SOFTWARE.platform.partners.eyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: SOFTWARE.platform.partners.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: SOFTWARE.platform.partners.text })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "demo", "aria-labelledby": "demo-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "demo-title", eyebrow: SOFTWARE.demo.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.demo.title }), aside: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: SOFTWARE.demo.aside }), className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sw-pair", children: SOFTWARE.demo.photos.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: p.image, alt: p.alt, sizes: "(max-width: 900px) 92vw, 60vw" }) }, p.image)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-grid-3", children: SOFTWARE.demo.cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "cl-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-num", children: c.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: c.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.cta.href, className: `btn btn--outline${c.cta.href.startsWith("http") ? " cl-ext" : ""}`, target: c.cta.href.startsWith("http") ? "_blank" : void 0, rel: c.cta.href.startsWith("http") ? "noopener" : void 0, children: c.cta.label })
      ] }, c.title)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: "faq", "aria-labelledby": "faq-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "light", className: "panel-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "faq-title", eyebrow: SOFTWARE.faq.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: SOFTWARE.faq.title }), className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-faq", children: SOFTWARE.faq.items.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: f.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "div", className: "cl-faq-a", html: f.a })
      ] }, f.q)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-label": SOFTWARE.cta.eyebrow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "software-cta", eyebrow: SOFTWARE.cta.eyebrow, title: SOFTWARE.cta.title, text: SOFTWARE.cta.text, cta: SOFTWARE.cta.primary, image: SOFTWARE.cta.image, alt: SOFTWARE.cta.alt }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: SOFTWARE.info.title, notes: [...SOFTWARE.info.notes, /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: SOFTWARE.cta.secondary.href, className: "link-arrow cl-ext", target: "_blank", rel: "noopener", children: SOFTWARE.cta.secondary.label }, "site")] })
  ] });
}
export {
  Page as component
};
