import { r as reactExports, V as jsxRuntimeExports } from "./server-CuIGe7e9.js";
import { p as ArrowIcon, A as AppLink, P as Picture, e as cx, z as CATEGORIES } from "./router-vytYg3Bb.js";
import { P as PeptideLabel } from "./PeptideLabel-DJrIOyEo.js";
function Rail({ label, children, className = "", resetKey }) {
  const ref = reactExports.useRef(null);
  const [edges, setEdges] = reactExports.useState({ start: true, end: false });
  const update = reactExports.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    update();
  }, [resetKey, update]);
  const go = (dir) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth;
    const perView = Math.max(1, Math.floor((el.clientWidth + gap) / step));
    el.scrollBy({ left: dir * step * perView, behavior: reduce ? "auto" : "smooth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rail ${className}`, role: "region", "aria-label": label, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "rail-track", ref, tabIndex: 0, children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Previous", onClick: () => go(-1), disabled: edges.start, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, { dir: "left" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rail-btn", "aria-label": "Next", onClick: () => go(1), disabled: edges.end, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}) })
    ] })
  ] });
}
function ProductMedia({ product, sizes = "(max-width: 760px) 74vw, 310px", className }) {
  if (product.image) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("tile-media", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: product.image, alt: product.imageAlt, sizes, draggable: false }) });
  }
  if (product.identity) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("tile-media tile-media--plate", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.identity, alt: product.imageAlt || product.name, width: 500, height: 152, loading: "lazy", decoding: "async", draggable: false }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("tile-media tile-media--plate", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h3", "aria-hidden": "true", children: product.name }) });
}
function ProductTile({ product, group, href, sizes, as: Tag = "li" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "tile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: href ?? product.href, draggable: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductMedia, { product, sizes }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tile-cap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-group", children: group ?? product.categoryLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-arrow", "aria-hidden": "true", children: "→" })
  ] }) });
}
function PeptideTile({ card, group = "Peptide catalog", href = "/products/peptides", as: Tag = "li" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "tile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href, draggable: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PeptideLabel, { card }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tile-cap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-group", children: group }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: card.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-arrow", "aria-hidden": "true", children: "→" })
  ] }) });
}
function EndTile({ label, href }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "tile tile--end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tile-arrow", "aria-hidden": "true", children: "→" })
  ] }) });
}
const PEPTIDE_NOTE = "For licensed prescribers. Compounded preparations are not FDA-approved.";
const heroSlides = [
  {
    id: "care",
    eyebrow: "Wound care & practice support",
    title: ["Advanced wound care.", "A stronger practice."],
    lead: "Albacete MedDev combines medical product distribution with practice support.",
    primary: { label: "Explore the portfolio", href: "/products" },
    secondary: { label: "Review clinical evidence", href: "/evidence" },
    play: true,
    tiles: [
      { image: "care-hero", alt: "Preparation scene with a clinician, patient, AmCoreMatrix carton and membrane" },
      { image: "microlyte", alt: "Microlyte Matrix navy blue carton with cyan and yellow artwork" },
      { image: "clinical-consult", alt: "Clinician in consultation with a patient and family member" },
      { image: "tri-membrane-wrap", alt: "Tri-Membrane Wrap square membrane displayed on glass" }
    ]
  },
  {
    id: "evidence",
    eyebrow: "The evidence library",
    title: ["Explore the evidence.", "Understand its limits."],
    lead: "Find the source behind the statement. Our library connects products to published research, trial records, regulatory information, and available instructions for use.",
    primary: { label: "Open the evidence library", href: "/evidence" },
    tiles: [
      { image: "clinical-lab", alt: "Scientist examining a sample at a microscope" },
      { image: "evidence-reading", alt: "Clinician reading and taking notes" },
      { image: "apis", alt: "Close view of the amber APIS matrix sheet on glass" },
      { image: "clinical-library", alt: "Clinician reading at a laptop in a library" }
    ]
  },
  {
    id: "software",
    eyebrow: "Clinical software",
    title: ["The wound has depth.", "Now your documentation does too."],
    lead: "Explore wound imaging and discuss how software may fit your workflow.",
    primary: { label: "Clinical software", href: "/software" },
    tiles: [
      { image: "software-scan", alt: "Clinician scanning a dressed wound with a phone" },
      { image: "software-mesh", alt: "Phone showing a three-dimensional wound mesh" },
      { image: "software-review", alt: "Clinician and patient reviewing a tablet" },
      { image: "software-documentation", alt: "Clinician documenting at a laptop beside a patient" }
    ]
  }
];
const offer = [
  { label: "Medical products", href: "/products" },
  { label: "Revenue cycle management", href: "/services/revenue-cycle" },
  { label: "Consulting", href: "/services/consulting" },
  { label: "Clinical software", href: "/software" }
];
const marqueeNames = [
  "Palisade",
  "Sentry SL",
  "APIS",
  "AmchoPlast",
  "Interfyl",
  "XCelliStem",
  "ActiGraft",
  "UltraMIST",
  "Arobella Qoustic",
  "Membrane Wrap",
  "Microlyte SAM",
  "Myriad Matrix",
  "PalinGen Membrane",
  "Resolve Matrix",
  "XCell Amnio Matrix"
];
const productsHead = {
  eyebrow: "Products & solutions",
  title: "Explore the possibilities.",
  link: { label: "View the full portfolio", href: "/products" }
};
const categoryCards = [
  {
    id: "membranes",
    eyebrow: "Matrices & membranes",
    title: "Understand the material.",
    text: "Explore sheet, flowable, and particulate options with product-specific information.",
    cta: { label: "Placental membranes", href: "/products#sheet-skin-substitutes" },
    image: "amchoplast",
    alt: "AmchoPlast purple and white package in natural daylight",
    tone: "dark"
  },
  {
    id: "devices",
    eyebrow: "Wound care devices",
    title: "Explore the technology.",
    text: "Review ultrasonic debridement, non-contact ultrasound, and negative pressure wound therapy.",
    cta: { label: "Wound care devices", href: "/products#conservative-wound-care" },
    image: "ultramist",
    alt: "SANUWAVE UltraMIST unit with its handpiece docked",
    tone: "dark"
  },
  {
    id: "autologous",
    eyebrow: "Autologous options",
    title: "Consider another approach.",
    text: "Learn about ActiGraft and its use of the patient’s own blood in a point-of-care system.",
    cta: { label: "Autologous wound care", href: "/products#blood-based-skin-substitutes" },
    image: "actigraft",
    alt: "Closed ActiGraft PRO kit with magenta and white packaging",
    tone: "dark"
  }
];
const peptidePanel = {
  eyebrow: "Peptides",
  title: "Two channels, one ordering relationship.",
  text: "Review the catalog, available channels, and product-specific regulatory information.",
  cta: { label: "Peptide catalog", href: "/products/peptides" },
  /** Catalog entry whose labeled vial picture fronts the panel. */
  cardKey: "nad"
};
const members = (id) => CATEGORIES.find((c) => c.id === id)?.members.map((m) => m.slug) ?? [];
const railTabs = [
  { id: "membranes", num: "01", label: "Matrices & membranes", products: [...members("sheet-skin-substitutes"), ...members("non-sheet-skin-substitutes")], peptides: [] },
  { id: "devices", num: "02", label: "Wound care devices", products: members("conservative-wound-care"), peptides: [] },
  { id: "autologous", num: "03", label: "Autologous options", products: members("blood-based-skin-substitutes"), peptides: [] },
  { id: "peptides", num: "04", label: "Peptides", products: [], peptides: ["nad", "tesamorelin", "ghk-cu", "glutathione"] }
];
const railEnd = { label: "View the full portfolio", href: "/products" };
const approach = {
  eyebrow: "Our approach",
  title: "Every connection supports care.",
  text: "Products, clinical resources and practice operations. One place to start a more informed conversation.",
  cta: { label: "Talk with our team", href: "/contact" },
  image: "clinical-consult",
  alt: "Clinician in consultation with a patient and family member"
};
const story = {
  eyebrow: "A clinical starting point",
  title: "Start with the questions that matter.",
  body: "A product name is only the beginning. We bring the clinical information and practical considerations into the same conversation.",
  link: { label: "Explore the scientific portfolio", href: "/scientific-portfolio" },
  steps: [
    {
      num: "01",
      title: "What is the product designed to do?",
      text: "Review the product’s composition, intended use, instructions, and application requirements before considering its fit.",
      cta: { strong: "Evaluate a product", sub: "Explore formats, uses & resources", href: "/products" },
      image: "apis",
      alt: "Close view of the amber APIS matrix sheet on glass"
    },
    {
      num: "02",
      title: "What does the evidence actually show?",
      text: "Look at study design, patient population, outcomes, and limitations. Distinguish evidence for a specific product from research on its broader class.",
      cta: { strong: "Understand the evidence", sub: "Find studies & their limitations", href: "/evidence" },
      image: "evidence-reading",
      alt: "Clinician reading and taking notes"
    },
    {
      num: "03",
      title: "How would it fit into your practice?",
      text: "Discuss training, ordering, documentation, and reimbursement questions alongside your existing care pathway.",
      cta: { strong: "Support your practice", sub: "Review operations & revenue cycle", href: "/services" },
      image: "practice-supply",
      alt: "Practice staff reviewing supplies together"
    }
  ]
};
const services = {
  eyebrow: "Beyond the product",
  title: "Support for the practice around it.",
  aside: "Build a conversation around your actual workflow, from product evaluation to the details of daily operations.",
  cta: { label: "Discuss your practice", href: "/contact" },
  cards: [
    { eyebrow: "Revenue cycle", title: "Make the process clearer.", text: "Review coding, documentation, claims, and denial workflows.", cta: { label: "Revenue cycle management", href: "/services/revenue-cycle" }, image: "services-billing", alt: "Practice administrator reviewing claims on a monitor", tone: "dark" },
    { eyebrow: "Practice consulting", title: "Plan the next step.", text: "Explore product evaluation, practice operations, and service development.", cta: { label: "Consulting", href: "/services/consulting" }, image: "services-consulting", alt: "Consultant walking with a clinician in a practice corridor", tone: "dark" },
    { eyebrow: "Ovena Health", title: "Continue the conversation at home.", text: "Discover wound care and compression supplies for patients and caregivers.", cta: { label: "Ovena Health", href: "/amazon-store" }, image: "ovena", alt: "Ovena wound care kit in a home care setting", tone: "dark" }
  ]
};
const software = {
  eyebrow: "Software & workflow",
  title: "See the tools in context.",
  text: "Explore wound imaging and discuss how software may fit your workflow.",
  cta: { label: "Clinical software", href: "/software" },
  image: "software-mesh",
  alt: "Phone showing a three-dimensional wound mesh"
};
const evidence = {
  eyebrow: "The evidence library",
  title: "Go beyond the headline.",
  body: "Find the source behind the statement. Our library connects products to published research, trial records, regulatory information, and available instructions for use.",
  cards: [
    { label: "Evidence library", title: "Explore the evidence. Understand its limits.", text: "A scientific portfolio is only useful if it grades its own products the way a payer or a skeptical clinician would.", href: "/evidence", linkLabel: "Open the evidence library", image: "clinical-library", alt: "Clinician reading at a laptop in a library" },
    { label: "Scientific portfolio", title: "Scientific portfolio.", text: "Explore the products by material and format, inspect the manufacturer references, and read the research behind them.", href: "/scientific-portfolio", linkLabel: "Explore the scientific portfolio", image: "exosomes", alt: "Scientist examining a sample in a laboratory" }
  ]
};
const closing = {
  eyebrow: "Let’s start with your practice",
  title: "What are you working toward?",
  body: "Bring a product question, a workflow challenge, or an idea for your wound care program. We’ll help you identify the next step.",
  cta: { label: "Talk with our team", href: "/contact" },
  image: "services-review",
  alt: "Two people reviewing documents together at a table"
};
const info = {
  title: "Important information",
  notes: [
    "Product selection remains a clinical decision. Review the current manufacturer instructions and patient-specific considerations.",
    "Evidence grades are an editorial guide. They do not establish clinical suitability or insurance coverage."
  ]
};
export {
  EndTile as E,
  PEPTIDE_NOTE as P,
  Rail as R,
  productsHead as a,
  PeptideTile as b,
  categoryCards as c,
  ProductTile as d,
  railEnd as e,
  approach as f,
  services as g,
  heroSlides as h,
  info as i,
  software as j,
  evidence as k,
  closing as l,
  marqueeNames as m,
  offer as o,
  peptidePanel as p,
  railTabs as r,
  story as s
};
