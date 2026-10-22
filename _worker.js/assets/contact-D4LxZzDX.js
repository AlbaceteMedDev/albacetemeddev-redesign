import { V as jsxRuntimeExports, r as reactExports } from "./server-BUpjg61o.js";
import { k as contactPage, A as AppLink, t as topicsFromQuery, l as briefText, m as contact, C as CompanyHero, S as SectionHead, R as Reveal, d as Panel } from "./router-CCpBSQQs.js";
import { b as ClosingPhoto } from "./Blocks-KSqZ5qcj.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function DirectContact() {
  const d = contactPage.direct;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "co-direct", "aria-labelledby": "direct-title", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "direct-title", children: d.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: d.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "co-channels", children: [
      d.channels.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.href, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arrow", "aria-hidden": "true", children: "→" })
      ] }) }, c.label)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: d.hours.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.hours.value })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "co-direct-more", children: [
      d.more.before,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: d.more.portfolio.href, children: d.more.portfolio.label }),
      d.more.middle,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: d.more.why.href, children: d.more.why.label }),
      d.more.after
    ] })
  ] });
}
function Agenda() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-agenda", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { children: contactPage.practice.agenda.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", children: a.time }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.text })
  ] }, a.time)) }) });
}
function ContactForm() {
  const f = contactPage.form;
  const [status, setStatus] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  reactExports.useEffect(() => {
    const ids = topicsFromQuery(window.location.search);
    if (ids.length) setMessage((m) => m || briefText(ids));
  }, []);
  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const v = (id) => {
      const el = form.querySelector("#" + id);
      return el ? el.value.trim() : "";
    };
    const subject = encodeURIComponent(f.subjectPrefix + (v("practice") || v("name") || f.subjectFallback));
    const body = encodeURIComponent("Name: " + v("name") + "\nEmail: " + v("email") + "\nPractice: " + v("practice") + "\nRole: " + v("role") + "\n\n" + v("message"));
    window.location.href = contact.mailto + "?subject=" + subject + "&body=" + body;
    setStatus(f.status);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-form-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reg-note co-note", children: f.note }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "co-form", onSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", children: f.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "name", name: "name", type: "text", autoComplete: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", children: f.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "practice", children: f.practice }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "practice", name: "practice", type: "text", autoComplete: "organization" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "role", children: f.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "role", name: "role", defaultValue: "", children: f.roles.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i === 0 ? "" : r, children: r }, r)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-field co-field--full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "message", children: f.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "message", name: "message", placeholder: f.messagePlaceholder, value: message, onChange: (e) => setMessage(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "btn btn--primary", children: [
          f.submit,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "contact-status", className: "co-status", role: "status", "aria-live": "polite", children: status })
      ] })
    ] })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...contactPage.hero, aside: /* @__PURE__ */ jsxRuntimeExports.jsx(DirectContact, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "your-practice", "aria-labelledby": "practice-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "practice-title", title: contactPage.practice.title, lead: contactPage.practice.text }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone: "grey", className: "co-practice", as: "div", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Agenda, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContactForm, {})
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClosingPhoto, { ...contactPage.closing })
  ] });
}
export {
  Page as component
};
