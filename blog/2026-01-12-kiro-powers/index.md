---
slug: kiro-powers
title: 引入 Kiro Powers：让 AI Agent 即时获得专业知识
date: 2026-01-12
authors: [booker]
tags: [ai, 全栈]
description: Kiro Powers 的完整译介——MCP 工具与框架专业知识统一打包、动态加载的 Agent 能力扩展方案。
---

> 原文：Kiro 官方博客
> 翻译：Booker Zhao

你在构建一个结账流程。即使你之前用过 Stripe，你仍然需要在文档中寻找正确的模式——这里应该使用幂等键（idempotent keys）吗？处理 webhooks 的最佳方式是什么？如果你还没接触过 Stripe，学习曲线会更加陡峭。你的 AI 助手应该让你能够即时访问框架专业知识，这样你就能更快地交付。但今天的 AI agent 面临着同样的挑战：没有内置知识，它们就像你一样猜测和迭代。

{/* truncate */}

1. **没有框架上下文，agent 会猜测**：你的 agent 可以查询 Neon，但它是否理解 serverless 的连接池？它可以调用 API，但它是否知道正确的模式和最佳实践？没有内置的专业知识，你们都需要手动阅读文档并不断改进方法，直到输出正确。这种试错过程会为每个工具、每个框架、每个超出你核心专业领域的领域重复。Powers 让你的 agent——进而让你——能够即时访问专业知识，这样你就能在陌生的领域中更快地工作。

2. **上下文过多，agent 会变慢**：MCP 旨在解决框架上下文问题，但它们也有自己的问题。连接五个 MCP 服务器，你的 agent 在编写第一行代码之前就会加载 100+ 工具定义。五个服务器可能会消耗 50,000+ tokens——占你上下文窗口的 40%——在你的第一个提示之前。更多工具应该意味着更好的结果，但非结构化的上下文会让 agent 不堪重负，导致响应变慢和输出质量下降，也就是上下文腐化（context rot）。

## 现有生态

AI 开发工具正在快速发展。Anthropic 最近引入了动态工具加载（Tool Search tool）、用于打包指令的 Claude Skills，以及各种原语，如子 agent 和用于 agent 行为的规则。Cursor 提供了规则和 `.cursorrules` 文件用于自定义指令。MCP 提供了跨客户端工具通信的标准。这些都是强大的功能，但它们作为独立的系统存在：

- **MCP servers** 用于工具访问（在每个客户端中配置）
- **Skills** 用于指令和工作流（Claude 特定）
- **Dynamic tool loading** 用于上下文管理（单独设置）
- **Rules and custom instructions** 用于行为（每个客户端的配置，如 `.cursorrules`）

每个都需要单独的配置和管理。你需要将多个原语拼接在一起才能获得完整的图景：工具 + 知识 + 动态加载。当你在 Cursor、Claude Code 或其他工具之间切换时，你需要重新配置所有内容。

挑战不在于缺少功能——而是碎片化。开发者想要一个统一的包："安装 Stripe 集成，我的 agent 就知道如何正确使用它。"而不是："在 mcp.json 中配置 MCP 服务器，编写 Skill 或 `.cursorrules` 文件，设置动态加载，添加自定义指令——并为每个工具重复这个过程。"

## 引入 Kiro Powers

Kiro powers 为广泛的开发和部署用例提供了这种统一的方法：MCP 工具和框架专业知识——打包在一起并动态加载。

还记得 Neo 在《黑客帝国》中瞬间下载武术专业知识吗？这就是 powers 为 Kiro agent 所做的——即时访问任何技术的专业知识。关键是动态上下文加载：传统的 MCP 实现会预先加载所有工具，但 powers 只在相关时激活。提到"数据库"，Neon power 就会加载其工具和最佳实践。切换到部署，Netlify 激活而 Neon 停用。

一个 power 是一个包含以下内容的包：

1. **`POWER.md`**：入口引导文件——一个入门手册，告诉 agent 它有哪些 MCP 工具以及何时使用它们
2. **MCP server 配置**：MCP 服务器的工具和连接详情
3. **额外的 steering 或 hooks**：你希望 agent 运行的内容，例如通过斜杠命令运行的 hooks 或 steering 文件

一键安装 Stripe power。当你提到"支付"或"结账"时，power 激活——将 Stripe 的 MCP 工具和 `POWER.md` 引导加载到上下文中。当你完成支付工作并转向数据库工作时，Supabase power 激活而 Stripe 停用。安装精选的 powers，获取社区构建的内容，或创建并分享你自己的。

### Powers 的差异化特点

**1. 动态 MCP 工具加载**

传统的 MCP 服务器会预先加载所有工具。Figma MCP 服务器可能暴露 8 个工具，消耗 12K tokens。Postman 服务器添加 122 个工具。连接五个服务器，你在编写代码之前就已经用完了上下文窗口的大部分。Powers 按需加载工具。安装五个 powers，你的基线上下文使用接近零。提到"设计"，Figma power 激活，加载其 8 个工具。切换到数据库工作，Supabase 激活而 Figma 停用。你的 agent 只加载与当前任务相关的工具。

**2. Power 生态系统：来自合作伙伴的精选、社区构建，或自己构建**

Powers 设计用于易于发现和安装，无论你使用的是精选合作伙伴、社区构建的 powers，还是你团队的私有工具。发现、安装和配置通过 IDE 或 kiro.dev 网站进行。你专注于构建。

我们与 UI 开发（Figma）、后端开发（Supabase、Stripe、Postman、Neon）、agent 开发（Strands）和部署（Netlify、Amazon Aurora）领域的公司合作。打开 powers 面板，你就有了一个可以安装的功能瑞士军刀——无需寻找 MCP 服务器或阅读设置文档。

**从 IDE 和 Web 一键安装**：直接在 Kiro 或 kiro.dev 上浏览 powers。点击"安装"，power 会自动注册。如果它需要 API 密钥或环境变量，它会在首次使用时提示你。无需 JSON 配置文件，无需命令行设置。

**任何人都可以构建和分享**：从 GitHub URL 导入社区构建的工具的 powers。拥有私有 powers 的团队可以从本地目录或私有仓库导入。构建一次，与你的团队分享，每个人都能获得相同的专业知识和工具。

**3. 跨平台兼容性（即将推出）**

今天，powers 在 Kiro IDE 中工作。我们正在构建一个未来，powers 可以在任何 AI 开发工具中工作——Kiro CLI、Cline、Cursor、Claude Code 等等。Model Context Protocol 提供了工具通信的标准。Powers 通过打包、激活和知识转移的标准扩展了这一点。构建一次，在任何地方使用。

这对我们的合作伙伴很重要。公司不想为每个 AI 工具维护专有上下文。他们想编写一个入门手册——一个 `POWER.md`——让它到处都能工作。Powers 将成为那个标准。

## Power 的解剖

为了更好地理解 power，让我们看看 Supabase power 的结构，以了解是什么让 powers 有效。

**1. Frontmatter：激活 power**

`POWER.md` 中的 frontmatter 定义了 power 何时激活。关键词触发激活——提到"数据库"或"postgres"，Supabase power 就会加载其 MCP 工具和上下文。

```yaml
---
name: "supabase"
displayName: "Supabase with local CLI"
description: "Build fullstack applications with Supabase's Postgres database, authentication, storage, and real-time subscriptions"
keywords: ["database", "postgres", "auth", "storage", "realtime", "backend", "supabase", "rls"]
---
```

当你说"让我们设置数据库"时，Kiro 检测到关键词中的"数据库"并激活 Supabase power，将其 MCP 工具和 `POWER.md` 加载到上下文中。

**2. 使用 `POWER.md` 进行入门：设置工作区**

入门部分引导 agent 完成初始设置，验证依赖并安装可以手动调用的 hooks 或 steering 文件。这通常在 power 首次激活时运行一次。Agent 自动执行这些步骤：检查 Docker 是否运行，验证 Supabase CLI，并在你的工作区中创建性能审查 hook。

**3. 工作流特定的 steering：按需加载上下文**

`POWER.md` 包含特定工作流的 steering 文件映射。当你在处理 RLS 策略时，agent 加载 `supabase-database-rls-policies.md`。当你在编写 Edge Functions 时，它加载 `supabase-edge-functions.md`。

这保持了上下文的聚焦。不是预先加载所有 Supabase 模式，agent 只加载与当前任务相关的内容。

## Agent 能力的未来：通过 Powers 持续学习

Neo 并不是学了一次功夫就停止了。在整个《黑客帝国》中，他根据需要下载新能力——驾驶直升机、掌握武器、理解 Matrix 本身。每个 power 扩展了他能做的事情，而不会让他被能力压垮。这就是 AI agent 的愿景。Powers 不仅仅是一种打包格式——它们是持续学习的模型。随着框架的演进和你的团队构建内部工具，agent 需要一种方式来扩展其能力，而无需从头开始。

昨天，添加新工具意味着手动配置 MCP 服务器并希望上下文不会溢出。今天，这意味着安装一个 power。Supabase 发布了更新的 RLS 模式？你的 agent 会自动获得它们。你的团队构建了内部设计系统？将其打包为 power，每个开发者的 agent 都知道如何使用它。

这就是 agent 变得真正有用的方式——不是通过预先知道一切，而是通过学习它们需要的东西，在需要的时候，并随着周围工具的演进不断扩展其专业知识。结果是一个知道何时思考设计系统、何时思考数据库、何时思考部署的 AI agent——就像人类开发者一样。

---

## 译者注

1. **Context rot（上下文腐化）**：指当 AI 模型的上下文窗口被过多不相关信息填充时，导致模型性能下降的现象。这是 AI 开发中的一个重要问题。
2. **Idempotent keys（幂等键）**：在 API 调用中用于确保重复请求不会产生副作用的技术，常用于支付等关键操作。
3. **Serverless 连接池**：在无服务器架构中，由于函数实例的生命周期短暂，传统的数据库连接池需要特殊处理，这是一个常见的技术挑战。
4. **RLS（Row Level Security）**：PostgreSQL 的行级安全策略，用于在数据库层面实现细粒度的访问控制。
5. **Edge Functions**：在边缘网络运行的函数，通常用于处理低延迟请求或地理位置相关的逻辑。
