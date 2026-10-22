import { r as reactExports, V as jsxRuntimeExports } from "./server-BUpjg61o.js";
import { v as selectedTopics, x as servicesHub, R as Reveal, l as briefText, y as consultationHref, T as TOPICS, d as Panel, P as Picture, A as AppLink, e as cx, C as CompanyHero, b as StatementPanel, m as contact } from "./router-CCpBSQQs.js";
import { S as Steps } from "./Blocks-KSqZ5qcj.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function ServicesExplorer() {
  const [selected, setSelected] = reactExports.useState([]);
  const [status, setStatus] = reactExports.useState("");
  const [exportStatus, setExportStatus] = reactExports.useState("");
  const [fallback, setFallback] = reactExports.useState(false);
  const dialogRef = reactExports.useRef(null);
  const picked = selectedTopics(selected);
  const b = servicesHub.brief;
  function toggle(topic) {
    const removing = selected.includes(topic.id);
    const next = removing ? selected.filter((id) => id !== topic.id) : [...selected, topic.id];
    setSelected(next);
    const count = selectedTopics(next).length;
    setStatus(`${topic.title} ${removing ? "removed from" : "added to"} your consultation brief. ${count} ${count === 1 ? "area" : "areas"} selected.`);
  }
  function open() {
    setExportStatus("");
    setFallback(false);
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(briefText(selected));
      setExportStatus(b.copied);
    } catch {
      setFallback(true);
      setExportStatus(b.copyFallback);
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([briefText(selected)], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = b.file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus(b.downloaded);
  }
  function clear() {
    setSelected([]);
    setFallback(false);
    setStatus(b.cleared);
    setExportStatus("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack", children: [
    servicesHub.services.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicePanel, { service: s, reverse: i % 2 === 1, selected, onToggle: toggle }) }, s.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-brief-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: String(picked.length).padStart(2, "0") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-brief-desc", children: picked.length ? picked.map((t) => t.title).join(" · ") : b.placeholder })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn btn--outline", onClick: open, children: [
        b.review,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-sr", "aria-live": "polite", children: status }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dialog", { ref: dialogRef, className: "co-brief", "aria-labelledby": "brief-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-brief-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-brief-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "brief-title", className: "h3", children: b.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-brief-intro", children: b.intro })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn", "aria-label": "Close", onClick: close, children: "×" })
      ] }),
      picked.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "co-brief-items", children: picked.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            t.track,
            " · ",
            t.reviewAreas.join("; ")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn", "aria-label": `Remove ${t.title}`, onClick: () => toggle(t), children: "×" })
      ] }, t.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-brief-empty", children: b.empty }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-brief-export", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn btn--sm btn--outline", disabled: !picked.length, onClick: copy, children: [
          b.copy,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn btn--sm btn--outline", disabled: !picked.length, onClick: download, children: [
          b.download,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↓" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn--sm btn--outline", disabled: !picked.length, onClick: clear, children: b.clear })
      ] }),
      fallback ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "co-brief-fallback", readOnly: true, rows: 10, value: briefText(selected), "aria-label": b.title }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-brief-status", "aria-live": "polite", children: exportStatus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-brief-foot", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: consultationHref(selected), className: "btn btn--primary", children: [
        b.cont,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }) })
    ] }) })
  ] });
}
function ServicePanel({ service: s, reverse, selected, onToggle }) {
  const topics = TOPICS.filter((t) => s.topics.includes(t.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", id: s.id, className: cx("co-service", reverse && "co-service--reverse"), "aria-labelledby": `title-${s.id}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-service-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-service-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: s.image, alt: s.alt, sizes: "(max-width: 900px) 92vw, 44vw" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-service-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: s.eyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: `title-${s.id}`, children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: s.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: s.context }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: s.cta.href, className: "btn btn--primary", children: s.cta.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: s.secondary.href, className: "link-arrow", children: [
            s.secondary.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-scope", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "co-scope-head", children: servicesHub.scope.heading }),
      topics.map((t) => {
        const saved = selected.includes(t.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { id: t.id, className: "co-scope-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "co-scope-name", children: t.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "co-scope-cap", children: t.caption })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "co-scope-toggle", "aria-hidden": "true", children: "+" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-scope-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: servicesHub.scope.review }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: t.reviewAreas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: a }, a)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: servicesHub.scope.deliverable }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t.possibleDeliverable }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: cx("btn btn--sm", saved ? "btn--primary" : "btn--outline"), "aria-pressed": saved, onClick: () => onToggle(t), children: [
                saved ? servicesHub.scope.savedLabel : servicesHub.scope.saveLabel,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: saved ? "−" : "+" })
              ] })
            ] })
          ] })
        ] }, t.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-scope-note", children: servicesHub.scope.note })
    ] })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...servicesHub.hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", "aria-label": "Practice services", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wide", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesExplorer, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section--flush", id: "engagement-process", "aria-labelledby": "process-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "process-title", eyebrow: servicesHub.process.eyebrow, title: servicesHub.process.title, cta: servicesHub.process.cta, image: servicesHub.process.image, alt: servicesHub.process.alt }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Steps, { steps: servicesHub.process.steps }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-labelledby": "direct-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", className: "co-direct-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "direct-title", className: "h2", children: servicesHub.direct.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-direct-links", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: contact.tel, children: [
          contact.phone,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: contact.mailto, children: [
          contact.email,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Page as component
};
