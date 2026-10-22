import { r as reactExports, V as jsxRuntimeExports } from "./server-B4VclHNy.js";
import { e as cx, R as Reveal, j as PORTAL, A as AppLink, P as Picture, S as SectionHead, b as StatementPanel, I as InfoBand } from "./router-BKKY7m0h.js";
import { C as ClinicalStyles, H as Html } from "./Html-B-oyYRkD.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const PORTAL_DEMO = {
  "top": {
    "url": "Portal preview /",
    "demoLabel": "Fictional sample data"
  },
  "mobile": {
    "label": "Explore the portal",
    "options": [
      {
        "value": "dashboard",
        "label": "Dashboard"
      },
      {
        "value": "patients",
        "label": "Patients"
      },
      {
        "value": "orders",
        "label": "Orders"
      },
      {
        "value": "documentation",
        "label": "Documentation"
      },
      {
        "value": "audit",
        "label": "Audit-readiness"
      },
      {
        "value": "claims",
        "label": "Claims & denials"
      },
      {
        "value": "reports",
        "label": "Reports"
      }
    ],
    "accountAria": "Open sample account"
  },
  "brand": {
    "mark": "A",
    "name": "Albacete Portal"
  },
  "nav": [
    {
      "label": "Clinical",
      "items": [
        {
          "view": "dashboard",
          "label": "Dashboard",
          "badge": null
        },
        {
          "view": "patients",
          "label": "Patients",
          "badge": "84"
        },
        {
          "view": "orders",
          "label": "Orders",
          "badge": "12"
        }
      ]
    },
    {
      "label": "Compliance",
      "items": [
        {
          "view": "documentation",
          "label": "Documentation",
          "badge": null
        },
        {
          "view": "audit",
          "label": "Audit-readiness",
          "badge": null
        }
      ]
    },
    {
      "label": "Revenue",
      "items": [
        {
          "view": "claims",
          "label": "Claims & denials",
          "badge": null
        },
        {
          "view": "reports",
          "label": "Reports",
          "badge": null
        }
      ]
    }
  ],
  "user": {
    "avatar": "DR",
    "name": "Dr. Romero",
    "role": "Clinical lead",
    "aria": "Open sample account"
  },
  "views": [
    {
      "key": "dashboard",
      "heading": "Today · Wound care program",
      "chip": "Sample data",
      "live": true,
      "kpis": [
        {
          "label": "Active patients",
          "value": "84",
          "trend": "↑ 12 this month",
          "tone": "up"
        },
        {
          "label": "Orders this week",
          "value": "27",
          "trend": "↑ 8 vs. last week",
          "tone": "up"
        },
        {
          "label": "Pending claims",
          "value": "$18.4K",
          "trend": "6 awaiting",
          "tone": "neutral"
        },
        {
          "label": "Docs complete",
          "value": "100%",
          "trend": "Audit-ready",
          "tone": "up"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Recent orders",
          "side": false,
          "action": {
            "label": "View all",
            "href": null,
            "goto": "orders",
            "aria": null
          },
          "rows": [
            {
              "pid": "#1284",
              "text": "Collagen 4×4 · E. Ortiz",
              "date": "Apr 18",
              "status": "Shipped",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": "#1291",
              "text": "UltraMist · M. Patel",
              "date": "Apr 19",
              "status": "Approved",
              "tone": "sent",
              "wide": false
            },
            {
              "pid": "#1297",
              "text": "ActiGraft+ · R. Greene",
              "date": "Apr 20",
              "status": "In review",
              "tone": "rev",
              "wide": false
            },
            {
              "pid": "#1302",
              "text": "Membrane Wrap · J. Khan",
              "date": "Apr 21",
              "status": "Delivered",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": "#1306",
              "text": "MicroDoc NPWT · L. Rivera",
              "date": "Apr 22",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        },
        {
          "title": "Compliance · Today",
          "side": true,
          "action": null,
          "rows": null,
          "checks": [
            {
              "mark": "✓",
              "title": "HCPCS verified",
              "code": "A2005",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "LCD aligned",
              "code": "L35041",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Benefit verified",
              "code": "Covered",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "SWO on file",
              "code": "Signed",
              "href": null,
              "aria": null
            }
          ],
          "chart": null,
          "gauge": null
        },
        {
          "title": "Utilization · 7 days",
          "side": true,
          "action": null,
          "rows": null,
          "checks": null,
          "chart": {
            "bars": [
              {
                "label": "M",
                "v": "14",
                "size": 55,
                "active": false
              },
              {
                "label": "T",
                "v": "18",
                "size": 70,
                "active": false
              },
              {
                "label": "W",
                "v": "12",
                "size": 50,
                "active": false
              },
              {
                "label": "T",
                "v": "21",
                "size": 80,
                "active": false
              },
              {
                "label": "F",
                "v": "27",
                "size": 95,
                "active": true
              },
              {
                "label": "S",
                "v": "16",
                "size": 65,
                "active": false
              },
              {
                "label": "S",
                "v": "10",
                "size": 45,
                "active": false
              }
            ],
            "labels": [
              "M",
              "T",
              "W",
              "T",
              "F",
              "S",
              "S"
            ]
          },
          "gauge": null
        }
      ]
    },
    {
      "key": "patients",
      "heading": "Patients · Active roster",
      "chip": "84 on file",
      "live": true,
      "kpis": [
        {
          "label": "Active",
          "value": "84",
          "trend": "↑ 12 this month",
          "tone": "up"
        },
        {
          "label": "New (30d)",
          "value": "12",
          "trend": "new referrals",
          "tone": "up"
        },
        {
          "label": "Retention",
          "value": "97%",
          "trend": "returning care",
          "tone": "up"
        },
        {
          "label": "Avg duration",
          "value": "28d",
          "trend": "time to heal",
          "tone": "neutral"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Patient list",
          "side": false,
          "action": {
            "label": "Sample CSV",
            "href": "/demo/demo-patients.csv",
            "goto": null,
            "aria": "Download patients sample CSV"
          },
          "rows": [
            {
              "pid": "#1284",
              "text": "E. Ortiz · DFU, right plantar",
              "date": "Week 4",
              "status": "On track",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": "#1291",
              "text": "M. Patel · Venous leg ulcer",
              "date": "Week 2",
              "status": "New",
              "tone": "sent",
              "wide": false
            },
            {
              "pid": "#1297",
              "text": "R. Greene · Pressure ulcer, stage III",
              "date": "Week 6",
              "status": "Healing",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": "#1302",
              "text": "J. Khan · Post-op SSI prevention",
              "date": "Week 1",
              "status": "New",
              "tone": "sent",
              "wide": false
            },
            {
              "pid": "#1306",
              "text": "L. Rivera · Chronic DFU",
              "date": "Week 12",
              "status": "Review",
              "tone": "rev",
              "wide": false
            },
            {
              "pid": "#1311",
              "text": "S. Alvarez · DFU, left heel",
              "date": "Week 3",
              "status": "On track",
              "tone": "ok",
              "wide": false
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        }
      ]
    },
    {
      "key": "orders",
      "heading": "Orders · Queue",
      "chip": "12 in flight",
      "live": true,
      "kpis": [],
      "filters": [
        {
          "key": "all",
          "label": "All"
        },
        {
          "key": "pending",
          "label": "Pending"
        },
        {
          "key": "shipped",
          "label": "Shipped"
        },
        {
          "key": "delivered",
          "label": "Delivered"
        },
        {
          "key": "paid",
          "label": "Paid"
        }
      ],
      "results": "6 sample orders",
      "cards": [
        {
          "title": "Sample orders",
          "side": false,
          "action": {
            "label": "Sample CSV",
            "href": "/demo/demo-orders.csv",
            "goto": null,
            "aria": "Download orders sample CSV"
          },
          "rows": [
            {
              "pid": "O-1324",
              "text": "Collagen 4×4 · E. Ortiz",
              "date": "Apr 22 · $124",
              "status": "Shipped",
              "tone": "ok",
              "wide": true
            },
            {
              "pid": "O-1323",
              "text": "UltraMist · M. Patel",
              "date": "Apr 22 · $560",
              "status": "Approved",
              "tone": "sent",
              "wide": true
            },
            {
              "pid": "O-1320",
              "text": "ActiGraft+ Kit · R. Greene",
              "date": "Apr 21 · $1,480",
              "status": "In review",
              "tone": "rev",
              "wide": true
            },
            {
              "pid": "O-1319",
              "text": "Membrane Wrap 4×6 · J. Khan",
              "date": "Apr 21 · $720",
              "status": "Delivered",
              "tone": "ok",
              "wide": true
            },
            {
              "pid": "O-1315",
              "text": "MicroDoc NPWT · L. Rivera",
              "date": "Apr 20 · $340",
              "status": "Paid",
              "tone": "paid",
              "wide": true
            },
            {
              "pid": "O-1312",
              "text": "Adhesion Barrier 4×6 · D. Cohen",
              "date": "Apr 19 · $3,920",
              "status": "Paid",
              "tone": "paid",
              "wide": true
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        }
      ]
    },
    {
      "key": "documentation",
      "heading": "Documentation · Audit-readiness",
      "chip": "100% audit-ready",
      "live": true,
      "kpis": [
        {
          "label": "Docs complete",
          "value": "100%",
          "trend": "0 gaps",
          "tone": "up"
        },
        {
          "label": "Audit risk",
          "value": "Low",
          "trend": "clean posture",
          "tone": "up"
        },
        {
          "label": "Reviews (30d)",
          "value": "46",
          "trend": "+8 vs. prior",
          "tone": "up"
        },
        {
          "label": "Next review",
          "value": "Apr 28",
          "trend": "scheduled",
          "tone": "neutral"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Templates in use",
          "side": false,
          "action": {
            "label": "Request templates",
            "href": "/contact",
            "goto": null,
            "aria": null
          },
          "rows": null,
          "checks": [
            {
              "mark": "✓",
              "title": "Wound assessment (weekly)",
              "code": "LCD L35041",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Signed written order (SWO)",
              "code": "Medicare",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "HCPCS validation",
              "code": "A2005",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Benefit verification",
              "code": "Pre-tx",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Photographic evidence",
              "code": "Every visit",
              "href": null,
              "aria": null
            }
          ],
          "chart": null,
          "gauge": null
        },
        {
          "title": "Recent notes",
          "side": true,
          "action": null,
          "rows": [
            {
              "pid": null,
              "text": "Dr. Romero · E. Ortiz visit note",
              "date": "2m ago",
              "status": null,
              "tone": null,
              "wide": false
            },
            {
              "pid": null,
              "text": "NP Chen · M. Patel SWO",
              "date": "18m ago",
              "status": null,
              "tone": null,
              "wide": false
            },
            {
              "pid": null,
              "text": "Dr. Romero · R. Greene photo",
              "date": "1h ago",
              "status": null,
              "tone": null,
              "wide": false
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        },
        {
          "title": "Audit exposure score",
          "side": true,
          "action": null,
          "rows": null,
          "checks": null,
          "chart": null,
          "gauge": {
            "value": "2.1",
            "of": "/ 10",
            "label": "Low risk"
          }
        }
      ]
    },
    {
      "key": "audit",
      "heading": "Audit-readiness · Risk posture",
      "chip": "Low risk",
      "live": true,
      "kpis": [
        {
          "label": "Audit risk",
          "value": "2.1 / 10",
          "trend": "Low",
          "tone": "up"
        },
        {
          "label": "Charts reviewed (30d)",
          "value": "46",
          "trend": "+8 vs. prior",
          "tone": "up"
        },
        {
          "label": "Open flags",
          "value": "0",
          "trend": "clean stack",
          "tone": "up"
        },
        {
          "label": "Next review",
          "value": "Apr 28",
          "trend": "scheduled",
          "tone": "neutral"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Pre-audit checklist",
          "side": false,
          "action": {
            "label": "Sample CSV",
            "href": "/demo/demo-audit-checklist.csv",
            "goto": null,
            "aria": "Download audit checklist sample CSV"
          },
          "rows": null,
          "checks": [
            {
              "mark": "✓",
              "title": "Documentation complete · all active pts",
              "code": "100%",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "LCD/NCD alignment verified",
              "code": "L35041",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "SWO signatures on file",
              "code": "84/84",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "HCPCS validation passed",
              "code": "A2005",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Photo evidence captured",
              "code": "Every visit",
              "href": null,
              "aria": null
            },
            {
              "mark": "✓",
              "title": "Chart notes audit-defensible",
              "code": "Reviewed",
              "href": null,
              "aria": null
            }
          ],
          "chart": null,
          "gauge": null
        },
        {
          "title": "Risk gauge",
          "side": true,
          "action": null,
          "rows": null,
          "checks": null,
          "chart": null,
          "gauge": {
            "value": "2.1",
            "of": "/ 10",
            "label": "LOW RISK"
          }
        },
        {
          "title": "Recent reviews",
          "side": true,
          "action": null,
          "rows": [
            {
              "pid": null,
              "text": "Q1 documentation audit",
              "date": null,
              "status": "Passed",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": null,
              "text": "HCPCS frequency check",
              "date": null,
              "status": "Passed",
              "tone": "ok",
              "wide": false
            },
            {
              "pid": null,
              "text": "LCD alignment sweep",
              "date": null,
              "status": "Passed",
              "tone": "ok",
              "wide": false
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        }
      ]
    },
    {
      "key": "claims",
      "heading": "Claims & denials",
      "chip": "This month",
      "live": true,
      "kpis": [
        {
          "label": "Paid (30d)",
          "value": "$146K",
          "trend": "+$24K MoM",
          "tone": "up"
        },
        {
          "label": "Pending",
          "value": "$18.4K",
          "trend": "6 claims",
          "tone": "neutral"
        },
        {
          "label": "Denied",
          "value": "$2.1K",
          "trend": "1 appeal open",
          "tone": "down"
        },
        {
          "label": "Clean-claim rate",
          "value": "96%",
          "trend": "+4 pts YoY",
          "tone": "up"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Claims · Last 10",
          "side": false,
          "action": {
            "label": "Sample CSV",
            "href": "/demo/demo-claims.csv",
            "goto": null,
            "aria": "Download claims sample CSV"
          },
          "rows": [
            {
              "pid": "C-8234",
              "text": "Medicare · E. Ortiz",
              "date": "$124",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            },
            {
              "pid": "C-8231",
              "text": "BCBS · M. Patel",
              "date": "$560",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            },
            {
              "pid": "C-8228",
              "text": "Medicare · R. Greene",
              "date": "$1,480",
              "status": "Pending",
              "tone": "rev",
              "wide": false
            },
            {
              "pid": "C-8224",
              "text": "UHC · J. Khan",
              "date": "$720",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            },
            {
              "pid": "C-8221",
              "text": "Humana · A. Brooks",
              "date": "$890",
              "status": "Appealing",
              "tone": "sent",
              "wide": false
            },
            {
              "pid": "C-8219",
              "text": "Aetna · L. Rivera",
              "date": "$340",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            },
            {
              "pid": "C-8217",
              "text": "Medicare · D. Cohen",
              "date": "$3,920",
              "status": "Paid",
              "tone": "paid",
              "wide": false
            },
            {
              "pid": "C-8214",
              "text": "Cigna · S. Alvarez",
              "date": "$1,120",
              "status": "Pending",
              "tone": "rev",
              "wide": false
            }
          ],
          "checks": null,
          "chart": null,
          "gauge": null
        }
      ]
    },
    {
      "key": "reports",
      "heading": "Reports · Revenue analytics",
      "chip": "Sample data",
      "live": false,
      "kpis": [
        {
          "label": "Revenue (mo)",
          "value": "$146K",
          "trend": "+20% MoM",
          "tone": "up"
        },
        {
          "label": "YoY growth",
          "value": "+38%",
          "trend": "vs. last year",
          "tone": "up"
        },
        {
          "label": "Reports",
          "value": "12",
          "trend": "available",
          "tone": "neutral"
        },
        {
          "label": "Scheduled",
          "value": "Weekly",
          "trend": "auto-sent",
          "tone": "neutral"
        }
      ],
      "filters": null,
      "results": null,
      "cards": [
        {
          "title": "Revenue · 7 months",
          "side": false,
          "action": {
            "label": "Sample CSV",
            "href": "/demo/demo-revenue-7mo.csv",
            "goto": null,
            "aria": "Download revenue 7mo sample CSV"
          },
          "rows": null,
          "checks": null,
          "chart": {
            "bars": [
              {
                "label": "Oct",
                "v": "$88K",
                "size": 40,
                "active": false
              },
              {
                "label": "Nov",
                "v": "$104K",
                "size": 55,
                "active": false
              },
              {
                "label": "Dec",
                "v": "$118K",
                "size": 65,
                "active": false
              },
              {
                "label": "Jan",
                "v": "$112K",
                "size": 60,
                "active": false
              },
              {
                "label": "Feb",
                "v": "$126K",
                "size": 75,
                "active": false
              },
              {
                "label": "Mar",
                "v": "$134K",
                "size": 82,
                "active": false
              },
              {
                "label": "Apr",
                "v": "$146K",
                "size": 95,
                "active": true
              }
            ],
            "labels": [
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "Feb",
              "Mar",
              "Apr"
            ]
          },
          "gauge": null
        },
        {
          "title": "Export reports",
          "side": true,
          "action": null,
          "rows": null,
          "checks": [
            {
              "mark": "↓",
              "title": "Monthly summary",
              "code": "CSV",
              "href": "/demo/demo-monthly-summary.csv",
              "aria": "Download monthly summary sample CSV"
            },
            {
              "mark": "↓",
              "title": "Claims register",
              "code": "CSV",
              "href": "/demo/demo-claims-register.csv",
              "aria": "Download claims register sample CSV"
            },
            {
              "mark": "↓",
              "title": "Patient utilization",
              "code": "CSV",
              "href": "/demo/demo-patient-utilization.csv",
              "aria": "Download patient utilization sample CSV"
            },
            {
              "mark": "↓",
              "title": "Product mix",
              "code": "CSV",
              "href": "/demo/demo-product-mix.csv",
              "aria": "Download product mix sample CSV"
            }
          ],
          "chart": null,
          "gauge": null
        },
        {
          "title": "Top product · revenue",
          "side": true,
          "action": null,
          "rows": null,
          "checks": [
            {
              "mark": "1",
              "title": "ActiGraft+",
              "code": "$48K",
              "href": null,
              "aria": null
            },
            {
              "mark": "2",
              "title": "Adhesion Barrier",
              "code": "$39K",
              "href": null,
              "aria": null
            },
            {
              "mark": "3",
              "title": "Collagen Program",
              "code": "$31K",
              "href": null,
              "aria": null
            }
          ],
          "chart": null,
          "gauge": null
        }
      ]
    }
  ],
  "account": {
    "avatar": "DR",
    "name": "Dr. Elena Romero",
    "email": "Fictional clinical lead account",
    "disclosure": "This account and its records are fictional demonstration data.",
    "stats": [
      {
        "label": "Patients",
        "value": "84 active"
      },
      {
        "label": "Orders (mo)",
        "value": "27"
      },
      {
        "label": "Compliance",
        "value": "100%"
      },
      {
        "label": "Audit risk",
        "value": "Low"
      }
    ],
    "rows": [
      {
        "k": "Role",
        "v": "Clinical lead",
        "ok": false
      },
      {
        "k": "Specialty",
        "v": "Wound care & MIS",
        "ok": false
      },
      {
        "k": "Practice",
        "v": "Contemporary Women’s Health",
        "ok": false
      },
      {
        "k": "Portal access",
        "v": "Admin",
        "ok": true
      },
      {
        "k": "Last login",
        "v": "2 min ago",
        "ok": false
      }
    ],
    "close": "Close account preview"
  },
  "note": "Choose a section to explore the preview. Downloads contain fictional sample data only. Contact our team for current features and access."
};
const D = PORTAL_DEMO;
const FILTER_STATUS = {
  all: () => true,
  shipped: (s) => s === "Shipped",
  delivered: (s) => s === "Delivered",
  paid: (s) => s === "Paid",
  pending: (s) => !["Shipped", "Delivered", "Paid"].includes(s)
};
function Card({ c, goto, filter }) {
  const rows = c.rows && filter ? c.rows.filter((r) => FILTER_STATUS[filter]?.(r.status ?? "") ?? true) : c.rows;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: c.title }),
      c.action ? c.action.href ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "view-all", href: c.action.href, download: true, "aria-label": c.action.aria ?? void 0, children: [
        c.action.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↓" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "view-all", onClick: () => c.action?.goto && goto(c.action.goto), children: [
        c.action.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }) : null
    ] }),
    rows ? rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        r.pid ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pid", children: r.pid }) : null,
        r.text
      ] }),
      r.date ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "date", children: r.date }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      r.status ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("pm-status", r.tone && `pm-status--${r.tone}`), children: r.status }) : null
    ] }, i)) : null,
    c.checks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-check", children: c.checks.map(
      (k, i) => k.href ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "pm-check-item", href: k.href, download: true, "aria-label": k.aria ?? void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mark", children: k.mark }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title", children: k.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code", children: k.code })
      ] }, i) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-check-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mark", children: k.mark }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title", children: k.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "code", children: k.code })
      ] }, i)
    ) }) : null,
    c.chart ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-chart", role: "img", "aria-label": c.title, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-bars", children: c.chart.bars.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("pm-bar", b.active && "pm-bar--active"), style: { height: `${b.size}%` }, title: `${b.label}: ${b.v}` }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-chart-labels", "aria-hidden": "true", children: c.chart.labels.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l }, i)) })
    ] }) : null,
    c.gauge ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-gauge", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        c.gauge.value,
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: c.gauge.of })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.gauge.label })
    ] }) : null
  ] });
}
function View({ v, goto }) {
  const [filter, setFilter] = reactExports.useState("all");
  const main = v.cards.filter((c) => !c.side);
  const side = v.cards.filter((c) => c.side);
  const orderRows = v.filters ? v.cards[0]?.rows ?? [] : [];
  const count = (key) => orderRows.filter((r) => FILTER_STATUS[key]?.(r.status ?? "")).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "region", "aria-labelledby": `pm-h-${v.key}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-main-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: `pm-h-${v.key}`, children: v.heading }),
      v.chip ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pm-chip", children: [
        v.live ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dot", "aria-hidden": "true" }) : null,
        v.chip
      ] }) : null
    ] }),
    v.kpis.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-kpis", children: v.kpis.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-kpi", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: k.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value", children: k.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("trend", `trend--${k.tone}`), children: k.trend })
    ] }, k.label)) }) : null,
    v.filters ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-pills", role: "group", "aria-label": "Filter sample orders", children: v.filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "pm-pill", "aria-pressed": filter === f.key, onClick: () => setFilter(f.key), children: [
        f.label,
        " · ",
        count(f.key)
      ] }, f.key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pm-results", role: "status", children: [
        count(filter),
        " sample orders"
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx(side.length ? "pm-split" : void 0), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-sidecol", children: main.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { c, goto, filter: v.filters ? filter : void 0 }, i)) }),
      side.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-sidecol", children: side.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { c, goto }, i)) }) : null
    ] })
  ] });
}
function PortalPreview() {
  const [view, setView] = reactExports.useState(D.views[0].key);
  const dialog = reactExports.useRef(null);
  const id = reactExports.useId();
  const current = D.views.find((v) => v.key === view) ?? D.views[0];
  const label = D.mobile.options.find((o) => o.value === current.key)?.label ?? current.heading;
  const open = () => dialog.current?.showModal();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-shell", id: "portal-demo", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          D.top.url,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pm-demo-label", children: D.top.demoLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-mobile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `${id}-view`, children: D.mobile.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: `${id}-view`, className: "cl-select", value: view, onChange: (e) => setView(e.target.value), children: D.mobile.options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-btn", "aria-label": D.mobile.accountAria, onClick: open, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 22v-3a8 8 0 0 1 16 0v3" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "pm-side", "aria-label": "Portal preview sections", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-brand", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mark", "aria-hidden": "true", children: D.brand.mark }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: D.brand.name })
          ] }),
          D.nav.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-group", children: g.label }),
            g.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "pm-item", "aria-pressed": view === it.view, onClick: () => setView(it.view), children: [
              it.label,
              it.badge ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: it.badge }) : null
            ] }, it.view))
          ] }, g.label)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "pm-user", "aria-label": D.user.aria, onClick: open, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pm-avatar", "aria-hidden": "true", children: D.user.avatar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: D.user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "role", children: D.user.role })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-main", children: /* @__PURE__ */ jsxRuntimeExports.jsx(View, { v: current, goto: setView }, current.key) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dialog", { ref: dialog, className: "pm-dialog", "aria-labelledby": `${id}-acct`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-dialog-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-dialog-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pm-avatar", "aria-hidden": "true", children: D.account.avatar }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "name", id: `${id}-acct`, children: D.account.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "email", children: D.account.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "disclosure", children: D.account.disclosure }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pm-dialog-stats", children: D.account.stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value", children: s.value })
        ] }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: D.account.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pm-dialog-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "k", children: r.k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("v", r.ok && "v--ok"), children: r.v })
        ] }, r.k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn--primary", onClick: () => dialog.current?.close(), children: D.account.close })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pm-note", children: D.note })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicalStyles, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero", "aria-labelledby": "portal-h1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero-copy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-crumbs", children: PORTAL.hero.crumbs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c }, c)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "portal-h1", className: "cl-hero-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: PORTAL.hero.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-hero-lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: PORTAL.hero.lead }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: PORTAL.hero.primary.href, className: "btn btn--primary", children: PORTAL.hero.primary.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: PORTAL.hero.secondary.href, className: "link-arrow", children: [
              PORTAL.hero.secondary.label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↓" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-hero-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-mosaic", children: PORTAL.hero.photos.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: p.image, alt: p.alt, sizes: i === 0 ? "(max-width: 900px) 56vw, 28vw" : "(max-width: 900px) 36vw, 18vw", priority: i === 0 }) }, p.image)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-stats", style: {
        marginTop: 28
      }, children: PORTAL.hero.stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-stat", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.desc })
      ] }, s.value)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: "preview", "aria-labelledby": "demo-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "demo-title", eyebrow: PORTAL.demo.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: PORTAL.demo.title }), lead: PORTAL.demo.text, center: true, className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PortalPreview, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: "capabilities", "aria-labelledby": "caps-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { id: "caps-title", eyebrow: PORTAL.caps.eyebrow, title: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: PORTAL.caps.title }), aside: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: PORTAL.caps.lead }), className: "cl-h2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-grid-3", children: PORTAL.caps.items.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "cap", style: {
        background: "#fff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cap-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: c.image, alt: c.alt, sizes: "(max-width: 640px) 94vw, (max-width: 1023px) 46vw, 31vw" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cap-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: c.text })
        ] })
      ] }, c.title)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-label": PORTAL.cta.eyebrow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "portal-cta", eyebrow: PORTAL.cta.eyebrow, title: PORTAL.cta.title, text: PORTAL.cta.text, cta: PORTAL.cta.primary, image: PORTAL.cta.image, alt: PORTAL.cta.alt }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: PORTAL.info.title, notes: [...PORTAL.info.notes, /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: PORTAL.cta.secondary.href, className: "link-arrow", children: [
      PORTAL.cta.secondary.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
    ] }, "why")] })
  ] });
}
export {
  Page as component
};
