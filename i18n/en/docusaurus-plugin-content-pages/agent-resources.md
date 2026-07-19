---
title: Agent Resources
description: Machine-readable resources for AI coding assistants (Codex, Claude Code, Cursor, etc.) to quickly fetch blog content.
hide_table_of_contents: true
---

# Agent Resources

This blog provides the following machine-readable resources so AI coding assistants (Claude Code, Codex, Cursor, Copilot, etc.) can efficiently access content.

## File Index

| Resource | URL | Description |
|---|---|---|
| `llms.txt` | [`/llms.txt`](/llms.txt) | Content index with titles, descriptions, and links for all articles. Agent discovery entry point. |
| `llms-full.txt` | [`/llms-full.txt`](/llms-full.txt) | Full content of every blog post aggregated. Agent fetches once for complete context. |
| `sitemap.xml` | [`/sitemap.xml`](/sitemap.xml) | Standard sitemap with `lastmod` timestamps — helps agents assess content freshness. |
| `robots.txt` | [`/robots.txt`](/robots.txt) | All crawlers (including AI agents) explicitly allowed. |
| RSS Feed | [`/blog/rss.xml`](/blog/rss.xml) | Standard RSS feed. |
| Atom Feed | [`/blog/atom.xml`](/blog/atom.xml) | Standard Atom feed. |

## How to Use

### In AI Coding Assistants

**Claude Code / Codex / Cursor / Windsurf / Copilot**

Reference this in your project context or rules:

```
https://binggg.github.io/llms-full.txt
```

The agent will automatically fetch all blog content for context.

**ChatGPT / Claude / Gemini**

Paste the URL or copy contents of `/llms-full.txt` into your conversation.

### Individual Articles

Raw Markdown for each article is available directly on GitHub:

```
https://github.com/binggg/binggg.github.io/tree/develop/blog/
```

## Tech Stack

- Framework: Docusaurus 3.x
- Deployment: GitHub Pages + GitHub Actions
- LLMs generation: `docusaurus-plugin-llms` (fully automatic)
- Source: [github.com/binggg/binggg.github.io](https://github.com/binggg/binggg.github.io)

---

*This page is machine-readable too. Agents visiting this page get all resource entry points.*
