# 博客文章规范

## 目录结构

```
blog/
├── CONTENT_SPEC.md       # 本文档
├── authors.yml            # 作者定义
├── tags.yml               # 标签定义
├── 2026-07-18-post-slug/  # 推荐: 目录式组织（含图片）
│   ├── index.md           # 文章正文
│   └── img/
│       ├── cover.png      # 封面图 (1200×630)
│       └── screenshot-1.png
└── 2026-07-17-old-post.md # 也可单文件（无本地图片时）
```

## 文件命名

`YYYY-MM-DD-英文短横-slug`，日期决定发布时间和排序。

## Frontmatter 规范

```yaml
---
title: 文章标题
description: 简短描述（用于 SEO / RSS / 社交卡片）
tags: [AI, CloudBase, 开发]
authors: booker
date: 2026-07-18
image: ./img/cover.png   # 社交卡片图，可选
slug: /custom-slug       # 自定义URL，可选
hide_table_of_contents: false  # 是否隐藏右侧目录
---
```

必填: `title`, `description`, `tags`, `authors`, `date`

## 图片存放

**两种方式**，按场景选：

### A. 随文图片（推荐 — 文章独立完整）

```
blog/2026-07-18-my-post/
├── index.md
└── img/
    ├── cover.png
    └── architecture.png
```

Markdown 引用: `![alt](./img/architecture.png)`

### B. 全局共用图片（跨文章复用）

```
static/img/blog/
├── cloudbase-logo.png
└── common-banner.png
```

Markdown 引用: `![alt](/img/blog/cloudbase-logo.png)`

### 图片规范

- 封面: 1200×630px（社交卡片比例）
- 正文内图: 宽度 ≤ 800px
- 格式: PNG 优先（截图/图示），JPG（照片），WebP（可选更优压缩）
- 文件命名: 英文小写短横，如 `architecture-overview.png`

## Authors

### 目前已定义

`blog/authors.yml` 已配置 `booker`（即你）。外部 agent 写文章时 `authors: booker` 即可。

### 如需新增合作作者

在 `blog/authors.yml` 追加条目:

```yaml
author-key:
  name: 显示名
  title: 头衔
  url: 个人链接
  image_url: 头像 URL
  socials:
    github: github-handle
```

## 内容格式

- **正文语言**: 中文为主，代码/术语可英文
- **代码块**: 标注语言 ` ```typescript `
- **标题层级**: 从 `##` 起，`#` 保留给文章标题（Docusaurus 自动渲染）
- **Callout**: 使用 Docusaurus 的 MDX  admonitions（`:::tip`, `:::note`, `:::warning`, `:::danger`）
- **文末**: 可加 `---` 分割线后接作者简介

## 发布流程

1. 在 `blog/` 下创建 posts
2. 本机 `npm run start` 预览
3. push 到 `develop` 分支
4. GitHub Actions 自动构建 → 部署到 `https://binggg.github.io`
