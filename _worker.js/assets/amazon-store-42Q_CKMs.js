import { V as jsxRuntimeExports, r as reactExports } from "./server-DM2Y2zLv.js";
import { d as Panel, A as AppLink, S as SectionHead, R as Reveal, I as InfoBand, P as Picture, n as ArrowIcon } from "./router-B1KkamcG.js";
import { F as Facts, a as Faq } from "./shared-Bln7t5AS.js";
import { i as info } from "./home-DJdpE8Hb.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./PeptideLabel-DQHUCFac.js";
const OVENA_GALLERY = {
  "sterile-saline": {
    name: "Care Wash Sterile Saline Wound Wash",
    asin: "B0HHMXT8TX",
    main: "ovena-care-wash-main",
    gallery: ["ovena-care-wash-01", "ovena-care-wash-02", "ovena-care-wash-03", "ovena-care-wash-04", "ovena-care-wash-05", "ovena-care-wash-06", "ovena-care-wash-07", "ovena-care-wash-08", "ovena-care-wash-09", "ovena-care-wash-10"]
  },
  "collagen-powder": {
    name: "Collagen Wound Powder",
    asin: "B0H8N6Y5VW",
    main: "ovena-collagen-powder-main",
    gallery: ["ovena-collagen-powder-01", "ovena-collagen-powder-02", "ovena-collagen-powder-03", "ovena-collagen-powder-04", "ovena-collagen-powder-05", "ovena-collagen-powder-06", "ovena-collagen-powder-07", "ovena-collagen-powder-08", "ovena-collagen-powder-09", "ovena-collagen-powder-10"]
  },
  "collagen-dressing": {
    name: "Collagen Wound Dressing",
    asin: "B0HDCRM2WW",
    main: "ovena-collagen-dressing-main",
    gallery: ["ovena-collagen-dressing-01", "ovena-collagen-dressing-02", "ovena-collagen-dressing-03", "ovena-collagen-dressing-04", "ovena-collagen-dressing-05", "ovena-collagen-dressing-06", "ovena-collagen-dressing-07", "ovena-collagen-dressing-08", "ovena-collagen-dressing-09", "ovena-collagen-dressing-10"]
  },
  "collagen-kit": {
    name: "Collagen Wound Care Dressing Kit",
    asin: null,
    main: "ovena-collagen-kit-main",
    gallery: ["ovena-collagen-kit-01", "ovena-collagen-kit-02", "ovena-collagen-kit-03", "ovena-collagen-kit-04", "ovena-collagen-kit-05", "ovena-collagen-kit-06", "ovena-collagen-kit-07", "ovena-collagen-kit-08", "ovena-collagen-kit-09", "ovena-collagen-kit-10", "ovena-collagen-kit-11", "ovena-collagen-kit-12", "ovena-collagen-kit-13", "ovena-collagen-kit-14", "ovena-collagen-kit-15", "ovena-collagen-kit-16", "ovena-collagen-kit-17", "ovena-collagen-kit-18"]
  },
  "hydrocolloid-roll": {
    name: "Hydrocolloid Roll",
    asin: "B0H949P7JW",
    main: "ovena-hydrocolloid-roll-main",
    gallery: ["ovena-hydrocolloid-roll-01", "ovena-hydrocolloid-roll-02", "ovena-hydrocolloid-roll-03", "ovena-hydrocolloid-roll-04", "ovena-hydrocolloid-roll-05", "ovena-hydrocolloid-roll-06", "ovena-hydrocolloid-roll-07", "ovena-hydrocolloid-roll-08", "ovena-hydrocolloid-roll-09", "ovena-hydrocolloid-roll-10"]
  },
  "sock-aid": {
    name: "Sock Aid",
    asin: "B0HC5X78B1",
    main: "ovena-sock-aid-main",
    gallery: ["ovena-sock-aid-01", "ovena-sock-aid-02", "ovena-sock-aid-03", "ovena-sock-aid-04", "ovena-sock-aid-05", "ovena-sock-aid-06", "ovena-sock-aid-07", "ovena-sock-aid-08", "ovena-sock-aid-09", "ovena-sock-aid-10"]
  },
  "compression-socks": {
    name: "20-30 mmHg Knee-High Compression Socks",
    asin: "B0H8ZJPGL8",
    main: "ovena-compression-socks-main",
    gallery: ["ovena-compression-socks-01", "ovena-compression-socks-02", "ovena-compression-socks-03", "ovena-compression-socks-04", "ovena-compression-socks-05", "ovena-compression-socks-06", "ovena-compression-socks-07", "ovena-compression-socks-08", "ovena-compression-socks-09", "ovena-compression-socks-10"]
  }
};
const ovenaGalleryFor = (handle) => OVENA_GALLERY[handle];
const ovenaMainAlt = (name) => `Ovena Health ${name} — main product picture`;
const ovenaPhotoAlt = (name, n) => `Ovena Health ${name} — photo ${n}`;
const STORE = "https://www.ovenahealth.com";
const AMAZON_STORE = "https://www.amazon.com/stores/OvenaHealth/page/D6AE90DA-CBED-4BB0-A25F-18FA9E66C8F8";
const HIDDEN = ["juzo-thigh-high-compression-stockings-closed-toe", "juzo-thigh-high-compression-stockings-open-toe", "juzo-knee-high-compression-socks-open-toe", "knee-high-compression-socks-closed-toe"];
const money = (v) => "$" + Number(v).toFixed(2);
const addLink = (id) => `${STORE}/cart/add?id=${encodeURIComponent(String(id))}&quantity=1&return_to=%2Fcart`;
const MAIN_SIZES = "(max-width: 560px) calc(100vw - 64px), (max-width: 1023px) 46vw, 320px";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function OvenaStrip({
  entry,
  onOpen
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState({
    lead: 1,
    start: true,
    end: false
  });
  const total = entry.gallery.length;
  const metrics = (el) => {
    const first = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth;
    return {
      step: step || 1,
      gap
    };
  };
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const {
        step
      } = metrics(el);
      const max = el.scrollWidth - el.clientWidth;
      setPos({
        lead: Math.min(total, Math.max(1, Math.round(el.scrollLeft / step) + 1)),
        start: el.scrollLeft <= 2,
        end: el.scrollLeft >= max - 2
      });
    };
    update();
    el.addEventListener("scroll", update, {
      passive: true
    });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [total]);
  const go = (dir) => {
    const el = ref.current;
    if (!el) return;
    const {
      step,
      gap
    } = metrics(el);
    const perView = Math.max(1, Math.floor((el.clientWidth + gap) / step));
    el.scrollBy({
      left: dir * step * perView,
      behavior: reduceMotion() ? "auto" : "smooth"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-strip", role: "region", "aria-label": `More photos of ${entry.name}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ov-strip-track", ref, tabIndex: 0, children: entry.gallery.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ov-thumb", onClick: () => onOpen(i + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: img, alt: ovenaPhotoAlt(entry.name, i + 1), sizes: "104px" }) }) }, img)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-strip-nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-strip-arrows", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Previous photos", onClick: () => go(-1), disabled: pos.start, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, { dir: "left" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Next photos", onClick: () => go(1), disabled: pos.end, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ov-strip-count", children: [
        pos.lead,
        " / ",
        total
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "link-arrow ov-strip-all", onClick: () => onOpen(0), children: [
        "View all ",
        total + 1,
        " photos ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] })
    ] })
  ] });
}
function OvenaLightbox({
  entry,
  open,
  onClose
}) {
  const ref = reactExports.useRef(null);
  const track = reactExports.useRef(null);
  const [cur, setCur] = reactExports.useState(0);
  const photos = [entry.main, ...entry.gallery];
  const last = photos.length - 1;
  const go = reactExports.useCallback((dir) => {
    const t = track.current;
    if (!t) return;
    t.scrollBy({
      left: dir * t.clientWidth,
      behavior: reduceMotion() ? "auto" : "smooth"
    });
  }, []);
  reactExports.useEffect(() => {
    const d = ref.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    document.documentElement.classList.add("ov-lb-open");
    const t = track.current;
    if (t) t.scrollTo({
      left: open.at * t.clientWidth,
      behavior: "auto"
    });
    setCur(open.at);
    const keys = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab") {
        const items = [...d.querySelectorAll("button:not([disabled])")];
        if (!items.length) return;
        const first = items[0];
        const last2 = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !d.contains(active))) {
          e.preventDefault();
          last2.focus();
        } else if (!e.shiftKey && (active === last2 || !d.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [open, go]);
  const close = () => ref.current?.close();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("dialog", { ref, className: "ov-lb", "aria-label": `Photos of ${entry.name}`, onClose: () => {
    document.documentElement.classList.remove("ov-lb-open");
    onClose();
  }, onClick: (e) => {
    if (e.target === ref.current) close();
  }, children: open ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-lb-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-lb-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ov-lb-title", children: entry.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ov-lb-count", "aria-live": "polite", children: [
        cur + 1,
        " / ",
        photos.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn ov-lb-close", "aria-label": "Close", onClick: close, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", width: "18", height: "18", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 5l10 10M15 5 5 15", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-lb-track", ref: track, onScroll: (e) => {
      const t = e.currentTarget;
      setCur(Math.min(last, Math.max(0, Math.round(t.scrollLeft / t.clientWidth))));
    }, children: photos.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-lb-slide", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: img, alt: i === 0 ? ovenaMainAlt(entry.name) : ovenaPhotoAlt(entry.name, i), sizes: "(max-width: 1100px) 96vw, 1040px" }) }, img)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-lb-nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Previous photo", onClick: () => go(-1), disabled: cur === 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, { dir: "left" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Next photo", onClick: () => go(1), disabled: cur === last, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}) })
    ] })
  ] }) : null });
}
function OvenaCard({
  p
}) {
  const url = `${STORE}/products/${encodeURIComponent(p.handle)}`;
  const variants = p.variants.filter((v) => v && v.id);
  const [current, setCurrent] = reactExports.useState(() => variants.find((v) => v.available) ?? variants[0]);
  const gallery = ovenaGalleryFor(p.handle);
  const [lb, setLb] = reactExports.useState(null);
  const openAt = (at) => setLb((s) => ({
    at,
    seq: (s?.seq ?? 0) + 1
  }));
  if (!current) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "ov-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "ov-media", href: url, target: "_blank", rel: "noopener", children: gallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: gallery.main, alt: p.title, sizes: MAIN_SIZES }) : p.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.title, loading: "lazy", decoding: "async", width: 600, height: 600 }) : null }),
    gallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(OvenaStrip, { entry: gallery, onOpen: openAt }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-body", children: [
      p.type ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-type", children: p.type }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ov-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: url, target: "_blank", rel: "noopener", children: p.title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-row", children: [
        variants.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ov-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sr-only", children: [
            "Option for ",
            p.title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: String(current.id), onChange: (e) => setCurrent(variants.find((v) => String(v.id) === e.target.value) ?? current), children: variants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(v.id), children: v.title + (v.available ? "" : " — sold out") }, String(v.id))) })
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-price", children: money(current.price) })
      ] }),
      current.available ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "btn btn--primary", href: addLink(current.id), target: "_blank", rel: "noopener", children: [
        "Add to cart ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "btn btn--primary is-disabled", "aria-disabled": "true", children: "Sold out" })
    ] }),
    gallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(OvenaLightbox, { entry: gallery, open: lb, onClose: () => setLb(null) }) : null
  ] });
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sr-only", role: "status", children: "Loading the Ovena Health catalog…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-grid ov-skel", "aria-hidden": "true", children: Array.from({
      length: 8
    }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-media" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ov-strip", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-strip-track", children: Array.from({
          length: 4
        }, (_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-thumb" }, j)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-strip-nav", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-bar ov-skel-count" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ov-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-bar ov-skel-type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-bar ov-skel-title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-bar ov-skel-title ov-skel-title--2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-bar ov-skel-price" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ov-skel-btn" })
      ] })
    ] }, i)) })
  ] });
}
function OvenaStore() {
  const [state, setState] = reactExports.useState({
    status: "loading",
    products: []
  });
  reactExports.useEffect(() => {
    let settled = false;
    const ctrl = new AbortController();
    const slow = window.setTimeout(() => {
      if (!settled) setState((s) => s.status === "loading" ? {
        status: "fallback",
        products: []
      } : s);
    }, 8e3);
    fetch("/api/ovena-products", {
      headers: {
        accept: "application/json"
      },
      signal: ctrl.signal
    }).then((r) => {
      if (!r.ok) throw new Error("feed " + r.status);
      return r.json();
    }).then((data) => {
      settled = true;
      window.clearTimeout(slow);
      const list = (Array.isArray(data.products) ? data.products : []).filter((p) => !HIDDEN.includes(p.handle) && Array.isArray(p.variants));
      setState(list.length ? {
        status: "ready",
        products: list
      } : {
        status: "fallback",
        products: []
      });
    }).catch(() => {
      settled = true;
      window.clearTimeout(slow);
      setState((s) => s.status === "ready" ? s : {
        status: "fallback",
        products: []
      });
    });
    return () => {
      ctrl.abort();
      window.clearTimeout(slow);
    };
  }, []);
  if (state.status === "loading") return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {});
  if (state.status === "fallback") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ov-fallback", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The live catalog is taking a moment to load." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "btn btn--primary", href: STORE, target: "_blank", rel: "noopener", children: [
        "Open ovenahealth.com ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ov-grid", children: state.products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(OvenaCard, { p }, p.handle)) });
}
const FITS = [{
  tag: "Clinician-led",
  title: "Physician-led by design",
  text: "Medical-director-led by Dr. David Chahine, MD — board-certified, with experience across hospital, home health, skilled nursing, wound care and aesthetic medicine. “I joined Ovena because patients and physicians deserve better.”"
}, {
  tag: "Organized for home",
  title: "Clear formats, honest labels",
  text: "Two dressing sizes, one powder, one roll — “choices you can actually make.” Kits that turn clinical routines into manageable ones, with plain-language guidance behind every product."
}, {
  tag: "Built for scale",
  title: "One box to a thousand",
  text: "“Clinical-grade collagen, compression, and hydrocolloid supply, from one box to a thousand.” The same products flow from single-patient orders to facility and agency volume programs."
}];
const TRUST = ["Physician-led", "510(k) cleared", "Free shipping $75+", "FSA/HSA eligible (Truemed)", "US shipping, 30-day returns, 1–2 day processing from Westlake Village, CA."];
const AMAZON = [{
  chips: ["In stock", "Hydrocolloid"],
  title: "Hydrocolloid Roll — 2 in × 5 ft",
  mech: "Cut-to-size hydrocolloid: 700+ patches from one roll. Latex-free, hypoallergenic, waterproof.",
  uses: "Blisters, friction spots, minor cuts and abrasions, blemishes — trimmed round, long or square to the wound.",
  href: "https://www.amazon.com/dp/B0H8ZH3J9R",
  label: "View on Amazon — $8.99"
}, {
  chips: ["In stock", "Hydrocolloid"],
  title: "Hydrocolloid Roll — 2 in × 16 ft",
  mech: "The volume format: 2,300+ cut-to-size patches per roll.",
  uses: "Same medical-grade hydrocolloid, sized for households and caregiving routines that go through patches quickly.",
  href: "https://www.amazon.com/dp/B0H949P7JW",
  label: "View on Amazon — $14.39"
}, {
  chips: ["M / L / XL", "Compression"],
  title: "Compression Socks — 20-30 mmHg",
  mech: "Medical-grade graduated compression, knee-high, black.",
  uses: "Daily edema management and venous support — nurses, flying, travel, pregnancy. Moisture-wicking with reinforced heel and toe.",
  href: "https://www.amazon.com/dp/B0H8ZVQPPB",
  label: "View on Amazon — $22.49/pair"
}, {
  chips: ["In stock", "Accessory"],
  title: "Sock Aid — flexible donning helper",
  mech: "Ergonomic 9.5-inch donning aid for compression socks.",
  uses: "Less bending, easier reach — the accessory that makes 20-30 mmHg compression usable for the patients who need it most.",
  href: "https://www.amazon.com/dp/B0HC5X78B1",
  label: "View on Amazon — $14.99"
}];
const CATALOG = [{
  k: "Collagen dressing",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "2×2 ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$32.99" }),
    " · 4×4 ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$55" }),
    " — 510(k)-cleared, Type I bovine"
  ] })
}, {
  k: "Collagen powder",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$67.99" }),
    " single-use packets — 510(k)-cleared"
  ] })
}, {
  k: "Collagen kit",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$36.99–$59.99" }),
    " complete dressing change"
  ] })
}, {
  k: "Hydrocolloid roll",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "5 ft ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$7.99" }),
    " · 16 ft ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$12.99" })
  ] })
}, {
  k: "Compression socks",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$24.99" }),
    "/pair · S–XL · 20-30 mmHg"
  ] })
}, {
  k: "Saline wound wash",
  v: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$15.99" }),
    " sterile first step"
  ] })
}, {
  k: "Sock aid",
  v: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "$14.99" })
}];
const WHY = [{
  lead: "A discharge answer.",
  text: "Patients leave with a specific, affordable product path instead of a drugstore guess — the same materials their wound was managed with."
}, {
  lead: "Bulk & facility pricing.",
  text: "Home health agencies and facilities buy the same catalog at volume through Ovena’s bulk-orders program."
}, {
  lead: "Education built in.",
  text: "Collagen 101, Compression 101, Hydrocolloid 101 and a care quiz — plain-language guidance your staff doesn’t have to write."
}, {
  lead: "FSA/HSA rails.",
  text: "Truemed-eligible products lower the patient’s real out-of-pocket."
}];
const FAQ = [{
  q: "How is Ovena Health related to Albacete MedDev?",
  a: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "Ovena Health is the ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "direct-to-patient brand" }),
    " in the Albacete MedDev family. Albacete MedDev supplies and supports clinical practices; Ovena carries the same clinical standards to patients at home — through ovenahealth.com and the Amazon Brand Store."
  ] })
}, {
  q: "What should patients buy on Amazon vs. ovenahealth.com?",
  a: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "Amazon carries the hydrocolloid rolls, compression socks (M/L/XL) and the sock aid with Prime convenience. The ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "collagen line" }),
    " — dressings, powder, kits — plus saline and full size runs sell on ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "ovenahealth.com" }),
    ", which also offers free shipping over $75 and FSA/HSA checkout."
  ] })
}, {
  q: "Are Ovena products actually clinical-grade?",
  a: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "The collagen dressing line and collagen powder are ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "FDA 510(k)-cleared" }),
    ", and the brand states ISO 13485 manufacturing with physician review across the catalog — “FDA 510(k)-cleared where applicable, honest labels.” Compression is medical-grade 20-30 mmHg graduated knee-high."
  ] })
}, {
  q: "Can a practice or agency buy at volume?",
  a: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "Yes — Ovena runs a ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "bulk-orders program" }),
    " for facilities and home-health agencies (“from one box to a thousand”), and Albacete MedDev can fold Ovena supply into a broader practice partnership. ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: "/contact", children: "Talk to us" }),
    " about facility pricing."
  ] })
}];
function AmazonStorePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide section section--tight stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", image: "ovena", imageAlt: "Ovena wound care kit in a home care setting", scrim: "left", priority: true, className: "phero-photo", "aria-labelledby": "ov-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: "/products", className: "phero-back", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "←" }),
          " All products"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ov-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: STORE, target: "_blank", rel: "noopener", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/brand/ovena-logo.png", alt: "Ovena Health — open ovenahealth.com in a new tab", height: 28 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: "E-commerce wound care store · Also on Amazon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "ov-title", className: "phero-title", children: "Ovena Health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "phero-deck", children: "Practical wound care and compression supplies for care beyond the clinic." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#ovena-shop", className: "btn btn--light", children: "Shop now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: "/contact/?products=ovena", className: "link-arrow link-arrow--on-dark", children: [
            "Discuss this product ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "grey", id: "ovena-shop", "aria-label": "Ovena Health store", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { eyebrow: "Ovena Health store", title: "Shop now", link: {
          label: "Source information",
          href: STORE
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "ovena-products", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OvenaStore, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ov-note", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cart and checkout complete securely on ovenahealth.com." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: STORE, className: "link-arrow", target: "_blank", rel: "noopener", children: [
            "Open the full store ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", "aria-labelledby": "fits-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "fits-title", eyebrow: "Where Ovena fits", title: "The patient-facing arm of a clinical portfolio.", lead: "Albacete MedDev serves practices; Ovena Health serves the patients those practices send home. Same clinical standards — FDA 510(k)-cleared collagen where applicable, ISO 13485 manufacturing, physician review — packaged and priced for home care." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Facts, { items: FITS }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "trust", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Trust markers, as Ovena states them:" }),
          TRUST.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            i > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trust-sep", children: "· " }) : null,
            t
          ] }, t))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "grey", "aria-labelledby": "amazon-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "amazon-title", eyebrow: "On Amazon now", title: "The Amazon Brand Store lineup.", lead: "Six buyable listings today across hydrocolloid and compression — the wound-care collagen line sells direct on ovenahealth.com. Prices shown are Amazon list prices as verified 2026-08-17 and can change." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "am-grid", children: AMAZON.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "am-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pep-chips", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-chip pep-chip--ok", children: a.chips[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pep-chip pep-chip--ch", children: a.chips[1] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: a.mech }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: a.uses }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "link-arrow", href: a.href, target: "_blank", rel: "noopener", children: [
            a.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
          ] })
        ] }, a.href)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "btn btn--primary", href: AMAZON_STORE, target: "_blank", rel: "noopener", children: [
          "Browse the full Brand Store ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", "aria-labelledby": "flagship-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "flagship-title", eyebrow: "On ovenahealth.com", title: "The full line lives on the flagship store.", lead: "The collagen wound-care line — the clinical heart of the brand — sells direct on ovenahealth.com alongside compression and hydrocolloid, with bulk and facility pricing for practices." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flag", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flag-panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "h3", children: "Catalog & pricing (site)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "spec", children: CATALOG.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: r.k }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: r.v })
            ] }, r.k)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flag-panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "h3", children: "Why practices care" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: WHY.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: w.lead }),
              " ",
              w.text
            ] }, w.lead)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "btn btn--outline", href: "https://ovenahealth.com/pages/bulk-orders", target: "_blank", rel: "noopener", children: [
              "Bulk & facility pricing ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "grey", id: "faq", "aria-labelledby": "faq-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "faq-title", eyebrow: "Common questions", title: "Ovena Health, answered." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { items: FAQ })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", scrim: "center", image: "practice-supply", imageAlt: "Practice staff reviewing supplies together", className: "statement", "aria-labelledby": "cta-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "statement-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: "Two storefronts, one standard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "cta-title", className: "statement-title", children: "Send patients somewhere you trust." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "statement-text", children: "Browse the Amazon Brand Store, shop the flagship site, or talk to us about folding Ovena into your discharge and supply workflows." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "btn btn--light", href: AMAZON_STORE, target: "_blank", rel: "noopener", children: [
            "Amazon Brand Store ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "link-arrow link-arrow--on-dark", href: "https://ovenahealth.com", target: "_blank", rel: "noopener", children: [
            "ovenahealth.com ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" })
          ] })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: info.title, notes: ["Product use follows current manufacturer instructions.", ...info.notes] })
  ] });
}
export {
  AmazonStorePage as component
};
