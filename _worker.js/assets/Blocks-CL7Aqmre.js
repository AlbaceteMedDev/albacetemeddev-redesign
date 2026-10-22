import { V as jsxRuntimeExports } from "./server-BHvtqigF.js";
import { e as cx, R as Reveal, d as Panel, A as AppLink, P as Picture } from "./router-B-m2Zwug.js";
function Steps({ steps, cols = 3, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: cx("co-steps", cols === 4 && "co-steps--4", className), children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "co-step", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "co-step-num", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", children: s.num }),
      s.label ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.label }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: s.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: s.text }),
    s.items?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: s.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: it }, it)) }) : null
  ] }, s.num)) });
}
function Process({ image, alt, steps }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-process", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-process-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt, sizes: "(max-width: 900px) 96vw, 42vw" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Steps, { steps })
  ] });
}
function Cards({ items, cols = 4, white }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: cx("co-cards", cols === 3 && "co-cards--3"), children: items.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: cx("co-card", white && "co-card--white"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: c.text })
  ] }, c.title)) });
}
function Chips({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "co-chips", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: it }, it)) });
}
function Checklist({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "co-check", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "✓" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it })
  ] }, it)) });
}
function Outline({ title, items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-outline", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it })
    ] }, it)) })
  ] });
}
function Bullets({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "co-bullets", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: it }, it)) });
}
function CtaPanel({ id = "closing-title", title, text, cta, secondary }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": id, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", className: "co-cta", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id, children: title }),
    text ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: text }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: "btn btn--primary", children: cta.label }),
      secondary ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: secondary.href, className: "link-arrow", children: [
        secondary.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }) : null
    ] })
  ] }) }) });
}
function ClosingPhoto({
  id = "closing-title",
  eyebrow,
  title,
  text,
  cta,
  secondary,
  image,
  alt
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": id, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", scrim: "left", image, imageAlt: alt, className: "cta-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cta-body", children: [
    eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: eyebrow }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id, className: "cta-title", children: title }),
    text ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cta-text", children: text }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: "btn btn--light", children: cta.label }),
      secondary ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: secondary.href, className: "link-arrow link-arrow--on-dark", children: [
        secondary.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }) : null
    ] })
  ] }) }) }) });
}
export {
  Bullets as B,
  Cards as C,
  Outline as O,
  Process as P,
  Steps as S,
  CtaPanel as a,
  ClosingPhoto as b,
  Checklist as c,
  Chips as d
};
