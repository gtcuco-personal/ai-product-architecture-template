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
- `public/robots.txt` — allow all public content, explicitly allow AI crawlers:

```
# AI crawlers — explicitly allowed for GEO visibility
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /
```

## llms.txt

Create a `public/llms.txt` file with a structured summary of the project for LLM consumption. This is the AI equivalent of an elevator pitch — read by LLMs before they process your content.

```markdown
# [Brand Name]

> [One-line description]

[2-3 sentences about what the project/company does]

## [Key sections: Products, Services, Locations, Contact, Key Facts]

[Structured, factual information]
```

> Without `llms.txt`, AI must infer what your site is from HTML — and may misinterpret it. With it, every AI that visits your site gets a clear, structured briefing.
