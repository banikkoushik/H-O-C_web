# Heart-O-Care Website Architecture

## Structure

- `index.html` is the Version 1.0 landing page.
- `pages/` holds dedicated product and future feature pages.
- `assets/css/style.css` is the single global stylesheet.
- `assets/js/script.js` contains shared navigation behavior.
- `assets/images/` stores local images and placeholder assets.

## Navigation

The header and footer markup are intentionally shared across static pages. Copy the navigation structure from `index.html` or `pages/device.html` when creating a new page, then adjust relative links:

- From the root page: `pages/page-name.html`
- From a page in `pages/`: `../index.html` and `../assets/...`

## Future Pages

Add future pages to `pages/`, for example `mobile.html`, `desktop.html`, `technology.html`, and `support.html`. Reuse the global stylesheet and script rather than creating page-specific copies.
