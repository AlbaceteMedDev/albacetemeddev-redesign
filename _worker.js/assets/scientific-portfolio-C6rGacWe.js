import { r as reactExports, V as jsxRuntimeExports } from "./server-B4VclHNy.js";
import { e as cx, A as AppLink, P as Picture, f as IDENTITY, g as IMG, h as SubNav, R as Reveal, a as SplitRow, E as EditorialGrid, i as EditorialCard, b as StatementPanel, I as InfoBand } from "./router-BKKY7m0h.js";
import { H as Html, C as ClinicalStyles } from "./Html-B-oyYRkD.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const PORTFOLIO = {
  "hero": {
    "crumb": [
      "Clinical resources",
      "Scientific portfolio"
    ],
    "kicker": "A reference for healthcare professionals",
    "title": "Scientific <em>portfolio.</em>",
    "deck": "Explore the products by material and format, inspect the manufacturer references, and read the research behind them.",
    "links": [
      {
        "label": "Explore the products",
        "href": "#product-reference",
        "external": false
      },
      {
        "label": "Read the research",
        "href": "#study-notes",
        "external": false
      }
    ],
    "cover": {
      "image": "membrane-wrap-hydro",
      "alt": "BioLab Sciences white box with orange and blue branding and printed water-droplet artwork",
      "open": "Inspect the packaging ↗",
      "caption": "Membrane Wrap Hydro · BioLab Sciences packaging"
    },
    "issue": [
      "Albacete MedDev / Wound care",
      "Materials, study notes & source documents"
    ]
  },
  "toc": {
    "items": [
      {
        "num": "01",
        "label": "Product reference",
        "href": "#product-reference"
      },
      {
        "num": "02",
        "label": "Materials & membranes",
        "href": "#materials"
      },
      {
        "num": "03",
        "label": "Dressings & matrices",
        "href": "#dressings"
      },
      {
        "num": "04",
        "label": "Devices & adjuncts",
        "href": "#devices"
      },
      {
        "num": "05",
        "label": "Notes on the evidence",
        "href": "#study-notes"
      }
    ],
    "library": {
      "label": "Full evidence library",
      "href": "/evidence",
      "external": false
    }
  },
  "chapters": {
    "product-reference": {
      "id": "product-reference",
      "num": "01",
      "label": "Product reference",
      "title": "The product <em>reference.</em>",
      "intro": [
        "Browse the materials, packaging and equipment. Open an image for a closer view and its published source image."
      ],
      "photo": "clinical-lab",
      "find": {
        "label": "Find by product, manufacturer or format",
        "placeholder": "Try Membrane Wrap Hydro",
        "clear": "Clear",
        "legend": "Filter by product category",
        "filters": [
          {
            "key": "",
            "label": "All products"
          },
          {
            "key": "membranes",
            "label": "Membranes"
          },
          {
            "key": "matrices",
            "label": "Dressings & matrices"
          },
          {
            "key": "devices",
            "label": "Devices & systems"
          }
        ]
      },
      "products": [
        {
          "key": "amchoplast",
          "category": "membranes",
          "search": "AmchoPlast Cellution Biologics Dehydrated membrane Amnion · intermediate layer · chorion",
          "image": "amchoplast",
          "identity": null,
          "wordmark": null,
          "alt": "AmchoPlast purple and white package in natural daylight",
          "visual": {
            "href": "/assets/images/editorial/amchoplast-20261008.webp",
            "aria": "View AmchoPlast imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Cellution Biologics",
          "name": "AmchoPlast",
          "href": "/products/amchoplast",
          "format": "Dehydrated membrane",
          "material": "Amnion · intermediate layer · chorion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/amchoplast",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-amchoplast",
              "external": false
            }
          ]
        },
        {
          "key": "membrane-wrap-hydro",
          "category": "membranes",
          "search": "Membrane Wrap Hydro BioLab Holdings Hydrated membrane Amnion · amnion",
          "image": "membrane-wrap-hydro-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Membrane Wrap Hydro carton from BioLab Sciences with the hydrated membrane pouch",
          "visual": {
            "href": "/assets/images/editorial/membrane-wrap-hydro-box-20261008.webp",
            "aria": "View Membrane Wrap Hydro imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "BioLab Holdings",
          "name": "Membrane Wrap Hydro",
          "href": "/products/membrane-wrap-hydro",
          "format": "Hydrated membrane",
          "material": "Amnion · amnion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/membrane-wrap-hydro",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-membrane-wrap-hydro",
              "external": false
            }
          ]
        },
        {
          "key": "microlyte",
          "category": "matrices",
          "search": "Microlyte SAM Imbed Biosciences · BioLab Ultrathin matrix Synthetic polymers · silver",
          "image": "microlyte-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Microlyte Matrix navy carton from Imbed Biosciences with its foil pouch",
          "visual": {
            "href": "/assets/images/editorial/microlyte-20261008.webp",
            "aria": "View Microlyte SAM imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Imbed Biosciences · BioLab",
          "name": "Microlyte SAM",
          "href": "/products/microlyte",
          "format": "Ultrathin matrix",
          "material": "Synthetic polymers · silver",
          "links": [
            {
              "label": "Product details",
              "href": "/products/microlyte",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-microlyte-sam",
              "external": false
            }
          ]
        },
        {
          "key": "apis",
          "category": "matrices",
          "search": "APIS SweetBio Matrix sheet Collagen · Mānuka honey",
          "image": "apis-pack",
          "identity": null,
          "wordmark": null,
          "alt": "APIS by SweetBio carton with the sterile peel pouch and amber wafer",
          "visual": {
            "href": "/assets/images/editorial/apis-20261008.webp",
            "aria": "View APIS imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "SweetBio",
          "name": "APIS",
          "href": "/products/apis",
          "format": "Matrix sheet",
          "material": "Collagen · Mānuka honey",
          "links": [
            {
              "label": "Product details",
              "href": "/products/apis",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-apis",
              "external": false
            }
          ]
        },
        {
          "key": "ultramist",
          "category": "devices",
          "search": "UltraMIST SANUWAVE Non-contact device Low-frequency ultrasound",
          "image": "ultramist",
          "identity": null,
          "wordmark": null,
          "alt": "SANUWAVE UltraMIST unit with its handpiece docked",
          "visual": {
            "href": "/assets/images/editorial/ultramist-20261008.webp",
            "aria": "View UltraMIST imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "SANUWAVE",
          "name": "UltraMIST",
          "href": "/products/ultramist",
          "format": "Non-contact device",
          "material": "Low-frequency ultrasound",
          "links": [
            {
              "label": "Product details",
              "href": "/products/ultramist",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-ultramist",
              "external": false
            }
          ]
        },
        {
          "key": "microdoc",
          "category": "devices",
          "search": "MicroDoc Pensar Medical Portable single-use device Negative pressure wound therapy",
          "image": "microdoc",
          "identity": null,
          "wordmark": null,
          "alt": "MicroDoc portable unit held in a hand to show its scale",
          "visual": {
            "href": "/assets/images/editorial/microdoc-20261008.webp",
            "aria": "View MicroDoc imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Pensar Medical",
          "name": "MicroDoc",
          "href": "/products/microdoc",
          "format": "Portable single-use device",
          "material": "Negative pressure wound therapy",
          "links": [
            {
              "label": "Product details",
              "href": "/products/microdoc",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-microdoc",
              "external": false
            }
          ]
        },
        {
          "key": "activate",
          "category": "membranes",
          "search": "Activate Matrix Sequence LifeScience Dehydrated membrane Amnion · intermediate layer · chorion",
          "image": "activate-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Activate Matrix carton and foil pouch, Nvision Biomedical Technologies",
          "visual": {
            "href": "https://sequencelifesci.com/activate/",
            "aria": "Activate Matrix manufacturer reference",
            "label": "Manufacturer reference ↗",
            "external": true
          },
          "maker": "Sequence LifeScience",
          "name": "Activate Matrix",
          "href": "/products/activate",
          "format": "Dehydrated membrane",
          "material": "Amnion · intermediate layer · chorion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/activate",
              "external": false
            },
            {
              "label": "Source information",
              "href": "https://sequencelifesci.com/activate/",
              "external": true
            }
          ]
        },
        {
          "key": "palisade",
          "category": "membranes",
          "search": "Palisade Sequence LifeScience Dehydrated membrane Amnion · chorion",
          "image": "palisade-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Palisade DM Matrix carton and foil pouch, Nvision Biomedical Technologies",
          "visual": {
            "href": "https://sequencelifesci.com/palisade-2/",
            "aria": "Palisade manufacturer reference",
            "label": "Manufacturer reference ↗",
            "external": true
          },
          "maker": "Sequence LifeScience",
          "name": "Palisade",
          "href": "/products/palisade",
          "format": "Dehydrated membrane",
          "material": "Amnion · chorion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/palisade",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-palisade",
              "external": false
            }
          ]
        },
        {
          "key": "sentry-sl",
          "category": "membranes",
          "search": "Sentry SL Sequence LifeScience Dehydrated membrane Single-layer amnion",
          "image": "sentry-sl-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Sentry SL Matrix carton and foil pouch, Sequence LifeScience",
          "visual": {
            "href": "https://sequencelifesci.com/sentry-2/",
            "aria": "Sentry SL manufacturer reference",
            "label": "Manufacturer reference ↗",
            "external": true
          },
          "maker": "Sequence LifeScience",
          "name": "Sentry SL",
          "href": "/products/sentry-sl",
          "format": "Dehydrated membrane",
          "material": "Single-layer amnion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/sentry-sl",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-sentry-sl",
              "external": false
            }
          ]
        },
        {
          "key": "membrane-wrap",
          "category": "membranes",
          "search": "Membrane Wrap BioLab Holdings Membrane sheet Amnion · amnion",
          "image": "membrane-wrap-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Membrane Wrap carton from BioLab Sciences with the membrane in its pouch",
          "visual": {
            "href": "/assets/images/editorial/membrane-wrap-20261008.webp",
            "aria": "View Membrane Wrap imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "BioLab Holdings",
          "name": "Membrane Wrap",
          "href": "/products/membrane-wrap",
          "format": "Membrane sheet",
          "material": "Amnion · amnion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/membrane-wrap",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-membrane-wrap",
              "external": false
            }
          ]
        },
        {
          "key": "tri-membrane-wrap",
          "category": "membranes",
          "search": "Tri-Membrane Wrap BioLab Holdings Triple-layer membrane Amnion · chorion · amnion",
          "image": "tri-membrane-wrap-pack",
          "identity": null,
          "wordmark": null,
          "alt": "Tri-Membrane Wrap carton from BioLab Sciences with the membrane in its pouch",
          "visual": {
            "href": "/assets/images/editorial/tri-membrane-wrap-20261008.webp",
            "aria": "View Tri-Membrane Wrap imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "BioLab Holdings",
          "name": "Tri-Membrane Wrap",
          "href": "/products/tri-membrane-wrap",
          "format": "Triple-layer membrane",
          "material": "Amnion · chorion · amnion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/tri-membrane-wrap",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-tri-membrane-wrap",
              "external": false
            }
          ]
        },
        {
          "key": "xcell-amnio-matrix",
          "category": "membranes",
          "search": "XCell Amnio Matrix Precise Bioscience · New Horizon Lyophilized membrane Human amniotic membrane",
          "image": "xcell-amnio-matrix",
          "identity": null,
          "wordmark": null,
          "alt": "Two XCell Amnio Matrix cartons with blue and green Precise Bioscience artwork",
          "visual": {
            "href": "/assets/images/editorial/xcell-amnio-matrix-20261008.webp",
            "aria": "View XCell Amnio Matrix imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Precise Bioscience · New Horizon",
          "name": "XCell Amnio Matrix",
          "href": "/products/xcell-amnio-matrix",
          "format": "Lyophilized membrane",
          "material": "Human amniotic membrane",
          "links": [
            {
              "label": "Product details",
              "href": "/products/xcell-amnio-matrix",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-xcell-amnio-matrix",
              "external": false
            }
          ]
        },
        {
          "key": "palingen",
          "category": "membranes",
          "search": "PalinGen Membrane Amnio Technology Air-dried membrane Human amnion",
          "image": "palingen",
          "identity": null,
          "wordmark": null,
          "alt": "PalinGen package with its manufacturer-referenced tray configuration",
          "visual": {
            "href": "/assets/images/editorial/palingen-20261008.webp",
            "aria": "View PalinGen Membrane imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Amnio Technology",
          "name": "PalinGen Membrane",
          "href": "/products/palingen",
          "format": "Air-dried membrane",
          "material": "Human amnion",
          "links": [
            {
              "label": "Product details",
              "href": "/products/palingen",
              "external": false
            },
            {
              "label": "Source information",
              "href": "https://amniotechnology.com/index.php/palingen-membrane/",
              "external": true
            }
          ]
        },
        {
          "key": "microlyte-painguard",
          "category": "matrices",
          "search": "Microlyte PainGuard Imbed Biosciences · BioLab Ultrathin matrix Synthetic polymers · silver · lidocaine",
          "image": "microlyte-painguard",
          "identity": null,
          "wordmark": null,
          "alt": "Microlyte PainGuard with Lidocaine white, blue and green carton",
          "visual": {
            "href": "/assets/images/editorial/microlyte-painguard-20261008.webp",
            "aria": "View Microlyte PainGuard imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Imbed Biosciences · BioLab",
          "name": "Microlyte PainGuard",
          "href": "/products/microlyte-painguard",
          "format": "Ultrathin matrix",
          "material": "Synthetic polymers · silver · lidocaine",
          "links": [
            {
              "label": "Product details",
              "href": "/products/microlyte-painguard",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-microlyte-painguard",
              "external": false
            }
          ]
        },
        {
          "key": "myriad-matrix",
          "category": "matrices",
          "search": "Myriad Matrix AROA Biosurgery Perforated matrix sheet Ovine extracellular matrix",
          "image": "myriad-matrix",
          "identity": null,
          "wordmark": null,
          "alt": "AROA Myriad Matrix soft tissue bioscaffold package",
          "visual": {
            "href": "/assets/images/editorial/myriad-matrix-20261008.webp",
            "aria": "View Myriad Matrix imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "AROA Biosurgery",
          "name": "Myriad Matrix",
          "href": "/products/myriad-matrix",
          "format": "Perforated matrix sheet",
          "material": "Ovine extracellular matrix",
          "links": [
            {
              "label": "Product details",
              "href": "/products/myriad-matrix",
              "external": false
            },
            {
              "label": "Source information",
              "href": "https://aroa.com/product/myriad-matrix-ecm/",
              "external": true
            }
          ]
        },
        {
          "key": "interfyl",
          "category": "matrices",
          "search": "Interfyl Celularity Flowable · particulate Human connective tissue matrix",
          "image": "interfyl",
          "identity": null,
          "wordmark": null,
          "alt": "Interfyl 100 mg Flowable cartons in red, purple and white",
          "visual": {
            "href": "/assets/images/editorial/interfyl-20261008.webp",
            "aria": "View Interfyl imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Celularity",
          "name": "Interfyl",
          "href": "/products/interfyl",
          "format": "Flowable · particulate",
          "material": "Human connective tissue matrix",
          "links": [
            {
              "label": "Product details",
              "href": "/products/interfyl",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-interfyl",
              "external": false
            }
          ]
        },
        {
          "key": "xcellistem",
          "category": "matrices",
          "search": "XCelliStem StemSys Wound powder Multi-tissue extracellular matrix",
          "image": "xcellistem-pack",
          "identity": null,
          "wordmark": null,
          "alt": "XCelliStem Wound Powder jar and Tyvek pouch from Stemsys",
          "visual": {
            "href": "/assets/images/editorial/xcellistem-20261008.webp",
            "aria": "View XCelliStem imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "StemSys",
          "name": "XCelliStem",
          "href": "/products/xcellistem",
          "format": "Wound powder",
          "material": "Multi-tissue extracellular matrix",
          "links": [
            {
              "label": "Product details",
              "href": "/products/xcellistem",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-xcellistem",
              "external": false
            }
          ]
        },
        {
          "key": "arobella",
          "category": "devices",
          "search": "Arobella Qoustic Arobella Medical Console · handpiece Ultrasonic debridement",
          "image": "arobella",
          "identity": null,
          "wordmark": null,
          "alt": "Arobella Qoustic console with the manufacturer-referenced control panel",
          "visual": {
            "href": "/assets/images/editorial/arobella-20261008.webp",
            "aria": "View Arobella Qoustic imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "Arobella Medical",
          "name": "Arobella Qoustic",
          "href": "/products/arobella",
          "format": "Console · handpiece",
          "material": "Ultrasonic debridement",
          "links": [
            {
              "label": "Product details",
              "href": "/products/arobella",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-arobella",
              "external": false
            }
          ]
        },
        {
          "key": "actigraft",
          "category": "devices",
          "search": "ActiGraft RedDress Point-of-care system Patient-derived whole blood clot",
          "image": "actigraft",
          "identity": null,
          "wordmark": null,
          "alt": "Closed ActiGraft PRO kit with magenta and white packaging",
          "visual": {
            "href": "/assets/images/editorial/actigraft-20261008.webp",
            "aria": "View ActiGraft imagery",
            "label": "Inspect ↗",
            "external": false
          },
          "maker": "RedDress",
          "name": "ActiGraft",
          "href": "/products/actigraft",
          "format": "Point-of-care system",
          "material": "Patient-derived whole blood clot",
          "links": [
            {
              "label": "Product details",
              "href": "/products/actigraft",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-actigraft",
              "external": false
            }
          ]
        }
      ],
      "empty": "No matching products. Try a shorter name or clear your search.",
      "showAll": "Show all products",
      "imageNote": "Product photographs are based on published product references. Where an exact product photograph is unavailable, the manufacturer reference is shown. Always consult the current package and instructions for use."
    },
    "materials": {
      "id": "materials",
      "num": "02",
      "label": "Materials & membranes",
      "title": "Tissue source, structure and <em>processing.</em>",
      "intro": [
        "A membrane, a particulate matrix and an autologous clot differ in source, structure and preparation. Those differences are the starting point for a product review.",
        "For a placental membrane, identify the tissues retained, the processing method and the supplied format. Then look for clinical research on that exact product."
      ],
      "groups": [
        {
          "title": "Placental membranes",
          "small": "Sheet formats",
          "text": "AmchoPlast retains amnion, intermediate layer and chorion in a dehydrated sheet. The portfolio also includes hydrated membranes, single-layer amnion and other multilayer constructions. Product-specific handling instructions belong alongside the material description.",
          "links": [
            {
              "label": "AmchoPlast",
              "href": "/products/amchoplast",
              "external": false
            },
            {
              "label": "Membrane Wrap Hydro",
              "href": "/products/membrane-wrap-hydro",
              "external": false
            },
            {
              "label": "Activate Matrix",
              "href": "/products/activate",
              "external": false
            }
          ]
        },
        {
          "title": "Connective tissue & ECM",
          "small": "Sheets & particulates",
          "text": "Extracellular matrix (ECM) products vary in tissue source and physical form. Review the composition and intended use of each product, including whether it is supplied as a sheet, powder, particulate or flowable material.",
          "links": [
            {
              "label": "Interfyl",
              "href": "/products/interfyl",
              "external": false
            },
            {
              "label": "XCelliStem",
              "href": "/products/xcellistem",
              "external": false
            },
            {
              "label": "Myriad Matrix",
              "href": "/products/myriad-matrix",
              "external": false
            }
          ]
        },
        {
          "title": "Autologous preparations",
          "small": "Point-of-care systems",
          "text": "ActiGraft is a system for preparing a whole-blood clot from the patient’s own blood. Its preparation requirements and evidence should be reviewed separately from those of donated-tissue allografts.",
          "links": [
            {
              "label": "ActiGraft",
              "href": "/products/actigraft",
              "external": false
            },
            {
              "label": "Studies & records",
              "href": "/evidence#ev-actigraft",
              "external": false
            }
          ]
        }
      ],
      "note": {
        "title": "When comparing membranes",
        "text": "Layer count describes construction. A claim of better healing needs a clinical comparison. Check the product studied, the wound population and the treatment used in the comparison group."
      },
      "source": {
        "prefix": "Material reference:",
        "link": {
          "label": "Cellution Biologics · AmchoPlast",
          "href": "https://www.cellutionbiologics.com/products/amchoplast"
        }
      }
    },
    "dressings": {
      "id": "dressings",
      "num": "03",
      "label": "Dressings & matrices",
      "title": "Polymer and collagen-based <em>dressings.</em>",
      "intro": [
        "Product descriptions often begin with a material or a proposed mechanism: collagen, silver, a polymer scaffold. A useful review also considers the indicated use, application requirements and the evidence in patients."
      ],
      "feature": {
        "image": "microlyte-pack",
        "alt": "Microlyte Matrix navy blue carton with cyan and yellow artwork",
        "caption": "Microlyte",
        "title": "Microlyte",
        "text": "A synthetic, bioresorbable polymer matrix containing silver. The manufacturer describes its antimicrobial performance and material characteristics; the human pilot study answers a different question about wound progress over time.",
        "link": {
          "label": "Read the study note",
          "href": "#study-notes",
          "external": false
        },
        "source": {
          "label": "Manufacturer reference",
          "href": "https://imbedbio.com/products/microlyte/",
          "external": true
        }
      },
      "second": {
        "text": "APIS combines a gelatin-based material with Mānuka honey and hydroxyapatite. Its published retrospective evaluation is discussed below, including the distinction between time to closure and the proportion of wounds that closed.",
        "link": {
          "label": "APIS product information",
          "href": "/products/apis",
          "external": false
        }
      },
      "note": {
        "title": "From mechanism to outcome",
        "text": "Laboratory antimicrobial activity, material resorption and wound closure are different endpoints. Read the study method before applying a percentage to patient care."
      }
    },
    "devices": {
      "id": "devices",
      "num": "04",
      "label": "Devices & adjuncts",
      "title": "Ultrasound and negative <em>pressure.</em>",
      "intro": [
        "The device portfolio includes contact ultrasound, non-contact ultrasound and negative pressure. Each has its own instructions, treatment workflow and body of evidence."
      ],
      "devices": [
        {
          "image": "arobella",
          "alt": "Arobella Qoustic console with the manufacturer-referenced control panel",
          "open": "Inspect ↗",
          "href": "/assets/images/editorial/arobella-20261008.webp",
          "title": "Qoustic",
          "maker": "Arobella Medical",
          "text": "An ultrasonic system with a handpiece and irrigation, used for tissue removal and wound cleansing. Review the selected instrument and technique against the manufacturer’s instructions.",
          "links": [
            {
              "label": "Product details",
              "href": "/products/arobella",
              "external": false
            },
            {
              "label": "Manufacturer documentation",
              "href": "https://arobella.com/products/",
              "external": true
            }
          ]
        },
        {
          "image": "ultramist",
          "alt": "SANUWAVE UltraMIST unit with its handpiece docked",
          "open": "Inspect ↗",
          "href": "/assets/images/editorial/ultramist-20261008.webp",
          "title": "UltraMIST",
          "maker": "SANUWAVE",
          "text": "A system that delivers low-frequency ultrasound through a non-contact fluid mist. When reading a study, check the wound type, treatment frequency and care provided to both study groups.",
          "links": [
            {
              "label": "Product details",
              "href": "/products/ultramist",
              "external": false
            },
            {
              "label": "Manufacturer documentation",
              "href": "https://sanuwave.com/products/ultramist/",
              "external": true
            }
          ]
        },
        {
          "image": "microdoc",
          "alt": "MicroDoc portable unit held in a hand to show its scale",
          "open": "Inspect ↗",
          "href": "/assets/images/editorial/microdoc-20261008.webp",
          "title": "MicroDoc",
          "maker": "Pensar Medical",
          "text": "A portable, single-use negative pressure wound therapy system. Review the device-specific indications, dressing requirements and operating instructions, and identify which studies evaluate this system.",
          "links": [
            {
              "label": "Product details",
              "href": "/products/microdoc",
              "external": false
            },
            {
              "label": "Manufacturer documentation",
              "href": "https://pensarmedical.com/microdoc/",
              "external": true
            }
          ]
        }
      ]
    },
    "study-notes": {
      "id": "study-notes",
      "num": "05",
      "label": "Notes on the evidence",
      "title": "Selected clinical <em>studies.</em>",
      "intro": [
        'These two papers illustrate why the study design, denominator and endpoint belong next to a reported result. They are selected reading from the broader <a href="/evidence">evidence library</a>.'
      ],
      "studies": [
        {
          "meta": "Microlyte / Prospective pilot / 2020",
          "title": "A bioresorbable matrix in complex chronic wounds",
          "text": "Manning and colleagues evaluated 32 wounds after losses to follow-up. At 12 weeks, 29 had either healed completely or improved significantly. Established care, including debridement or compression when prescribed, continued during the study.",
          "interpretation": "<strong>Interpretation:</strong> This was an open-label study without a concurrent control group. The combined outcome cannot be read as a complete-closure rate.",
          "examine": {
            "summary": "What to examine in the paper",
            "text": "Separate complete closure from improvement, note the mixed wound types, and review the care continued alongside the matrix."
          },
          "citation": "Manning SW et al. <cite>Wounds.</cite> 2020;32(11):309–318.",
          "link": {
            "label": "Read the paper on PubMed",
            "href": "https://pubmed.ncbi.nlm.nih.gov/33465043/",
            "external": true
          }
        },
        {
          "meta": "APIS / Retrospective comparison / 2023",
          "title": "A collagen-based sheet in a hospital wound clinic",
          "text": "Rodríguez and colleagues compared 47 chronic wounds: 27 treated with the bioengineered sheet and 20 with standard care. Among wounds that closed, mean time to closure was 7.4 and 14.8 weeks, respectively.",
          "interpretation": "<strong>Interpretation:</strong> Most wounds in both groups did not close. The retrospective design and the analysis of wounds that closed limit how broadly the time-to-closure finding can be applied.",
          "examine": {
            "summary": "What to examine in the paper",
            "text": "Review the treatments included in standard care, visit adherence and the reasons some wounds remained open."
          },
          "citation": "Rodríguez I et al. <cite>Wounds.</cite> 2023;35(1):E35–E38.",
          "link": {
            "label": "Read the paper on PubMed",
            "href": "https://pubmed.ncbi.nlm.nih.gov/36749996/",
            "external": true
          }
        }
      ],
      "endpoint": {
        "quote": "“Healed or improved” and “healed completely” answer different questions.",
        "note": 'The distinction matters when discussing the 12-week result in the <a href="https://pubmed.ncbi.nlm.nih.gov/33465043/" target="_blank" rel="noopener">Manning pilot study</a>.'
      }
    }
  },
  "close": {
    "photo": "clinical-consult",
    "text": "Prepared by Albacete MedDev as a product and literature reference. Clinical selection remains patient-specific and should follow the current manufacturer instructions. References to products, studies or codes do not establish payer coverage.",
    "link": {
      "label": "Request product information or a study review",
      "href": "/contact"
    }
  }
};
const ch = PORTFOLIO.chapters["product-reference"];
function fullSize(p) {
  if (!p.image) return p.visual.href;
  const a = IMG[p.image];
  return `/img/${a.slug}-${a.widths[a.widths.length - 1]}.webp`;
}
function Media({ p }) {
  if (p.image) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "sp-card-media", href: fullSize(p), target: "_blank", rel: "noopener", "aria-label": p.visual.aria, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: p.image, alt: p.alt, sizes: "(max-width: 420px) 94vw, (max-width: 760px) 46vw, (max-width: 1023px) 31vw, 320px" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sp-card-open", children: p.visual.label })
    ] });
  }
  if (p.identity) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "sp-card-media sp-card-media--plate", href: p.visual.href, target: "_blank", rel: "noopener", "aria-label": p.visual.aria, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: IDENTITY[p.identity], alt: p.alt, width: 500, height: 152, loading: "lazy", decoding: "async" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sp-card-open", children: p.visual.label })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "sp-card-media sp-card-media--text", href: p.visual.href, target: "_blank", rel: "noopener", "aria-label": p.visual.aria, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.wordmark }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sp-card-open", children: p.visual.label.endsWith("↗") ? p.visual.label : `${p.visual.label} ↗` })
  ] });
}
function ProductCard({ p }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "sp-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Media, { p }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-card-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "sp-card-maker", html: p.maker }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: p.href, children: p.name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-card-format", children: p.format }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-card-material", children: p.material }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sp-card-links", children: p.links.map(
        (l) => l.external ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, target: "_blank", rel: "noopener", className: "cl-ext", children: l.label }, l.href) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }, l.href)
      ) })
    ] })
  ] });
}
function PortfolioReference() {
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("");
  const id = reactExports.useId();
  const needle = q.trim().toLowerCase();
  const list = ch.products.filter((p) => (!cat || p.category === cat) && (!needle || p.search.toLowerCase().includes(needle)));
  const filtered = needle !== "" || cat !== "";
  const reset = () => {
    setQ("");
    setCat("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "cl-tools", role: "search", onSubmit: (e) => e.preventDefault(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `${id}-q`, children: ch.find.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: `${id}-q`, className: "cl-input", type: "search", placeholder: ch.find.placeholder, autoComplete: "off", value: q, onChange: (e) => setQ(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-field cl-field--span", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cl-field", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: ch.find.legend }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-pills", role: "group", "aria-label": ch.find.legend, children: [
          ch.find.filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: cx("tab"), "aria-pressed": cat === f.key, "aria-selected": cat === f.key, onClick: () => setCat(f.key), children: f.label }, f.key)),
          q ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "tab", onClick: () => setQ(""), children: ch.find.clear }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-status", role: "status", children: filtered ? `${list.length} of ${ch.products.length} products` : `${ch.products.length} products` })
    ] }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: ch.empty }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn--outline", style: { marginTop: 14 }, onClick: reset, children: ch.showAll })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "sp-grid", "aria-label": ch.label, children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p }, p.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "sp-source", html: ch.imageNote })
  ] });
}
const P = PORTFOLIO;
const C = P.chapters;
const MATERIAL_PHOTOS = [{
  image: "amchoplast",
  alt: "AmchoPlast purple and white package in natural daylight"
}, {
  image: "interfyl",
  alt: "Interfyl 100 mg Flowable cartons in red, purple and white"
}, {
  image: "actigraft",
  alt: "Closed ActiGraft PRO kit with magenta and white packaging"
}];
const full = (k) => `/img/${IMG[k].slug}-${IMG[k].widths[IMG[k].widths.length - 1]}.webp`;
function ChapterHead({
  num,
  label,
  title,
  intro
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "section-head", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "cl-chapter", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: num }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "h2 cl-h2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: title }) }),
    intro.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead cl-inline", style: {
      marginTop: 14
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: t }) }, i))
  ] });
}
function Page() {
  const ref = C["product-reference"];
  const mat = C.materials;
  const dr = C.dressings;
  const dev = C.devices;
  const st = C["study-notes"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicalStyles, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubNav, { title: "Scientific portfolio", titleHref: "/scientific-portfolio", items: P.toc.items.map((i) => ({
      href: i.href,
      label: i.label
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "hero", "aria-labelledby": "portfolio-h1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-hero-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-crumbs", children: P.hero.crumb.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: P.hero.kicker }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "portfolio-h1", className: "cl-hero-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: P.hero.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-hero-lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: P.hero.deck }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: P.hero.links[0].href, className: "btn btn--primary", children: P.hero.links[0].label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: P.hero.links[1].href, className: "link-arrow", children: [
            P.hero.links[1].label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↓" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-issue", style: {
          marginTop: 28
        }, children: P.hero.issue.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-hero-media", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "sp-cover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "sp-cover-media", href: full(P.hero.cover.image), target: "_blank", rel: "noopener", "aria-label": "View Membrane Wrap Hydro imagery", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: P.hero.cover.image, alt: P.hero.cover.alt, sizes: "(max-width: 900px) 92vw, 44vw", priority: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sp-cover-open", children: P.hero.cover.open })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { children: P.hero.cover.caption })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: ref.id, "aria-labelledby": "reference-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterHead, { num: ref.num, label: ref.label, title: ref.title, intro: ref.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-photo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: ref.photo, alt: "Scientist examining a sample at a microscope", sizes: "(max-width: 1440px) 96vw, 1376px" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PortfolioReference, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: mat.id, "aria-labelledby": "materials-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterHead, { num: mat.num, label: mat.label, title: mat.title, intro: mat.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-grid-3", children: mat.groups.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "sp-mat", style: {
        background: "#fff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sp-mat-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image: MATERIAL_PHOTOS[i].image, alt: MATERIAL_PHOTOS[i].alt, sizes: "(max-width: 640px) 94vw, (max-width: 1023px) 46vw, 31vw" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-mat-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-num", children: g.small }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: g.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: g.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-pills", children: g.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, className: "btn btn--outline btn--sm", children: l.label }, l.href)) })
        ] })
      ] }, g.title)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cl-grid-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sp-note", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: mat.note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: mat.note.text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sp-source", style: {
          alignSelf: "center"
        }, children: [
          mat.source.prefix,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: mat.source.link.href, target: "_blank", rel: "noopener", className: "cl-ext", children: mat.source.link.label })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: dr.id, "aria-labelledby": "dressings-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterHead, { num: dr.num, label: dr.label, title: dr.title, intro: dr.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "dressing-microlyte", eyebrow: dr.feature.caption, title: dr.feature.title, image: dr.feature.image, alt: dr.feature.alt, cta: dr.feature.link, secondary: dr.feature.source, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "lead", html: dr.feature.text }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "dressing-apis", eyebrow: "APIS", title: "APIS", image: "apis", alt: "Close view of the amber APIS matrix sheet on glass", reverse: true, tone: "white", cta: dr.second.link, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "lead", html: dr.second.text }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sp-note", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: dr.note.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: dr.note.text })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section band", id: dev.id, "aria-labelledby": "devices-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterHead, { num: dev.num, label: dev.label, title: dev.title, intro: dev.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorialGrid, { cols: 3, children: dev.devices.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(EditorialCard, { label: d.maker, title: d.title, href: d.links[0].href, linkLabel: d.links[0].label, image: d.image, alt: d.alt, tone: "white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "ecard-text", html: d.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: d.links[1].href, target: "_blank", rel: "noopener", className: "link-arrow cl-ext", style: {
          position: "relative",
          zIndex: 1
        }, children: d.links[1].label })
      ] }, d.title)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section", id: st.id, "aria-labelledby": "study-notes-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wide stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterHead, { num: st.num, label: st.label, title: st.title, intro: st.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-grid-2", children: st.studies.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "sp-study", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-study-meta", children: s.meta }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: s.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: s.interpretation }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: s.examine.summary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: s.examine.text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "sp-cite", html: s.citation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.link.href, target: "_blank", rel: "noopener", className: "link-arrow cl-ext", children: s.link.label })
      ] }, s.title)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sp-quote", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", html: st.endpoint.quote }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "small", html: st.endpoint.note })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "wide section--flush", "aria-label": P.toc.library.label, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatementPanel, { id: "portfolio-close", eyebrow: P.hero.kicker, title: P.hero.links[1].label, text: P.hero.deck, cta: P.toc.library, image: P.close.photo, alt: "Clinician in consultation with a patient and family member" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBand, { title: "Important information", notes: [/* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: P.close.text }, "end"), /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { html: ref.imageNote }, "img"), /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: P.close.link.href, className: "link-arrow", children: [
      P.close.link.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
    ] }, "cta")] })
  ] });
}
export {
  Page as component
};
