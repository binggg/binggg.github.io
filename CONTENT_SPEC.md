# binggg.github.io 内容规范 v1

> 2026-07-19 制定，基于 Booker 写作偏好和博客定位。

## 一、内容定位

个人博客，不是官方文档、不是教程站。核心声音是：

> **10 年全栈 + AI 工程化的真实观察。不教课，不抄文档，不写废话。**

## 二、发表标准（7 条硬门槛）

每篇文章必须同时满足以下 7 条才能发：

1. **有个人视角** — 必须有"我"的判断、偏好、踩坑记录。不能是第三方教程口吻。
2. **问题驱动** — 开头从真实问题/痛点切入，不搞"今天我们来学习 X"。
3. **反 AI 腔** — 无过渡句（"最能说明问题的是""从这个角度来说"）、无工整排比、无"不是……而是……"结构、无"本质上"。
4. **实话实说** — 好就是好，坑就是坑。不粉饰、不夸大。
5. **段落短节奏快** — 每段不超过 5 行，正文不用编号标题（一、二、三）。
6. **有结尾动作** — 结尾抛问题给读者，或放彩蛋（实用的工具/工作流/代码片段）。
7. **来源真实** — 不编个人经历、不编数据。"三年踩坑经验"如果是编的就不写。

## 三、不发清单

以下类型不发布：

- 纯翻译（无个人见解）
- 产品功能介绍（不是 CloudBase 官方文档）
- 内部研究报告（未转博客口吻）
- 副业/无关话题
- 纯技术选型对比报告（除非有独到发现）

## 四、文章分级

| 级别 | 标准 | 动作 |
|---|---|---|
| P0 代表作 | 原创性强、可实操、有差异化 | 发博客 + 推社交媒体 |
| P1 好文章 | 内容扎实、有个人见解 | 发博客 |
| P2 有价值 | 实用但不惊艳 | 改后发博客 |
| P3 跳过 | 不符合以上标准 | 不发，留作存档 |

## 五、补发规则

- 补发文章保留原始创建日期（frontmatter 中 `date` 字段）
- 发布后不再修改正文，只修正错别字
- 如需更新内容 → 发新文章并链向旧文

---

<!-- 以下为扩展阅读，非规范正文 -->

## 六、5 星评分标准（5 维每维 20 分）

| 维度 | 满分 | 高分特征 | 低分特征 |
|---|---|---|---|
| 原创洞察 | 20 | 有 Booker 独有的视角/方法论/复刻方案。别人写不出来。 | 纯教程、产品功能介绍、已有知识汇总 |
| 可实操 | 20 | 读者看完能直接复用——模板、代码、决策树、配置。 | 只有概念没有动作 |
| 个人声音 | 20 | 有真实踩坑经历、个人取舍判断。"我碰过，疼过"。 | 客观教程口吻、无"我"字 |
| 技术深度 | 20 | 源码级分析、协议层拆解、数据支撑。 | 表面介绍、道听途说 |
| 传播潜力 | 20 | 话题有搜索量、有差异化、让人想转发。 | 窄众、同质化、看完不想分享 |

**分级**: 90+→⭐⭐⭐⭐⭐ / 70-89→⭐⭐⭐⭐ / 50-69→⭐⭐⭐ / <50→⭐⭐

**一票否决**: 纯翻译/产品文档→最高⭐⭐；全文无个人视角→最高⭐⭐⭐；编造→不发布

## 五、AI Agent 资源（2026-07-19 新增）

博客提供以下机器可读资源，方便 AI 编码助手（Claude Code、Codex、Cursor、Copilot 等）获取内容：

| 文件 | 用途 | URL |
|---|---|---|
| `llms.txt` | 内容索引，插件自动生成 | `https://binggg.github.io/llms.txt` |
| `llms-full.txt` | 全部文章聚合，插件自动生成 | `https://binggg.github.io/llms-full.txt` |
| `static/robots.txt` | 声明所有 crawler 允许抓取 | `https://binggg.github.io/robots.txt` |
| `sitemap.xml` | Docusaurus 自动生成，含 lastmod 时间 | `https://binggg.github.io/sitemap.xml` |
| RSS/Atom | 标准订阅源 | `blog/rss.xml` / `blog/atom.xml` |

### 维护要求

- `llms.txt` 和 `llms-full.txt` 由 `docusaurus-plugin-llms` 在 `npm run build` 时自动生成，**无需手动维护**
- 已配置 `includeBlog: true`，自动扫描所有博客文章
- 如果新增的博客文章不需要被索引，在 frontmatter 加 `llms: false` 即可排除

### i18n 图片同步（自动，无手工操作）

`prebuild` 阶段 `scripts/sync-i18n-images.sh` 自动将 `blog/*/images/` 同步到 `i18n/en/` 对应目录。新增英文博文时只需要写翻译文件，图片自动跟随。

- **机制**: `npm run build` → npm 自动触发 `prebuild` → 脚本扫描 blog 目录 → cp 缺失的 images
- **条件**: 英文目录 `i18n/en/.../{slug}` 存在，但 `images/` 不存在时才拷贝。已同步过的不会重复操作
- **零维护**: 无需手动 cp，无需记住"下次要同步图片"

### i18n 翻译检查（强制，无逃生口）

每篇中文博客必须有英文翻译。缺翻译 → 构建失败，不部署。

```
⚙️ prebuild → scripts/check-i18n-blog.sh
  ├── 扫描 blog/*/ 下所有中文博客
  ├── 比对 i18n/en/ 是否存在对应英文版
  ├── 缺失 → ❌ error annotation + exit 1（构建失败）
  └── 不缺失 → ✅ All good
```

- **强制** — 没有逃生口。不翻英文，部署不了
- **零维护** — 脚本自动扫描，无需手动配置

### 参考来源

Vercel 的 Agent Resources 体系：[vercel.com/docs/agent-resources](https://vercel.com/docs/agent-resources)，三层框架：
- **Layer 1 Discovery**: llms.txt / sitemap / robots.txt / JSON-LD
- **Layer 2 Retrieval**: content negotiation / .md endpoints / agent auto-detection
- **Layer 3 Tool Access**: MCP Server / search API

目前博客已实现 Layer 1。Layer 2-3 待后续。
