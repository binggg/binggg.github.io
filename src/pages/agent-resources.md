---
title: Agent Resources
description: AI 友好的机器可读资源——让编码助手（Codex、Claude Code、Cursor 等）快速获取博客内容。
hide_table_of_contents: true
---

# Agent Resources

本博客提供以下机器可读资源，方便 AI 编码助手（Claude Code、Codex、Cursor、Copilot 等）获取内容。

## 文件索引

| 资源 | URL | 说明 |
|---|---|---|
| `llms.txt` | [`/llms.txt`](/llms.txt) | 内容索引，包含所有文章的标题、描述和链接。Agent 发现入口。 |
| `llms-full.txt` | [`/llms-full.txt`](/llms-full.txt) | 全部博客文章的完整正文聚合。Agent 一次 fetch 获得全部上下文。 |
| `sitemap.xml` | [`/sitemap.xml`](/sitemap.xml) | 标准站点地图，含 `lastmod` 时间戳，帮助 Agent 判断内容新鲜度。 |
| `robots.txt` | [`/robots.txt`](/robots.txt) | 允许所有 crawler（含 AI agent）抓取。 |
| RSS Feed | [`/blog/rss.xml`](/blog/rss.xml) | 标准 RSS 订阅源。 |
| Atom Feed | [`/blog/atom.xml`](/blog/atom.xml) | 标准 Atom 订阅源。 |

## 使用方式

### 在 AI 编码助手中引用

**Claude Code / Codex / Cursor / Windsurf / Copilot**

在项目上下文或规则中引用：

```
https://binggg.github.io/llms-full.txt
```

Agent 会自动获取全部博客内容用于上下文。

**ChatGPT / Claude / Gemini**

直接粘贴 URL 或复制 `/llms-full.txt` 内容到对话中。

### 单篇文章

每篇文章的原始 Markdown 文件可通过 GitHub 直接访问：

```
https://github.com/binggg/binggg.github.io/tree/develop/blog/
```

## 技术栈

- 框架: Docusaurus 3.x
- 部署: GitHub Pages + GitHub Actions
- llms 生成: `docusaurus-plugin-llms`（自动生成，无需人工维护）
- 源码: [github.com/binggg/binggg.github.io](https://github.com/binggg/binggg.github.io)

---

*页面本身也是机器可读的。Agent 访问此页面可获得所有资源入口。*
