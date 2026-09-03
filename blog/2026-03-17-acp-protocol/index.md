---
slug: acp-protocol
title: Agent 和编辑器之间，也该有一条「标准线」：ACP 协议拆解
description: 今年做 Background Agent 时，我把 Agent Client Protocol（ACP）翻了一遍。它想解决的问题很朴素：别让每个编辑器都给每个 Agent 单独写一套对接。本文按官网事实拆协议骨架，并对照我自己踩过的选择。
tags: [ai, agent, acp, protocol, ide]
authors: booker
date: 2026-03-17
draft: true
---

大家好，我是 Booker。

2026 年 3 月，我在给 Background Agent 的 Issue #5（Agent Executor）选方案。当时桌上有两条路：自己搓一套「编辑器 ↔ Agent」的适配层，或者接一条已经有人在推的协议。

我选了后者，理由很土：不想一年后还在维护私有 JSON 字段名。

这条协议叫 **Agent Client Protocol**，简称 **ACP**。官网是 [agentclientprotocol.com](https://agentclientprotocol.com/)。发起方是 Zed 和 JetBrains，定位写得很直白：标准化「代码编辑器 / IDE」和「编码 Agent」之间的通信，本地和远程场景都要覆盖。

这篇不是产品通稿。我按官网文档核对过关键事实，把协议骨架拆开讲，并写清楚：它和 MCP 各管哪一层，我当时为什么愿意多花一两小时学它。

{/* truncate */}

## 先说疼在哪

你大概碰到过这种组合：

- 团队里有人用 Zed，有人用 IntelliJ，有人用 VS Code 系编辑器
- Agent 这边有 Claude Code、Gemini CLI、Codex、自家包装的 CLI……名单还在涨
- 每接一对，就要写插件、对私有 API、处理鉴权、diff、取消、会话恢复

编辑器侧的成本是「为每个 Agent 写一次」。Agent 侧的成本是「为每个编辑器写一次」。N 个编辑器 × M 个 Agent，矩阵爆炸。

LSP 当年解决的是语言服务器和编辑器的矩阵。ACP 想解决的是 Agent 和编辑器的矩阵。官网自己也这么类比，我不额外发明比喻。

痛点落在三件事上：

1. **集成税**：每多一个 Agent，编辑器团队加班；每多一个编辑器，Agent 团队加班。
2. **锁定**：你选了某个 Agent，往往也等于接受了它能进哪些界面。
3. **体验碎**：有的 Agent 只会在终端里吐字，有的能在 IDE 里出 diff，能力不齐，切换成本高。

ACP 的承诺很简单：Agent 实现一次协议，就能进所有兼容客户端；客户端支持一次协议，就能挂上生态里的 Agent。

## ACP 管什么，不管什么

我第一次读文档时，最容易和 **MCP（Model Context Protocol）** 搞混。两者名字都带 Protocol，都在 Agent 周边，但切面不同。

粗分一下：

| 切面 | 大致回答的问题 | 典型角色 |
|------|----------------|----------|
| **ACP** | 编辑器怎么跟编码 Agent 说话？ | Client = IDE / 编辑器；Agent = 编码助手进程或服务 |
| **MCP** | Agent 怎么拿工具和外部上下文？ | Host / Client 接各种 MCP Server（文件系统、数据库、浏览器……） |

官网写得很克制：ACP **在可能的地方复用 MCP 的 JSON 表示**，但又为 Agent 编程体验补了专用类型，比如 diff 展示。默认给用户看的文本格式是 **Markdown**，不要求编辑器渲染 HTML。

一句话：MCP 更偏「工具与资源接入」；ACP 更偏「编辑器里的人机 Agent 会话面」。两者可以并存。JetBrains 在介绍里也提到，ACP 负责 IDE 与 Agent 的会话，额外工具和上下文仍可通过 MCP 到达 Agent。

如果你正在做 CloudBase MCP、Skills、CLI 这类「能力出口」，MCP 更贴你日常。如果你在做「把某个 Agent 嵌进 IDE / 工作台」，ACP 才是那条线。

## 通信长什么样

协议假设：用户主要待在编辑器里，需要时才拉起 Agent 帮一把。

本地场景是主路径：

- 编辑器把 Agent 拉成**子进程**
- 双方用 **JSON-RPC** 通信
- 传输走 **stdio**（标准输入输出）

远程场景也在协议范围里：HTTP / WebSocket。官网明确说过，**远程 Agent 的完整支持仍在推进**，他们在和各 Agent 平台协作，把云托管场景的需求补进协议。写文章时别把「远程已完全成熟」写成定论。

消息层是熟悉的 JSON-RPC 2.0 味道：有 `id`、`method`、`params`。会话相关方法覆盖初始化、鉴权、建会话 / 恢复会话、列表、删除、关闭、prompt 轮次、工具调用上报、取消、终端、计划（agent plan）、会话模式与配置项等。文档现在同时维护 **v1** 与 **v2（Draft）**，实现前先看你跟的是哪一版 schema。

我不会在这里贴一套「看起来能跑」的伪 SDK 代码。2026 年 3 月我读过的 Python 示例，和现在官网列出的多语言库（Kotlin / Java / Python / Rust / TypeScript）演进很快；Rust 与 TypeScript SDK 已到 1.0 的公告也上过官网。示例以官网 Libraries 页为准，避免博客里冻死过期 API。

你要记住的骨架只有三步：

1. **Initialize**：双方交换能力与实现信息
2. **Session**：创建或恢复一个会话，挂上工作区根目录等上下文
3. **Prompt turn**：用户发任务，Agent 流式回内容块、工具调用、diff、计划；客户端负责展示、审批、取消

## 生态现在走到哪了

2026 年 1 月，JetBrains 和 Zed 一起推了 **ACP Agent Registry**：在 IDE 里浏览、安装兼容 Agent，减少手写配置。JetBrains 博客写过安装入口（Settings → Tools → AI Assistant → Agents），并说明 Agent 通常自带订阅，不强制捆绑 JetBrains AI 订阅。

客户端名单比我 3 月调研时长了一大截。官网 Clients 页现在能看到：

- 编辑器：Zed、JetBrains、VS Code 系扩展、Neovim 插件、Emacs、Qt Creator、Unity、Visual Studio 等
- CLI / 桌面 / Web / 笔记本 / 消息桥（Slack、Telegram、飞书等）都有人在接

Agent 侧也从「几个演示」长成「可注册、可分发」。具体名单以 [Agents](https://agentclientprotocol.com/get-started/agents) 与 Registry 为准，博客里抄一份名单明天就会旧。

对我这种做平台的人，信号很明确：**编辑器厂商愿意把「Agent 插槽」标准化**，而不是永远只推自家助手。

## 我当时怎么做选择

回到 Issue #5。

自定义适配器的诱惑很大：直接调模型 API，日志格式自己定，状态机自己写，两天能出 Demo。问题在后面：

- 换一个 Agent，适配层重写一块
- 想在 IDE 里看标准 diff / 审批流，又要自己造 UI 契约
- 团队里有人坚持用另一套 Agent，你得再开一条分支

走 ACP 的成本是：多花一点时间读协议、对齐 schema、用官方或社区 SDK。收益是：

- 会话面跟生态对齐，少发明私有字段
- 以后换 Agent，更像「换实现」，不像「换协议」
- 文档、示例、Registry 有人一起扛，不是单人仓库里的隐式约定

我在内部笔记里写过一张粗对比表：短期自定义可能更快，长期 ACP 更省维护。半年后再看生态扩张速度，这个判断还站得住。

也说缺点，免得读起来像布道：

- 协议在动。v2 Draft、Transports Working Group、各种 RFD（session resume、elicitation、MCP-over-ACP 等）说明它还年轻，跟版本要谨慎。
- 远程传输未完全定型。云端常驻 Agent 别假设「抄本地 stdio 就完事」。
- 「兼容」不等于「体验一致」。同样是 ACP Agent，工具权限、鉴权方式、流式粒度差很多，客户端还是要做产品判断。

## 和你日常工具链怎么摆

如果你已经在用 MCP（例如 CloudBase MCP），不必二选一。

实用摆法：

1. **能力层**：数据库、部署、登录、知识库 → 继续 MCP / Skills / CLI
2. **界面层**：要在 Zed / JetBrains / 自研工作台里聊 Agent、看 diff、点审批 → 接 ACP
3. **编排层**：Background Agent、值班调度、多 Agent 接力 → 会话面优先说 ACP；工具调用仍可落到 MCP

我自己写 DeepSeek Harness 拆解时提过一个场景：三个 Agent，分别来自 MCP、ACP、Hooks 生态，想接到一块。Harness / 工作台如果只认一种私有协议，最后还是矩阵税。ACP 至少把「编辑器会话」这一刀切开了。

## 想动手，最小路径

1. 打开 [Introduction](https://agentclientprotocol.com/get-started/introduction) 和 [Architecture](https://agentclientprotocol.com/get-started/architecture)，先建立 Client / Agent / Transport 心智模型。
2. 看 [Clients](https://agentclientprotocol.com/get-started/clients) / [Agents](https://agentclientprotocol.com/get-started/agents)，确认你目标编辑器是否已有客户端实现。
3. 选一门官方库（Python / TypeScript / Rust 等）跑通 initialize → session → prompt。
4. 若要分发，读 Registry 的贡献说明；JetBrains / Zed 侧安装路径以厂商文档为准。
5. 跟协议变更看 [Updates](https://agentclientprotocol.com/updates) 和 RFD，别只盯着某篇 2025 年的介绍文。

本地调试时，stdio + JSON-RPC 很好抓包：父子进程、一行一个 JSON，比「某个闭源插件内部 event bus」透明得多。出问题先看 initialize 能力协商和 session 根目录是否传对。

## 校对说明（给自己留档）

本篇关键事实核对来源（2026-09-03）：

- 官网 Introduction：本地 stdio / JSON-RPC；远程 HTTP·WebSocket；复用 MCP JSON 表示；Markdown 默认；远程完整支持仍在推进
- Clients / Libraries / Announcements：生态与 SDK 1.0、Registry、v2 Draft 等状态以官网为准
- JetBrains 博客：ACP Registry、IDE 安装路径、与 MCP 并存关系
- 个人背景：2026-03-05 为 Background Agent Issue #5 做的协议选型笔记（内部稿转公开叙事时，去掉未验证的第三方仓库星标与过期伪代码）

未采用的材料：源稿里部分「已支持」列表与示例类名，已过时或无法在官网上一对一核验，故不写入正文断言。

## 结尾

Agent 生态不会收敛成「一个编辑器 + 一个助手」。会收敛的，大概率是几条协议线：工具怎么接（MCP）、会话怎么进 IDE（ACP）、模型怎么被驾驭（各家 Harness）。

我愿意在 ACP 上花时间，是因为不想再给每个 Agent 写一遍「显示 diff 的私有插件」。你要是正在做 IDE 插件或 Agent 运行时，值得先读一遍官网，再决定要不要自己发明协议。

如果你已经在某个编辑器里跑通过 ACP Agent，欢迎告诉我卡在哪一步：鉴权、会话恢复，还是工具审批。

---

### 反 AI 腔 10 项自查（投稿前）

| # | 检查项 | 结果 |
|---|--------|------|
| 1 | 破折号 ≤3 | 通过（正文慎用） |
| 2 | 「不是…而是…」≤1 | 通过（0 处） |
| 3 | 「竟然/没错/这意味着」≤1 | 通过 |
| 4 | 「本质/根本上」=0 | 通过 |
| 5 | 正文 emoji =0 | 通过 |
| 6 | 「在当今/值得注意的是」=0 | 通过 |
| 7 | B 站模板结构 =0 | 通过 |
| 8 | meta 自检预告 =0 | 通过 |
| 9 | 开场用具体场景 | 通过（Issue #5 选型） |
| 10 | 「先立靶子再打倒」=0 | 通过 |

字数：正文约 2800+ 汉字（含表格与列表）。状态：`draft: true`，未发布、未部署。
