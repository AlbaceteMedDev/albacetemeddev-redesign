import { V as jsxRuntimeExports, r as reactExports } from "./server-BI10_YHG.js";
const css = `/* Clinical page group (/evidence, /scientific-portfolio, /software, /portal).
 * Built on the site tokens in site.css; hoisted into <head> by <ClinicalStyles/>.
 * Prefixes: cl- shared · ev- evidence · sp- scientific portfolio · sw- software · pm- portal preview. */

/* ---------- Shared: static split hero panel (copy | media) ---------- */
.cl-hero { position: relative; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); align-items: center; gap: clamp(16px, 2vw, 32px); min-height: clamp(460px, 40vw, 600px); border-radius: var(--r-panel); overflow: hidden; background: var(--band); }
.cl-hero--navy { background: var(--navy); color: var(--body-inv); }
.cl-hero-copy { padding: clamp(28px, 4.4vw, 64px); padding-right: clamp(8px, 1.5vw, 24px); }
.cl-hero-copy .label { margin-bottom: 18px; }
.cl-hero-title { font-size: clamp(2.1rem, 3.5vw, 3.6rem); line-height: 1.06; letter-spacing: -0.028em; color: var(--ink); }
.cl-hero-title em { font-style: normal; color: var(--accent); }
.cl-hero--navy .cl-hero-title { color: #fff; }
.cl-hero--navy .cl-hero-title em { color: var(--gold); }
.cl-hero-lead { margin-top: 20px; max-width: 50ch; font-size: 18px; line-height: 1.5; color: var(--body); }
.cl-hero--navy .cl-hero-lead { color: var(--body-inv); }
.cl-hero-lead strong { color: var(--ink); font-weight: 600; }
.cl-hero--navy .cl-hero-lead strong { color: #fff; }
.cl-hero-copy .actions { margin-top: 30px; }
.cl-hero-media { position: relative; align-self: stretch; display: grid; align-items: center; padding: clamp(20px, 2.6vw, 36px); padding-left: 0; }
.cl-crumbs { display: flex; flex-wrap: wrap; gap: 6px 10px; margin-bottom: 18px; font: 500 12px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.cl-hero--navy .cl-crumbs { color: var(--muted-inv); }
.cl-crumbs span + span::before { content: "·"; margin-right: 10px; opacity: 0.6; }
.cl-ext::after { content: " ↗"; font-weight: 500; }
.cl-chapter { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; font: 500 12.5px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
.cl-chapter b { font-weight: 500; color: var(--muted); }
.cl-h2 em { font-style: normal; color: var(--accent); }
.cl-mosaic { display: grid; grid-template-columns: 1.4fr 1fr; grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 12px; height: 100%; min-height: 420px; }
.cl-mosaic > * { border-radius: var(--r-card); overflow: hidden; background: var(--card); }
.cl-mosaic > :first-child { grid-row: 1 / 3; }
.cl-mosaic picture, .cl-mosaic img { width: 100%; height: 100%; object-fit: cover; }
.cl-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap); padding-top: 24px; border-top: 1px solid var(--line); }
.cl-stat strong { display: block; font-size: clamp(1.5rem, 2.2vw, 2rem); line-height: 1.1; letter-spacing: -0.02em; color: var(--ink); }
.cl-stat span { display: block; margin-top: 6px; font-size: 14.5px; color: var(--muted); }
.cl-photo { display: block; border-radius: var(--r-panel); overflow: hidden; aspect-ratio: 21 / 9; background: var(--card); }
.cl-photo picture, .cl-photo img { width: 100%; height: 100%; object-fit: cover; }
.cl-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); }
.cl-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); }
.cl-card { display: flex; flex-direction: column; gap: 10px; padding: clamp(22px, 2.2vw, 30px); border-radius: var(--r-card); background: var(--band); }
.cl-card--white { background: #fff; }
.cl-card h3 { font-size: clamp(19px, 1.5vw, 22px); line-height: 1.22; letter-spacing: -0.02em; }
.cl-card p { font-size: 15.5px; line-height: 1.55; color: var(--body); }
.cl-card .btn, .cl-card .link-arrow { margin-top: auto; align-self: flex-start; }
.cl-num { display: inline-flex; align-items: center; gap: 8px; font: 500 12.5px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
.cl-num b { font-weight: 500; color: var(--muted); }
.cl-list { display: grid; gap: 10px; padding-left: 0; list-style: none; }
.cl-list li { position: relative; padding-left: 18px; font-size: 15.5px; line-height: 1.55; color: var(--body); }
.cl-list li::before { content: ""; position: absolute; left: 0; top: 0.62em; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.cl-list strong { color: var(--ink); font-weight: 600; }
.cl-faq { display: grid; border-top: 1px solid var(--line); }
.cl-faq details { border-bottom: 1px solid var(--line); }
.cl-faq summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 14px 0; cursor: pointer; list-style: none; font-size: 17px; font-weight: 600; color: var(--ink); }
.cl-faq summary::-webkit-details-marker { display: none; }
.cl-faq summary::after { content: "+"; flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line); font-weight: 500; color: var(--muted); }
.cl-faq details[open] summary::after { content: "–"; }
.cl-faq .cl-faq-a { padding: 0 0 22px; max-width: 72ch; font-size: 15.5px; line-height: 1.6; color: var(--body); }
.cl-faq .cl-faq-a a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.cl-field { display: grid; gap: 6px; }
.cl-field label { font: 600 13px/1.4 var(--font); letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
.cl-input, .cl-select { width: 100%; min-height: 48px; padding: 0 18px; border-radius: var(--pill); border: 1px solid var(--line); background: #fff; color: var(--ink); font: 500 15px/1.2 var(--font); }
.cl-input:focus-visible, .cl-select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.cl-select { appearance: none; padding-right: 44px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2125' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 18px center; }
.cl-tools { display: grid; grid-template-columns: minmax(0, 1fr) 200px auto; align-items: end; gap: 14px 16px; padding: clamp(18px, 2vw, 26px); border-radius: var(--r-card); background: var(--band); }
.cl-status { grid-column: 1 / -1; min-height: 1.4em; font-size: 14px; color: var(--muted); }
.cl-empty { padding: 32px; border-radius: var(--r-card); border: 1px dashed var(--line); text-align: center; color: var(--muted); }
.cl-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.cl-inline a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.cl-inline a:hover { color: var(--navy); }
@media (max-width: 1023px) { .cl-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .cl-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) {
  .cl-hero { grid-template-columns: 1fr; min-height: 0; gap: 0; }
  .cl-hero-copy { padding: clamp(24px, 6vw, 40px); padding-bottom: 8px; }
  .cl-hero-media { padding: 20px clamp(16px, 4vw, 32px) clamp(20px, 4vw, 32px); min-height: 0; }
  .cl-mosaic { min-height: 0; aspect-ratio: 4 / 3; }
  .cl-tools { grid-template-columns: 1fr; }
  .cl-grid-2 { grid-template-columns: 1fr; }
}
@media (max-width: 640px) { .cl-grid-3 { grid-template-columns: 1fr; } .cl-stats { grid-template-columns: 1fr 1fr; gap: 16px; } .cl-photo { aspect-ratio: 4 / 3; } }

/* ---------- Evidence: grade badges ---------- */
.ev-grade { display: inline-grid; place-items: center; min-width: 30px; height: 30px; padding: 0 9px; border-radius: var(--pill); border: 1px solid transparent; font: 700 13px/1 var(--font); letter-spacing: 0.02em; color: #fff; background: var(--muted); white-space: nowrap; }
.ev-grade--a { background: var(--navy); }
.ev-grade--b { background: var(--accent); }
.ev-grade--c { background: #6b7a8f; }
.ev-grade--d { background: #d9dde3; color: var(--ink); }
.ev-grade--na { background: #fff; color: var(--muted); border-color: var(--line); }
.ev-grade--lg { min-width: 44px; height: 44px; font-size: 18px; }
.ev-grade--sm { min-width: 24px; height: 24px; padding: 0 7px; font-size: 11.5px; }
.ev-scope { font: 500 12px/1.3 var(--mono); color: var(--muted); white-space: nowrap; }

/* ---------- Evidence: hero grade matrix ---------- */
.ev-matrix { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
.ev-cell { position: relative; display: block; aspect-ratio: 1; border-radius: 14px; overflow: hidden; background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(16, 35, 58, 0.06); transition: transform var(--t-hover) var(--ease), box-shadow var(--t-hover) var(--ease); }
.ev-cell:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); z-index: 1; }
.ev-cell picture, .ev-cell img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ev-cell--plate img { object-fit: contain; padding: 18%; }
.ev-cell-name { position: absolute; inset: auto 0 0 0; padding: 26px 10px 8px; font: 600 11.5px/1.25 var(--font); color: #fff; background: linear-gradient(180deg, rgba(16, 35, 58, 0) 0%, rgba(16, 35, 58, 0.82) 100%); overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.ev-cell--plate .ev-cell-name, .ev-cell--text .ev-cell-name { color: var(--ink); background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 45%); }
.ev-cell--text { display: grid; place-items: center; padding: 10px; background: var(--band); }
.ev-cell--text .ev-cell-plate { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden; font: 600 12px/1.25 var(--font); text-align: center; color: var(--ink); }
.ev-cell .ev-grade { position: absolute; top: 8px; left: 8px; }
.ev-matrix-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin-top: 12px; font-size: 13px; color: var(--muted); }
.ev-matrix-foot span { display: inline-flex; align-items: center; gap: 6px; }

/* ---------- Evidence: key / counts / tools ---------- */
.ev-key { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(24px, 3vw, 48px); align-items: center; padding: clamp(24px, 3.2vw, 48px); border-radius: var(--r-panel); background: var(--band); }
.ev-key-photo { border-radius: var(--r-card); overflow: hidden; aspect-ratio: 4 / 3; background: var(--card); }
.ev-key-photo picture, .ev-key-photo img { width: 100%; height: 100%; object-fit: cover; }
.ev-legend { font-size: 15.5px; line-height: 1.7; color: var(--body); }
.ev-legend strong { display: inline-grid; place-items: center; min-width: 26px; height: 26px; padding: 0 8px; margin-right: 2px; border-radius: var(--pill); background: var(--navy); color: #fff; font: 700 12px/1 var(--font); vertical-align: middle; }
.ev-legend em { font-style: italic; color: var(--ink); }
.ev-counts { display: flex; flex-wrap: wrap; gap: 20px 40px; margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--line); }
.ev-counts b { display: block; font-size: clamp(1.9rem, 2.6vw, 2.6rem); line-height: 1; letter-spacing: -0.03em; color: var(--ink); font-weight: 800; }
.ev-counts span { display: block; margin-top: 6px; font-size: 14px; color: var(--muted); }

/* ---------- Evidence: groups + cards ---------- */
.ev-group { scroll-margin-top: calc(var(--nav-h) + 72px); }
.ev-group + .ev-group { margin-top: clamp(32px, 4vw, 56px); }
.ev-group-head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; margin-bottom: 18px; }
.ev-group-head h2 { font-size: clamp(1.35rem, 1.9vw, 1.7rem); letter-spacing: -0.02em; }
.ev-group-head h2 b { font-weight: 700; }
.ev-group-head small { font-size: 15px; color: var(--muted); }
.ev-group-note { max-width: 80ch; margin-bottom: 18px; padding: 12px 16px; border-radius: var(--r-sm); background: #fff; border: 1px solid var(--line); font-size: 14.5px; line-height: 1.55; color: var(--body); }
.ev-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); align-items: start; }
.ev-card { min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: clamp(20px, 2vw, 26px); border-radius: var(--r-card); background: #fff; border: 1px solid var(--line); scroll-margin-top: calc(var(--nav-h) + 72px); }
.ev-card:target { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(43, 94, 167, 0.15); }
.ev-card--wide { grid-column: 1 / -1; }
.ev-head { display: grid; grid-template-columns: 84px minmax(0, 1fr) auto; gap: 16px; align-items: start; }
.ev-thumb { display: block; width: 84px; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: var(--band); }
.ev-thumb picture, .ev-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ev-thumb--plate { display: grid; place-items: center; padding: 10px; background: #fff; border: 1px solid var(--line); }
.ev-thumb--plate img { object-fit: contain; }
.ev-thumb--text { display: grid; place-items: center; padding: 8px; text-align: center; font: 600 10.5px/1.2 var(--font); color: var(--muted); }
.ev-title { font-size: 18px; line-height: 1.25; letter-spacing: -0.015em; }
.ev-title a:hover { color: var(--accent); }
.ev-meta { margin-top: 3px; font-size: 13.5px; color: var(--muted); }
.ev-blurb { margin-top: 8px; font-size: 14.5px; line-height: 1.55; color: var(--body); }
.ev-gradewrap { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.ev-details { border-top: 1px solid var(--line); padding-top: 10px; }
.ev-details summary { display: inline-flex; align-items: center; gap: 8px; min-height: 36px; cursor: pointer; list-style: none; font-size: 14px; font-weight: 600; color: var(--ink); }
.ev-details summary::-webkit-details-marker { display: none; }
.ev-details summary::before { content: ""; width: 7px; height: 7px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(-45deg); transition: transform var(--t-hover) var(--ease); }
.ev-details[open] summary::before { transform: rotate(45deg); }
.ev-details p { margin-top: 4px; font-size: 14.5px; line-height: 1.6; color: var(--body); }
.ev-details ol { margin: 8px 0 0; padding-left: 20px; display: grid; gap: 8px; }
.ev-details ol li { font-size: 13.5px; line-height: 1.5; color: var(--body); }
.ev-details ol a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.ev-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.ev-label { flex: 0 0 100%; margin-bottom: 2px; font: 500 11.5px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.ev-chip, .ev-tag { display: inline-flex; align-items: center; min-height: 30px; padding: 0 11px; border-radius: var(--pill); border: 1px solid var(--line); background: #fff; font: 500 12.5px/1.2 var(--font); color: var(--body); white-space: nowrap; max-width: 100%; }
.ev-chip--wide, .ev-tag--wide { white-space: normal; }
a.ev-chip:hover, a.ev-tag:hover { border-color: var(--ink); color: var(--ink); }
.ev-chip--doc { border-color: var(--accent); color: var(--accent); }
.ev-chip--plain { background: var(--band); border-color: transparent; }
.ev-tag--top { background: var(--navy); border-color: var(--navy); color: #fff; }
a.ev-tag--top:hover { background: var(--navy-hover); color: #fff; }
.ev-tag--mid { background: #e8eef8; border-color: #e8eef8; color: var(--navy); }
.ev-tag--low { background: var(--band); border-color: var(--band); color: var(--body); }
.ev-tag--none { border-style: dashed; color: var(--muted); }
.ev-tag--class { font-style: italic; }
.ev-tag--trial { border-color: #c9d6ea; color: var(--accent); background: #fff; }
.ev-tag--mini { min-height: 26px; padding: 0 9px; font-size: 12px; }
.ev-tablewrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--line); border-radius: var(--r-sm); }
.ev-table { width: 100%; min-width: 640px; border-collapse: collapse; font-size: 14px; }
.ev-table th { padding: 10px 12px; text-align: left; font: 500 11.5px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); background: var(--band); }
.ev-table td { padding: 10px 12px; vertical-align: top; border-top: 1px solid var(--line); color: var(--body); }
.ev-table td:first-child { font-weight: 600; color: var(--ink); }
.ev-table td a:not(.ev-tag) { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.ev-flag { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.ev-flag + .ev-flag { margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--line); }
.ev-flag > span:first-child { font-weight: 600; color: var(--ink); margin-right: 2px; }
.ev-sub { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; margin: 6px 0 2px; font-size: 16px; }
.ev-sub small { font-size: 13.5px; color: var(--muted); }
.ev-tags { display: flex; flex-wrap: wrap; gap: 6px; }
@media (max-width: 1100px) { .ev-matrix { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
@media (max-width: 900px) { .ev-grid { grid-template-columns: minmax(0, 1fr); } .ev-key { grid-template-columns: minmax(0, 1fr); } .ev-matrix { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; } }
@media (max-width: 640px) { .ev-matrix { grid-template-columns: repeat(4, minmax(0, 1fr)); } .ev-head { grid-template-columns: 64px minmax(0, 1fr); } .ev-thumb { width: 64px; } .ev-gradewrap { grid-column: 2; flex-direction: row; align-items: center; } }

/* ---------- Scientific portfolio ---------- */
.sp-cover { position: relative; display: grid; gap: 10px; }
.sp-cover-media { position: relative; display: block; border-radius: var(--r-card); overflow: hidden; aspect-ratio: 5 / 4; background: #fff; box-shadow: var(--shadow-float); }
.sp-cover-media picture, .sp-cover-media img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--t-slide) var(--ease); }
.sp-cover-media:hover img { transform: scale(1.03); }
.sp-cover-open { position: absolute; left: 14px; bottom: 14px; display: inline-flex; align-items: center; min-height: 36px; padding: 0 14px; border-radius: var(--pill); background: rgba(255, 255, 255, 0.92); color: var(--ink); font: 600 13px/1 var(--font); }
.sp-cover figcaption { display: flex; justify-content: space-between; gap: 12px; font-size: 13.5px; color: var(--muted); }
.sp-issue { display: flex; flex-wrap: wrap; gap: 4px 12px; font: 500 12px/1.4 var(--mono); letter-spacing: 0.04em; color: var(--muted); }
.sp-toc { display: flex; flex-wrap: wrap; gap: 8px; }
.sp-toc a { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: var(--pill); border: 1px solid var(--line); background: #fff; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.sp-toc a:hover { border-color: var(--ink); }
.sp-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap); }
.sp-card { display: flex; flex-direction: column; border-radius: var(--r-card); overflow: hidden; background: var(--band); }
.sp-card-media { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; background: var(--card); }
.sp-card-media picture, .sp-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--t-slide) var(--ease); }
.sp-card-media:hover img { transform: scale(1.03); }
.sp-card-media--plate { display: grid; place-items: center; padding: 16% 14%; background: #fff; }
.sp-card-media--plate img { width: 100%; height: auto; max-height: 100%; object-fit: contain; }
.sp-card-media--text { display: grid; place-items: center; background: #fff; font: 700 clamp(18px, 1.6vw, 22px)/1.2 var(--font); letter-spacing: -0.02em; color: var(--ink); text-align: center; padding: 16px; }
.sp-card-open { position: absolute; left: 12px; bottom: 12px; display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border-radius: var(--pill); background: rgba(255, 255, 255, 0.92); color: var(--ink); font: 600 12.5px/1 var(--font); }
.sp-card-body { display: flex; flex-direction: column; gap: 4px; flex: 1; padding: 16px 18px 18px; }
.sp-card-maker { font-size: 13px; color: var(--muted); }
.sp-card-body h3 { font-size: 17px; line-height: 1.25; letter-spacing: -0.015em; }
.sp-card-body h3 a:hover { color: var(--accent); }
.sp-card-format { margin-top: 4px; font-size: 14px; font-weight: 500; color: var(--ink); }
.sp-card-material { font-size: 13.5px; color: var(--body); }
.sp-card-links { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: auto; padding-top: 12px; }
.sp-card-links a { display: inline-flex; align-items: center; min-height: 32px; font-size: 13.5px; font-weight: 600; color: var(--accent); }
.sp-card-links a:hover { text-decoration: underline; text-underline-offset: 3px; }
.sp-mat { display: flex; flex-direction: column; border-radius: var(--r-card); overflow: hidden; background: var(--band); }
.sp-mat-media { aspect-ratio: 16 / 10; overflow: hidden; background: var(--card); }
.sp-mat-media picture, .sp-mat-media img { width: 100%; height: 100%; object-fit: cover; }
.sp-mat-body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 22px 24px 24px; }
.sp-mat-body h3 { font-size: clamp(19px, 1.5vw, 22px); line-height: 1.22; letter-spacing: -0.02em; }
.sp-mat-body p { font-size: 15px; line-height: 1.55; color: var(--body); }
.sp-mat-body .cl-pills { margin-top: auto; padding-top: 10px; }
.sp-note { display: grid; gap: 8px; padding: clamp(22px, 2.4vw, 32px); border-radius: var(--r-card); background: var(--navy); color: var(--body-inv); }
.sp-note strong { font-size: 17px; color: #fff; }
.sp-note p { font-size: 15.5px; line-height: 1.55; }
.sp-source { font-size: 14px; color: var(--muted); }
.sp-source a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.sp-study { display: flex; flex-direction: column; gap: 12px; padding: clamp(22px, 2.6vw, 36px); border-radius: var(--r-card); background: var(--band); }
.sp-study-meta { font: 500 12.5px/1.4 var(--mono); letter-spacing: 0.04em; text-transform: uppercase; color: var(--accent); }
.sp-study h3 { font-size: clamp(20px, 1.7vw, 24px); line-height: 1.2; letter-spacing: -0.02em; }
.sp-study p { font-size: 15.5px; line-height: 1.6; color: var(--body); }
.sp-study p strong { color: var(--ink); }
.sp-study details { border-top: 1px solid var(--line); padding-top: 8px; }
.sp-study summary { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; cursor: pointer; list-style: none; font-weight: 600; font-size: 14.5px; color: var(--ink); }
.sp-study summary::-webkit-details-marker { display: none; }
.sp-study summary::before { content: ""; width: 7px; height: 7px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(-45deg); }
.sp-study details[open] summary::before { transform: rotate(45deg); }
.sp-cite { font-size: 14px; color: var(--muted); }
.sp-cite cite { font-style: italic; }
.sp-quote { display: grid; gap: 10px; padding: clamp(24px, 3vw, 40px); border-radius: var(--r-card); background: #fff; border: 1px solid var(--line); }
.sp-quote p { font-size: clamp(19px, 1.7vw, 24px); line-height: 1.3; letter-spacing: -0.02em; font-weight: 600; color: var(--ink); }
.sp-quote small { font-size: 14.5px; color: var(--muted); }
.sp-quote small a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.sp-end { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px 32px; }
.sp-end p { font-size: 14.5px; line-height: 1.6; color: var(--body); max-width: 80ch; }
@media (max-width: 1023px) { .sp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 760px) { .sp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .sp-end { grid-template-columns: 1fr; } }
@media (max-width: 420px) { .sp-grid { grid-template-columns: 1fr; } }

/* ---------- Software ---------- */
.sw-report { display: grid; gap: 14px; padding: 18px; border-radius: var(--r-card); background: #fff; color: var(--ink); box-shadow: var(--shadow-float); }
.sw-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; font: 500 12px/1.4 var(--mono); letter-spacing: 0.04em; color: var(--muted); }
.sw-chip { display: inline-flex; align-items: center; min-height: 24px; padding: 0 9px; border-radius: var(--pill); background: var(--band); color: var(--ink); font: 600 10.5px/1 var(--font); letter-spacing: 0.08em; }
.sw-mesh { border-radius: 12px; overflow: hidden; aspect-ratio: 16 / 9; background: var(--card); }
.sw-mesh picture, .sw-mesh img { width: 100%; height: 100%; object-fit: cover; }
.sw-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.sw-metrics div { padding: 10px 12px; border-radius: 10px; background: var(--band); }
.sw-k { display: block; font: 500 11px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.sw-v { display: block; margin-top: 2px; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); font-variant-numeric: tabular-nums; }
.sw-pipe { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.sw-step { display: inline-flex; align-items: center; min-height: 26px; padding: 0 10px; border-radius: var(--pill); border: 1px solid var(--line); font: 600 12px/1 var(--font); color: var(--ink); }
.sw-step + .sw-step::before { content: "→"; margin-left: -4px; margin-right: 6px; color: var(--muted); font-weight: 400; }
.sw-foot { display: flex; flex-wrap: wrap; gap: 4px 10px; font: 500 11px/1.5 var(--mono); color: var(--muted); }
.sw-foot span + span::before { content: "·"; margin-right: 10px; }
.sw-cap { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 14px; padding-top: 10px; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }
.sw-cap a { font-weight: 600; color: var(--accent); }
.sw-platform { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--gap); align-items: stretch; }
.sw-spec { padding: clamp(24px, 3vw, 40px); border-radius: var(--r-panel); background: var(--navy); color: var(--body-inv); }
.sw-spec h3 { font-size: clamp(1.4rem, 2vw, 1.8rem); letter-spacing: -0.02em; color: #fff; margin-bottom: 14px; }
.sw-spec .spec > div { grid-template-columns: 130px 1fr; border-top-color: var(--line-inv); }
.sw-spec .spec dt { color: var(--muted-inv); }
.sw-spec .spec dd { color: #fff; }
.sw-posture { padding: clamp(24px, 3vw, 40px); border-radius: var(--r-panel); background: var(--band); }
.sw-posture h3 { font-size: clamp(1.4rem, 2vw, 1.8rem); letter-spacing: -0.02em; margin-bottom: 10px; }
.sw-posture > p { font-size: 15.5px; line-height: 1.55; color: var(--body); margin-bottom: 14px; }
.sw-framing { margin-top: 18px; padding: 12px 16px; border-radius: var(--r-sm); background: #fff; border: 1px solid var(--line); font-size: 14px; line-height: 1.55; color: var(--body); }
.sw-framing strong { color: var(--ink); }
.sw-partners { display: grid; justify-items: center; text-align: center; gap: 8px; padding: clamp(28px, 4vw, 56px); border-radius: var(--r-panel); background: #fff; border: 1px solid var(--line); }
.sw-partners h3 { font-size: clamp(1.6rem, 2.6vw, 2.3rem); letter-spacing: -0.025em; }
.sw-partners p { max-width: 60ch; font-size: 16px; line-height: 1.55; color: var(--body); }
.sw-pair { display: grid; grid-template-columns: 1.6fr 1fr; gap: var(--gap); }
.sw-pair > div { border-radius: var(--r-panel); overflow: hidden; aspect-ratio: 16 / 10; background: var(--card); }
.sw-pair > div:last-child { aspect-ratio: auto; }
.sw-pair picture, .sw-pair img { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 900px) { .sw-platform { grid-template-columns: 1fr; } .sw-pair { grid-template-columns: 1fr; } .sw-pair > div:last-child { aspect-ratio: 16 / 10; } .sw-spec .spec > div { grid-template-columns: 1fr; gap: 2px; } }
@media (max-width: 480px) { .sw-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

/* ---------- Portal preview (fictional sample data) ---------- */
.pm-shell { border-radius: var(--r-panel); overflow: hidden; background: var(--navy-deep); color: var(--body-inv); box-shadow: var(--shadow-float); }
.pm-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 0 18px; font: 500 12px/1.4 var(--mono); color: var(--muted-inv); border-bottom: 1px solid var(--line-inv); }
.pm-top b { color: #fff; font-weight: 500; }
.pm-demo-label { display: inline-flex; align-items: center; min-height: 24px; padding: 0 9px; border-radius: var(--pill); background: rgba(218, 177, 86, 0.16); color: var(--gold); font: 600 10.5px/1 var(--font); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.pm-mobile { display: none; gap: 10px; align-items: end; padding: 12px 16px; border-bottom: 1px solid var(--line-inv); }
.pm-mobile .cl-field { flex: 1; }
.pm-mobile label { color: var(--muted-inv); }
.pm-body { display: grid; grid-template-columns: 220px minmax(0, 1fr); min-height: 560px; }
.pm-side { display: flex; flex-direction: column; gap: 4px; padding: 18px 12px; border-right: 1px solid var(--line-inv); }
.pm-brand { display: flex; align-items: center; gap: 10px; padding: 6px 10px 18px; color: #fff; font-weight: 700; letter-spacing: -0.01em; }
.pm-brand .mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: var(--gold); color: var(--navy-deep); font-weight: 800; }
.pm-group { margin: 10px 10px 4px; font: 500 10.5px/1.4 var(--mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-inv); }
.pm-item { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 0 12px; border-radius: 10px; color: var(--body-inv); font: 500 14px/1.2 var(--font); text-align: left; transition: background-color var(--t-hover) var(--ease), color var(--t-hover) var(--ease); }
.pm-item:hover { background: rgba(255, 255, 255, 0.06); color: #fff; }
.pm-item[aria-pressed="true"] { background: rgba(255, 255, 255, 0.12); color: #fff; }
.pm-item .badge { margin-left: auto; min-width: 22px; padding: 2px 7px; border-radius: var(--pill); background: var(--accent); color: #fff; font: 600 11px/1.2 var(--font); text-align: center; }
.pm-user { display: flex; align-items: center; gap: 10px; width: 100%; margin-top: auto; padding: 10px; border-radius: 12px; text-align: left; color: #fff; transition: background-color var(--t-hover) var(--ease); }
.pm-user:hover { background: rgba(255, 255, 255, 0.06); }
.pm-avatar { display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--accent); color: #fff; font: 700 12px/1 var(--font); }
.pm-user .name { display: block; font-size: 14px; font-weight: 600; }
.pm-user .role { display: block; font-size: 12px; color: var(--muted-inv); }
.pm-main { padding: clamp(16px, 2vw, 26px); background: #f6f7f9; color: var(--body); }
.pm-main-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
.pm-main-top h3 { font-size: 18px; letter-spacing: -0.015em; color: var(--ink); }
.pm-chip { display: inline-flex; align-items: center; gap: 7px; min-height: 28px; padding: 0 11px; border-radius: var(--pill); background: #fff; border: 1px solid var(--line); font: 600 12px/1 var(--font); color: var(--body); }
.pm-chip .dot { width: 7px; height: 7px; border-radius: 50%; background: #2f9e6a; box-shadow: 0 0 0 3px rgba(47, 158, 106, 0.18); }
.pm-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.pm-kpi { padding: 14px 16px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.pm-kpi .label { margin: 0; font: 500 11px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.pm-kpi .value { margin-top: 4px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); font-variant-numeric: tabular-nums; }
.pm-kpi .trend { margin-top: 2px; font-size: 12.5px; font-weight: 500; color: var(--muted); }
.pm-kpi .trend--up { color: #237a52; }
.pm-kpi .trend--down { color: #b4432f; }
.pm-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.pm-pill { display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border-radius: var(--pill); border: 1px solid var(--line); background: #fff; font: 600 12.5px/1 var(--font); color: var(--body); }
.pm-pill[aria-pressed="true"] { background: var(--navy); border-color: var(--navy); color: #fff; }
.pm-results { margin-bottom: 12px; font-size: 12.5px; color: var(--muted); }
.pm-split { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 12px; align-items: start; }
.pm-sidecol { display: grid; gap: 12px; }
.pm-card { padding: 16px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.pm-card header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.pm-card h4 { font-size: 14.5px; font-weight: 600; color: var(--ink); }
.pm-card .view-all { display: inline-flex; align-items: center; min-height: 32px; font-size: 12.5px; font-weight: 600; color: var(--accent); }
.pm-card .view-all:hover { text-decoration: underline; text-underline-offset: 3px; }
.pm-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; padding: 9px 0; border-top: 1px solid var(--line); font-size: 13.5px; }
.pm-row .pid { margin-right: 8px; font: 500 12px/1.4 var(--mono); color: var(--muted); }
.pm-row .date { font-size: 12.5px; color: var(--muted); white-space: nowrap; }
.pm-status { display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: var(--pill); font: 600 11px/1 var(--font); white-space: nowrap; background: var(--band); color: var(--body); }
.pm-status--ok { background: #e3f3ea; color: #237a52; }
.pm-status--sent { background: #e8eef8; color: var(--accent); }
.pm-status--rev { background: #fbf0d8; color: #8a6414; }
.pm-status--paid { background: var(--navy); color: #fff; }
.pm-check { display: grid; }
.pm-check-item { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--line); font-size: 13.5px; color: var(--ink); }
.pm-check-item .mark { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #e3f3ea; color: #237a52; font: 700 12px/1 var(--font); }
.pm-check-item .code { font: 500 12px/1.4 var(--mono); color: var(--muted); }
a.pm-check-item:hover .title { color: var(--accent); }
.pm-chart { display: grid; gap: 6px; }
.pm-bars { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); align-items: end; gap: 6px; height: 110px; }
.pm-bar { border-radius: 6px 6px 2px 2px; background: #cfd9e8; }
.pm-bar--active { background: var(--accent); }
.pm-chart-labels { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; text-align: center; font: 500 11px/1.4 var(--mono); color: var(--muted); }
.pm-gauge { display: grid; justify-items: center; gap: 4px; padding: 10px 0 6px; text-align: center; }
.pm-gauge b { font-size: 36px; font-weight: 800; letter-spacing: -0.03em; color: var(--ink); line-height: 1; }
.pm-gauge b small { font-size: 13px; font-weight: 500; color: var(--muted); margin-left: 4px; }
.pm-gauge span { font: 600 11px/1.4 var(--font); letter-spacing: 0.1em; text-transform: uppercase; color: #237a52; }
.pm-note { margin-top: 14px; font-size: 14px; color: var(--muted); text-align: center; }
.pm-dialog { width: min(420px, calc(100vw - 32px)); padding: 0; border: 0; border-radius: var(--r-card); background: #fff; color: var(--body); box-shadow: var(--shadow-float); }
.pm-dialog::backdrop { background: rgba(16, 35, 58, 0.55); }
.pm-dialog-inner { display: grid; gap: 14px; padding: 24px; }
.pm-dialog-head { display: flex; align-items: center; gap: 14px; }
.pm-dialog-head .pm-avatar { width: 52px; height: 52px; font-size: 16px; }
.pm-dialog-head .name { font-size: 18px; font-weight: 700; color: var(--ink); }
.pm-dialog-head .email { font-size: 13.5px; color: var(--muted); }
.pm-dialog .disclosure { padding: 10px 12px; border-radius: var(--r-xs); background: var(--band); font-size: 13.5px; color: var(--body); }
.pm-dialog-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.pm-dialog-stats div { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); }
.pm-dialog-stats .label { font: 500 11px/1.4 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.pm-dialog-stats .value { font-size: 17px; font-weight: 700; color: var(--ink); }
.pm-dialog-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-top: 1px solid var(--line); font-size: 14px; }
.pm-dialog-row .k { color: var(--muted); }
.pm-dialog-row .v { font-weight: 600; color: var(--ink); }
.pm-dialog-row .v--ok { color: #237a52; }
.cap { display: flex; flex-direction: column; border-radius: var(--r-card); overflow: hidden; background: var(--band); }
.cap-media { aspect-ratio: 16 / 10; overflow: hidden; background: var(--card); }
.cap-media picture, .cap-media img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--t-slide) var(--ease); }
.cap:hover .cap-media img { transform: scale(1.03); }
.cap-body { display: grid; gap: 8px; padding: 20px 22px 24px; }
.cap-body h3 { font-size: clamp(18px, 1.4vw, 21px); letter-spacing: -0.02em; }
.cap-body p { font-size: 15px; line-height: 1.55; color: var(--body); }
@media (max-width: 1023px) { .pm-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } .pm-split { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .pm-body { grid-template-columns: 1fr; min-height: 0; } .pm-side { display: none; } .pm-mobile { display: flex; } .pm-row { grid-template-columns: minmax(0, 1fr) auto; } .pm-row .date { grid-column: 1; } }
@media (max-width: 420px) { .pm-kpis { grid-template-columns: 1fr 1fr; gap: 8px; } .pm-kpi { padding: 12px; } .pm-kpi .value { font-size: 20px; } }

/* ---------- Touch: every interactive chip, tag, pill and text link reaches 44px on coarse pointers ---------- */
@media (pointer: coarse) {
  .ev-chip, .ev-tag, .ev-tag--mini, .pm-pill, .pm-card .view-all, .sp-card-links a, .sw-cap a, .sp-cover-open, .sp-card-open, .ev-details summary, .sp-study summary, .cl-faq summary, .pm-item, .pm-check-item, .pm-row { min-height: 44px; }
  .ev-chip, .ev-tag { padding-block: 6px; }
  .ev-table td { padding-block: 6px; }
  .sw-cap a, .sp-card-links a, .pm-card .view-all { display: inline-flex; align-items: center; }
}

/* ---------- Review fixes (phone-size card heads, matrix text plates, filter field span, touch targets) ---------- */
.ev-cell--text { padding: 40px 8px 10px; }
@media (max-width: 640px) { .ev-head { grid-template-columns: 64px minmax(0, 1fr) auto; } .ev-gradewrap { grid-column: auto; flex-direction: column; align-items: flex-end; } }
.cl-tools .cl-field--span { grid-column: 2 / -1; }
@media (max-width: 900px) { .cl-tools .cl-field--span { grid-column: auto; } }
@media (pointer: coarse) {
  .ev-title a, .sp-card-body h3 a { display: inline-flex; align-items: center; min-height: 44px; }
  .ev-chip, .ev-tag { min-width: 44px; justify-content: center; }
  .ev-details ol a { display: block; min-height: 44px; padding-block: 6px; }
  .ev-table td a:not(.ev-tag) { display: inline-flex; align-items: center; min-height: 44px; }
}
@media (pointer: coarse) {
  .ev-table td a:not(.ev-tag), .ev-title a { min-width: 44px; }
  .sp-source a { display: inline-flex; align-items: center; min-height: 44px; }
}
@media (max-width: 640px) {
  .ev-cell .ev-grade { top: 6px; left: 6px; min-width: 26px; height: 26px; padding: 0 7px; font-size: 11px; }
  .ev-cell--text { padding: 32px 6px 6px; }
  .ev-cell--text .ev-cell-plate { -webkit-line-clamp: 3; font-size: 10.5px; }
  .ev-cell-name { padding: 20px 7px 6px; font-size: 10.5px; }
}

/* Touch targets (finish pass): inline links inside FAQ bodies get a 44px box without moving the text. */
.cl-faq details a:not(.btn) { display: inline-block; padding: 12px 0; margin: -12px 0; }
`;
const hoist = { href: "clinical-css", precedence: "site" };
function ClinicalStyles() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("style", { ...hoist, children: css });
}
function Html({ html, as = "span", className, id }) {
  return reactExports.createElement(as, { className, id, dangerouslySetInnerHTML: { __html: html } });
}
export {
  ClinicalStyles as C,
  Html as H
};
