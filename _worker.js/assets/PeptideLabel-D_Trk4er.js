import { V as jsxRuntimeExports } from "./server-BHvtqigF.js";
import { g as IMG, M as fallbackSrc, N as srcSet } from "./router-B-m2Zwug.js";
function PeptideLabel({ card, sizes = "(max-width: 760px) 76vw, 380px" }) {
  const lab = card.label;
  if (!("image" in lab) || !(lab.image in IMG)) return null;
  const asset = IMG[lab.image];
  const html = `<img src="${fallbackSrc(asset)}" srcset="${srcSet(asset, "webp")}" sizes="${sizes}" width="${asset.width}" height="${asset.height}" alt="" loading="lazy" decoding="async" draggable="false">` + lab.labelHtml;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pepx-media", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pl-frame ${lab.frame}`, "data-cat": card.cat, dangerouslySetInnerHTML: { __html: html } }) });
}
export {
  PeptideLabel as P
};
