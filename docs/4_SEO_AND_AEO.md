# SEO & AEO (Answer Engine Optimisation)

> Remove this file if SEO is not applicable to your project (e.g. internal tools, CLI apps).

## Meta Tags

- [e.g. SEOHead component: title <60 chars, description <160 chars, canonical URL]
- [e.g. Open Graph tags for social sharing]

## Semantic HTML

- One `<h1>` per page
- Sequential heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- ARIA labels where needed

## Structured Data (JSON-LD)

| Schema | Where |
|--------|-------|
| [e.g. LocalBusiness] | [page/component] |
| [e.g. FAQPage] | [page/component] |

## Images

- Descriptive `alt` text on all images
- Lazy loading for below-the-fold images
- Optimised formats (WebP for web, JPG for social)

## Sitemap & Robots

- `public/sitemap.xml` — auto-generated or manual
- `public/robots.txt` — allow all (or restrict as needed)
