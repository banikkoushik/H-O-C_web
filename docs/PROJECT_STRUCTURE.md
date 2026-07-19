# Project Structure

## Folder Tree

```text
.
├── index.html
├── README.md
├── pages/
│   ├── device.html
│   ├── desktop.html
│   ├── mobile.html
│   ├── technology.html
│   ├── documentation.html
│   ├── roadmap.html
│   ├── about.html
│   ├── contact.html
│   └── 404.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── hero/
│   │   ├── gallery/
│   │   ├── technology/
│   │   └── icons/
│   ├── icons/
│   └── fonts/
└── docs/
```

## Directory Responsibilities

- `index.html`: The public landing page.
- `pages/`: Product pages and reserved future routes. New page content belongs here rather than at the repository root.
- `assets/css/`: The shared website stylesheet.
- `assets/js/`: Shared browser behavior. `main.js` currently owns navigation behavior.
- `assets/images/`: Topic-organized raster and vector image assets.
- `assets/icons/`: Reusable standalone icon assets.
- `assets/fonts/`: Locally hosted font files when they are introduced.
- `docs/`: Product, system, firmware, and maintenance documentation.

## CSS Architecture

The project currently uses one global stylesheet: `assets/css/style.css`. It is organized by design tokens, global base rules, shared components, and page-scoped sections.

The stylesheet remains a single file intentionally: its current cascade is shared by the landing page and product page, and splitting it without a build step would add imports and potential ordering risk without reducing active complexity. When independent page styles become substantial, create logical modules such as `tokens.css`, `base.css`, `components.css`, and page-specific files, then import them from one documented entry stylesheet.

## JavaScript Architecture

`assets/js/main.js` contains the small amount of shared browser behavior: accessible mobile navigation and active navigation-link highlighting. Keep feature-specific behavior in separate modules only when a page introduces independent interaction; avoid duplicating page navigation code.

## Naming Conventions

- Use lowercase, hyphen-separated file names: `product-name.html`.
- Use lowercase, hyphen-separated asset names: `pocket-ecg-device.svg`.
- Use component-scoped CSS classes: `.component__part` and `.component--variant`.
- Keep root-relative page links in `index.html` as `pages/page-name.html`.
- Keep links from `pages/` to root assets as `../assets/...` and to the homepage as `../index.html`.

## Reusable Navigation

The header and footer navigation markup in `index.html` and `pages/device.html` are the current static-page templates. New published pages should copy that structure, preserve the `site-nav`, `nav-menu`, `nav-link`, and `nav-toggle` classes, and update relative paths only. This keeps the shared `main.js` behavior working without page-specific JavaScript.

## Reserved Routes

The non-product files in `pages/` are route skeletons reserved for future content. They intentionally contain no designed content so this architecture refactor does not alter the current website experience.
