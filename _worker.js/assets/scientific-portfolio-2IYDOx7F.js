import { V as jsxRuntimeExports, r as reactExports } from "./server-O62Ku6QH.js";
import { R as Reveal, A as AppLink, e as cx, P as Picture, f as IDENTITY, g as IMG, h as SubNav, a as SplitRow, E as EditorialGrid, i as EditorialCard, b as StatementPanel, I as InfoBand } from "./router-Bw2Lf1rI.js";
import { H as Html, C as ClinicalStyles } from "./Html-heDPcdvt.js";
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
      "links": [
        { "label": "Microlyte Matrix / SAM", "href": "/products/microlyte", "external": false },
        { "label": "Microlyte PainGuard", "href": "/products/microlyte-painguard", "external": false },
        { "label": "Myriad Matrix", "href": "/products/myriad-matrix", "external": false },
        { "label": "XCelliStem", "href": "/products/xcellistem", "external": false },
        { "label": "APIS", "href": "/products/apis", "external": false }
      ],
      "third": {
        "image": "myriad-matrix",
        "alt": "AROA Myriad Matrix package",
        "title": "Myriad Matrix",
        "text": "A decellularized extracellular-matrix sheet derived from ovine forestomach; the manufacturer describes a collagen-based matrix. The particulate format, Myriad Morcells, is a separate product.",
        "link": { "label": "Product details", "href": "/products/myriad-matrix", "external": false },
        "source": { "label": "Manufacturer reference", "href": "https://aroa.com/product/myriad-matrix-ecm/", "external": true }
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
const MOA = {
  terms: "Terms: 'layer' is a tissue compartment of the native membrane (amnion, intermediate layer, chorion); 'ply' is one sheet of tissue in a finished graft; codes such as A-C-A list the plies in sheet order.",
  disclaimer: "The findings in this section come from laboratory studies of native tissue or of grafts other than the products below, some are maker-run or maker-funded [E03][E42]. They describe native tissue and example grafts, not the products listed here.",
  regulatory: "The placental membranes in this portfolio are regulated as Section 361 human cells, tissues and cellular and tissue-based products (HCT/Ps) and are supplied as protective wound coverings. Each FDA 510(k)-cleared product is described only within its cleared indications. Section 361 status is not FDA approval.",
  layers: {
    title: "What each layer is",
    items: [
      { key: "amnion", title: "Amnion", tagline: "Thin, strong surface", text: "A single layer of epithelial cells on a thick basement membrane, over a compact collagen layer and a fibroblast layer. It has no blood vessels or nerves. In native membrane it is about a fifth of the membrane’s thickness, with wide variation [E40], yet it is the stiffer, stronger, load-bearing layer. [E32][E33]" },
      { key: "intermediate", title: "Intermediate (spongy) layer", tagline: "Spongy interface", text: "A loose band of proteoglycans and glycoproteins with a fine meshwork of mostly type III collagen. In native tissue it holds fluid, varies in thickness, and lets the amnion slide over the chorion. [E33] Classic histology counts it as the amnion’s fifth layer; graft makers treat it as a separate compartment. [E32]" },
      { key: "chorion", title: "Chorion", tagline: "Thickest native layer", text: "Cellular and reticular collagen layers, a dense pseudo-basement membrane and several layers of trophoblast cells. [E38] In native membrane it is about four times as thick as the amnion. [E40] Chorion is the thickest layer of the native membrane; what it contributes in a finished graft has not been established." }
    ]
  },
  combining: {
    title: "What is and is not known about combining layers",
    rows: [
      { layer: "Amnion", text: "the thin, load-bearing surface of the native membrane [E32][E33]; in one maker's dry grafts an amnion-amnion sheet was about a fifth as thick as an amnion-intermediate-chorion sheet [E03]." },
      { layer: "Chorion", text: "the thickest layer of the native membrane [E40]; what it contributes in a finished graft has not been established." },
      { layer: "Intermediate layer", text: "its contribution to a finished sheet has not been isolated: in one maker's study, grafts with and without it gave similar cell-culture and mouse-implant results, but the two were dried differently [E42]." }
    ],
    inShortLabel: "In short",
    inShort: "Amnion is the thin, load-bearing surface; chorion is the thickest native layer; the intermediate layer's contribution to a finished sheet has not been isolated. This page does not compare products or ply configurations."
  },
  plies: {
    title: "Which products use which plies",
    intro: "Plies are listed as each manufacturer names them. Products with the same plies can differ in format, processing and handling; see each IFU.",
    codes: "Codes: A = amnion, C = chorion, IL = intermediate layer, written in sheet order.",
    columns: ["Layers / plies (as named by the manufacturer)", "Products in this portfolio", "What the sheet contains"],
    rows: [
      { layers: "A", products: [{ name: "Sentry SL Matrix", slug: "sentry-sl" }, { name: "XCell Amnio Matrix", slug: "xcell-amnio-matrix" }, { name: "PalinGen Membrane", slug: "palingen" }], contains: "Amnion only." },
      { layers: "A-A", products: [{ name: "Membrane Wrap", slug: "membrane-wrap" }, { name: "Membrane Wrap Hydro", slug: "membrane-wrap-hydro" }], contains: "Two amnion plies." },
      { layers: "A-C", products: [{ name: "Palisade DM Matrix", slug: "palisade" }], contains: "Amnion and chorion; the maker does not state whether the intermediate layer is kept." },
      { layers: "A-C-A", products: [{ name: "Tri-Membrane Wrap", slug: "tri-membrane-wrap" }], contains: "Chorion between two amnion plies, so amnion faces both sides; follow the instructions for use (IFU) for orientation." },
      { layers: "A-IL-C", products: [{ name: "Activate Matrix", slug: "activate" }, { name: "AmchoPlast", slug: "amchoplast" }], contains: "All three compartments: amnion, intermediate layer and chorion — one membrane that retains all three compartments, not three sheets." }
    ],
    thickness: {
      title: "Thickness, native and dry",
      bars: [
        { label: "Native amnion ≈ 111 µm [E40]", um: 111 },
        { label: "Native chorion ≈ 431 µm [E40]", um: 431 },
        { label: "Example dry A-A graft from one maker (not a product listed here): ≈ 27 µm", um: 27, dry: true },
        { label: "Example dry A-IL-C graft from one maker (not a product listed here): ≈ 133 µm", um: 133, dry: true }
      ],
      caption: "Native thicknesses are from one histology study of full-term membranes [E40], which found wide variation; the dry-graft values are example grafts from one maker, not products in this portfolio [E03]."
    },
    selectionNote: "Product selection and use follow each product's current instructions for use (IFU) and the treating clinician's assessment of the wound."
  },
  sourcesTitle: "Sources",
  sources: {
    E03: { id: "E03", authors: "Singh et al.", journal: "Int J Mol Sci.", year: "2025;26:3406.", descriptor: "Manufacturer laboratory study of selected processed grafts; no patient outcomes.", url: "https://pubmed.ncbi.nlm.nih.gov/40244265/" },
    E32: { id: "E32", authors: "Niknejad et al.", journal: "Eur Cell Mater.", year: "2008;15:88-99.", descriptor: "Review of amniotic membrane structure.", url: "https://pubmed.ncbi.nlm.nih.gov/18446690/" },
    E33: { id: "E33", authors: "Samimi et al.", journal: "Biomed Opt Express.", year: "2023;14(6):2969-2985.", descriptor: "Amnion identified as the load-bearing layer of intact membranes.", url: "https://pubmed.ncbi.nlm.nih.gov/37342693/" },
    E38: { id: "E38", authors: "Bourne GL.", journal: "Am J Obstet Gynecol.", year: "1960;79:1070-1073.", descriptor: "Classic description of the amnion and chorion layers.", url: "https://pubmed.ncbi.nlm.nih.gov/13803349/" },
    E40: { id: "E40", authors: "Jabareen et al.", journal: "Eur J Obstet Gynecol Reprod Biol.", year: "2009;144(suppl 1):S134-S141.", descriptor: "Histology of term membranes: amnion 111 ± 78 µm, chorion 431 ± 113 µm.", url: "https://pubmed.ncbi.nlm.nih.gov/19282091/" },
    E42: { id: "E42", authors: "Moreno et al.", journal: "J Biomater Appl.", year: "2024;39(1):24-39.", descriptor: "Laboratory study comparing processing methods in one maker's graft.", url: "https://pubmed.ncbi.nlm.nih.gov/38616137/" }
  },
  blockTitle: "Formulation and application",
  fields: { status: "Status", description: "Description", indications: "Indications", practical: "Practical distinction", applied: "How it is applied" },
  products: [
    { slug: "amchoplast", status: "Section 361 HCT/P, supplied as a wound covering.", description: "Dehydrated human amnion, intermediate layer and chorion. A membrane with all three layers, supplied as a protective wound covering. The IFU provides multiple sheet and disc sizes.", practical: "Supplied in multiple sheet and disc sizes, per the IFU.", applied: "Placed over the prepared wound bed as a protective covering, sized from the available sheets and discs, then secured and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.cellutionbiologics.com/products/amchoplast" }, record: { label: "Regulatory record and references", href: "/evidence#ev-amchoplast" } },
    { slug: "membrane-wrap-hydro", status: "Section 361 HCT/P, supplied as a wound covering.", description: "Pre-hydrated version of Membrane Wrap (two amnion plies); not the same product as dry Membrane Wrap.", practical: "Supplied pre-hydrated; larger formats are listed in the IFU.", applied: "Supplied pre-hydrated and placed over the prepared wound bed as a protective covering, then secured and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.biolabholdings.com/products/membranes" }, record: { label: "Regulatory record and references", href: "/evidence#ev-membrane-wrap-hydro" } },
    { slug: "activate", status: "Section 361 HCT/P, supplied as a wound covering.", description: "A dehydrated placental covering with all three layers, amnion, intermediate layer and chorion; the manufacturer describes terminal sterilization and a 2 × 2 to 4 × 8 cm size range.", practical: "Supplied in sizes from 2 × 2 to 4 × 8 cm (manufacturer figures).", applied: "Placed over the prepared wound bed as a protective covering in a size matched to the wound, then secured and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://sequencelifesci.com/activate/" }, record: { label: "Regulatory record and references", href: "/products/activate" } },
    { slug: "palisade", status: "Section 361 HCT/P, supplied as a wound covering.", description: "A dehydrated dual-membrane amnion-chorion human tissue covering.", practical: "Amnion and chorion, supplied as a dehydrated dual-layer sheet. Follow the IFU for handling and hydration.", applied: "Placed over the prepared wound bed as a protective covering; fixation and the secondary dressing follow the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://sequencelifesci.com/palisade-2/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-palisade" } },
    { slug: "sentry-sl", status: "Section 361 HCT/P, supplied as a wound covering.", description: "A single-ply amnion covering, described by the manufacturer as dehydrated and terminally sterilized.", practical: "A thin covering adds little bulk and can lie close to a prepared shallow surface. That may matter where excess material or folds complicate placement.", applied: "Laid over the prepared wound bed as a protective covering and secured and dressed as the IFU directs.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://sequencelifesci.com/sentry-2/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-sentry-sl" } },
    { slug: "membrane-wrap", status: "Section 361 HCT/P, supplied as a wound covering.", description: "A two-ply amnion-amnion human tissue allograft used as a barrier and protective covering. Distinct from Hydro and Tri-Membrane Wrap.", practical: "Within the Membrane Wrap family it is the dry, amnion-only two-ply sheet. A range of footprints supports sizing to the wound.", applied: "Placed over the prepared wound bed as a barrier and protective covering, then secured and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.biolabholdings.com/products/membranes" }, record: { label: "Regulatory record and references", href: "/evidence#ev-membrane-wrap" } },
    { slug: "tri-membrane-wrap", status: "Section 361 HCT/P, supplied as a wound covering.", description: "Amnion-chorion-amnion covering with amnion on both exterior faces. The IFU describes dry trimming, optional saline hydration and fixation/secondary dressing as directed.", practical: "The sandwich structure offers two amnion surfaces with a more substantial central tissue compartment. Large available sheets can be useful for covering a broad or irregular footprint with fewer pieces; actual fit, handling and waste should be assessed for the individual wound.", applied: "Trimmed dry and placed over the prepared wound bed as a protective covering in the orientation the IFU directs, hydrated with saline if the IFU calls for it, then secured and dressed.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.biolabholdings.com/products/membranes" }, record: { label: "Regulatory record and references", href: "/evidence#ev-tri-membrane-wrap" } },
    { slug: "xcell-amnio-matrix", status: "Section 361 HCT/P, supplied as a wound covering.", description: "A lyophilized single-amnion allograft, aseptically processed. Its IFU uses a corner slit to identify the epithelial side and directs dry placement with saline where needed.", practical: "A thin covering with a specific orientation marker and explicit preparation instructions. Orientation guidance can support consistent handling and training.", applied: "Placed dry over the prepared wound bed as a protective covering with its marked epithelial side oriented as the IFU directs, with saline added where the IFU calls for it, then secured and dressed.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://nhmedical.com/products/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-xcell-amnio-matrix" } },
    { slug: "palingen", status: "Section 361 HCT/P, supplied as a wound covering.", description: "The single-ply PalinGen Membrane is an air-dried, gamma-sterilized, chorion-free amniotic covering. The manufacturer lists discs and sheets; two-ply and other PalinGen formats are separate products.", practical: "The range of small discs and sheet footprints can help match the actual area needing a low-bulk cover. Chorion-free construction may meet a clinician's material preference.", applied: "Placed over the prepared wound bed as a protective covering, as a disc or sheet matched to the area, then secured and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://amniotechnology.com/index.php/palingen-membrane/" }, record: { label: "Regulatory record and references", href: "/products/palingen" } },
    { slug: "interfyl", status: "Section 361 HCT/P, particulate/flowable connective-tissue matrix.", description: "A decellularized human placental connective-tissue matrix supplied as particulate or flowable material, placed into soft-tissue defects.", applied: "Placed into the prepared soft-tissue defect as a particulate or flowable matrix, then covered and dressed according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://celularity.com/biomaterial-platform/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-interfyl" } },
    { slug: "microlyte", status: "FDA 510(k)-cleared — bioresorbable synthetic silver-containing wound matrix.", description: "Microlyte Matrix (listed on this site as Microlyte SAM). A thin bioresorbable synthetic polyvinyl-alcohol matrix with ionic and metallic silver.", practical: "Contains silver as stated in the labeling.", applied: "Conforms to the moist wound surface as a contact layer and resorbs under a cover dressing.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://imbedbio.com/products/microlyte/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-microlyte-sam" } },
    { slug: "microlyte-painguard", status: "FDA 510(k)-cleared — silver-containing synthetic wound matrix with lidocaine.", description: "The Microlyte matrix with lidocaine; labeled and cleared separately from standard Microlyte.", practical: "Cleared indications: see the product page.", practicalHref: "/products/microlyte-painguard", applied: "Conforms to the moist wound surface as a contact layer and resorbs under a cover dressing, with the local anesthetic action described in its labeling.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://imbedbio.com/products/sam-painguard-with-lidocaine/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-microlyte-painguard" } },
    { slug: "myriad-matrix", status: "FDA 510(k)-cleared — ovine forestomach extracellular-matrix sheet.", description: "A decellularized extracellular-matrix sheet derived from ovine forestomach; the manufacturer describes a collagen-based matrix. The particulate format, Myriad Morcells, is a separate product.", applied: "The rehydrated sheet covers the prepared wound as its IFU describes.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://aroa.com/product/myriad-matrix-ecm/" }, record: { label: "Regulatory record and references", href: "/products/myriad-matrix" } },
    { slug: "xcellistem", status: "FDA 510(k)-cleared — porcine extracellular-matrix wound powder.", description: "A topical wound powder made from decellularized porcine spleen and lung extracellular matrix, used as a wound dressing under its IFU.", practical: "A particulate format can distribute over an irregular wound bed without cutting a sheet to every contour.", applied: "Distributed as a powder over the prepared wound bed and covered with a dressing according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.stemsysbio.com/our-products" }, record: { label: "Regulatory record and references", href: "/evidence#ev-xcellistem" } },
    { slug: "apis", status: "FDA 510(k)-cleared — resorbable gelatin, hydroxyapatite and Mānuka honey wound dressing.", description: "A resorbable sheet of porcine gelatin, hydroxyapatite and Mānuka honey, used as a protective wound cover under its IFU.", practical: "The sheet can remain as it resorbs, avoiding removal of adherent material solely for replacement. Hydration instructions support placement on a dry or low-exudate surface.", applied: "Hydrated, then placed to cover the prepared wound and left in place according to the IFU.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://www.sweetbio.com/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-apis" } },
    { slug: "ultramist", status: "FDA 510(k)-cleared — noncontact low-frequency ultrasound system.", description: "A noncontact low-frequency ultrasound system delivering energy through a saline mist.", indications: { text: "Cleared indications: see the product page.", href: "/products/ultramist" }, practical: "Energy is delivered through a saline mist without probe contact with the wound.", applied: "Noncontact ultrasound delivered through a saline mist to the wound surface, without touching the wound.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://sanuwave.com/products/ultramist/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-ultramist" } },
    { slug: "arobella", status: "FDA 510(k)-cleared — low-frequency ultrasound system with an acoustic curette.", description: "A low-frequency ultrasound wound-treatment system with an acoustic curette.", indications: { text: "Cleared indications: see the product page.", href: "/products/arobella" }, applied: "Ultrasound-assisted cleansing and removal of nonviable tissue from the wound bed by a trained operator.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://arobella.com/products/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-arobella" } },
    { slug: "microdoc", status: "FDA 510(k)-cleared — portable, canister-free NPWT system.", description: "A portable, canister-free negative-pressure wound-therapy (NPWT) system.", indications: { text: "Cleared indications: see the product page.", href: "/products/microdoc" }, practical: "A portable system with no canister to manage.", applied: "Negative pressure applied over a sealed dressing to remove exudate from the wound.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://pensarmedical.com/microdoc/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-microdoc" } },
    { slug: "actigraft", status: "FDA 510(k)-cleared — point-of-care system for forming a topical clot from the patient's own whole blood.", description: "A point-of-care system that forms a clot from the patient's own whole blood; the clot is applied to the prepared wound as a covering. Plus and PRO kits have different components and workflows, each with its own IFU.", practical: "Forms a clot from the patient's own whole blood at the point of care; blood collection and clot preparation are part of the workflow. See the IFU.", applied: "A clot formed from the patient's own blood at the point of care and placed on the prepared wound as an autologous covering.", labeling: { label: "Manufacturer labeling (IFU) and product page", href: "https://reddressmedical.com/solutions/" }, record: { label: "Regulatory record and references", href: "/evidence#ev-actigraft" } }
  ]
};
const MOA_CITE_ORDER = [];
for (const t of [MOA.disclaimer, ...MOA.layers.items.map((l) => l.text), ...MOA.combining.rows.map((r) => r.text), MOA.combining.inShort, ...MOA.plies.thickness.bars.map((b) => b.label), MOA.plies.thickness.caption]) {
  for (const m of t.matchAll(/\[(E\d\d)\]/g)) if (!MOA_CITE_ORDER.includes(m[1])) MOA_CITE_ORDER.push(m[1]);
}
const MOA_SOURCES_ORDERED = MOA_CITE_ORDER.map((id) => MOA.sources[id]);
function moaCiteNumber(id) {
  return MOA_CITE_ORDER.indexOf(id) + 1;
}
function typo(s) {
  return s.replace(/(^|[\s(])'/g, "$1‘").replace(/'/g, "’");
}
function Cited({ text }) {
  const parts = text.replace(/\s+((?:\[E\d\d\])+)/g, "$1").split(/((?:\[E\d\d\])+)/g);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map((part, i) => {
    if (!/^(?:\[E\d\d\])+$/.test(part)) return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: typo(part) }, i);
    const ids = Array.from(part.matchAll(/\[(E\d\d)\]/g), (m) => m[1]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("sup", { className: "sp-cite-n", children: ids.map((id, j) => {
      const n = moaCiteNumber(id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
        j > 0 ? ", " : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `#src-${n}`, "aria-label": `Source ${n}`, children: n })
      ] }, id);
    }) }, i);
  }) });
}
function LayerAnatomy() {
  const L = MOA;
  const maxUm = Math.max(...L.plies.thickness.bars.map((b) => b.um));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-la", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-la-intro", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-la-terms", children: typo(L.terms) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cited, { text: L.disclaimer }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-la-reg", children: typo(L.regulatory) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", className: "sp-la-block", "aria-labelledby": "sp-la-layers-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "sp-la-layers-title", className: "sp-la-h3", children: L.layers.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "sp-la-layers", children: L.layers.items.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "sp-la-layer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cl-num", children: l.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: l.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cited, { text: l.text }) })
      ] }, l.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", className: "sp-la-panel", "aria-labelledby": "sp-la-combining-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "sp-la-combining-title", className: "sp-la-h3", children: L.combining.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "sp-la-rows", children: L.combining.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: r.layer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cited, { text: r.text }) })
      ] }, r.layer)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sp-la-short", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: L.combining.inShortLabel }),
        " ",
        typo(L.combining.inShort)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", className: "sp-la-panel", "aria-labelledby": "sp-la-plies-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "sp-la-plies-title", className: "sp-la-h3", children: L.plies.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: typo(L.plies.intro) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-la-codes", children: L.plies.codes }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "sp-la-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: L.plies.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: L.plies.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": L.plies.columns[0], children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: r.layers }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": L.plies.columns[1], children: r.products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
            i > 0 ? ", " : "",
            /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: `/products/${p.slug}`, children: p.name })
          ] }, p.slug)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": L.plies.columns[2], children: typo(r.contains) })
        ] }, r.layers)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "sp-la-fig", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { children: L.plies.thickness.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "sp-la-bars", children: L.plies.thickness.bars.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cited, { text: b.label }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cx("sp-la-bar", b.dry && "sp-la-bar--dry"), style: { width: `${b.um / maxUm * 100}%` }, "aria-hidden": "true" })
        ] }, b.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-la-cap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cited, { text: L.plies.thickness.caption }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-la-select", children: typo(L.plies.selectionNote) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { as: "section", className: "sp-la-sources", "aria-labelledby": "sp-la-sources-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "sp-la-sources-title", className: "sp-la-h3", children: L.sourcesTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { children: MOA_SOURCES_ORDERED.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { id: `src-${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        s.authors,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("cite", { children: s.journal }),
        " ",
        s.year,
        " ",
        typo(s.descriptor),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.url, target: "_blank", rel: "noopener", className: "cl-ext", children: "PubMed" })
      ] }) }, s.id)) })
    ] })
  ] });
}
function FormulationBlock({ slug }) {
  const e = MOA.products.find((p) => p.slug === slug);
  if (!e) return null;
  const F = MOA.fields;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-fa", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sp-fa-title", children: MOA.blockTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "sp-fa-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: F.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: typo(e.status) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: F.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: typo(e.description) })
      ] }),
      e.indications ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: F.indications }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: e.indications.href, children: e.indications.text }) })
      ] }) : null,
      e.practical ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: F.practical }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: e.practicalHref ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: e.practicalHref, children: typo(e.practical) }) : typo(e.practical) })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: F.applied }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: typo(e.applied) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-fa-links", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: e.labeling.href, target: "_blank", rel: "noopener", className: "cl-ext", children: e.labeling.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: e.record.href, children: [
        e.record.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] })
    ] })
  ] });
}
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
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormulationBlock, { slug: p.key })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayerAnatomy, {}),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cl-pills", "aria-label": dr.label, children: dr.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, className: "btn btn--outline btn--sm", children: l.label }, l.href)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "dressing-microlyte", eyebrow: dr.feature.caption, title: dr.feature.title, image: dr.feature.image, alt: dr.feature.alt, cta: dr.feature.link, secondary: dr.feature.source, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "lead", html: dr.feature.text }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "dressing-myriad", eyebrow: dr.third.title, title: dr.third.title, image: dr.third.image, alt: dr.third.alt, reverse: true, tone: "white", cta: dr.third.link, secondary: dr.third.source, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "lead", html: dr.third.text }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplitRow, { id: "dressing-apis", eyebrow: "APIS", title: "APIS", image: "apis", alt: "Close view of the amber APIS matrix sheet on glass", tone: "white", cta: dr.second.link, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html, { as: "p", className: "lead", html: dr.second.text }) }) }),
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
