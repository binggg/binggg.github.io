---
slug: claude-code-five-mechanisms
title: 解放双手——Claude Code 五种"放手"机制的底层逻辑
description: 从 /goal 到 Workflows，五个机制解决同一个问题：怎么让 AI 在回合制下做到"持续运行、自主决策、并行协作"。
tags: [Claude Code, AI 编程, Agent]
date: 2026-07-06
authors: [booker]
image: ./images/scene-01-cover.png
---

用过 Claude Code 做复杂任务的，八成遇到过这种事——

让 AI 把 fetch 全换成 axios，泡了杯咖啡回来，发现它改了三四个文件就停下来等你点头。反复七八次，一杯咖啡都凉了

或者睡前跑了 /loop 盯 PR，早上发现它凌晨两点卡在 git merge 冲突上，窗口占了一整夜

或者开了三个 sub-agent 各查各的——完事三个结论互相矛盾，因为它们都没看到对方在做什么

根不在 AI 不够聪明。Claude Code 是回合制的——每轮只能做一件事，做完等你决定下一步。想让它持续运行、自动决策、并行工作，就得靠产品层面的编排机制来弥补

Claude Code 给了五个：/goal、/loop、sub-agent、Agent Teams、Workflows

选错了不仅浪费 token，还会把事情搞得更复杂

{/* truncate */}

## 痛点一：我在等它，它在等我

![痛点一：每轮确认停不下来](./images/scene-02-goal.png)

你给 AI 一个明确目标，它有能力完成，但每一轮做完都停下来等你批准。这就是 /goal 要解决的问题

### /goal — 条件引导的自主轮询

```
/goal 完成 data-editor 的测试经验泛化为全模块标准测试框架，分三步：
  Step 1: 创建共享 test-utils.sh
  Step 2: 为每个模块创建 verify-*.sh
  Step 3: 更新验收标准
```

底层是轻量级的 Stop Hook：往 `sessionHooksRegistry` 注册一个 `type: 'prompt'` 的 hook，每个 turn 结束后触发一次评估

评估模型拿到三样东西：
1. **目标条件**——你写的 /goal 描述
2. **对话 transcript**——从 goal 设定时刻之后的所有对话
3. **元信息**——session ID、时间戳、权限模式等

输出是结构化 JSON：

```
{"ok": false, "reason": "Step 1 已完成，test-utils.sh 已创建，但 Step 2 还未开始"}
```

`ok: true` → stop，`ok: false` → 带着 reason 继续下一轮

关键设计：**干活的和做检查的是两个模型**，避免了主模型一边干活一边给自己打分。评估器只看 transcript，不做执行，所以能客观判断

局限也很明显：
- 串行的——一次跑一个 turn，只是省了手动回车
- 评估器不可观测——没日志告诉你为什么判定通过或失败
- 每个 turn 的 transcript 都传给评估器，对话越长评估成本越高
- 评估模型延迟叠加到每个 turn 上，选 Haiku 省时间，选 Sonnet 保准确

#### 适用边界

**适合**：目标有明确终态的任务，过程可能跨多轮，你不想坐在旁边看着

**不适合**：需要持续监控的（用 /loop），目标是发散探索性质的

有个细节：评估模型可以换。目标复杂度高就用 Sonnet 做评估，反之用更小的模型省成本

需要 v2.1.139+

---

## 痛点二：项目放着不管就长草

![痛点二：loop 卡一整夜](./images/scene-03-loop.png)

很多场景没终点——PR 需要持续关注、CI 挂了要处理、依赖要升级。你不可能一直盯着终端。但一个不盯着，就可能卡一整夜

### /loop — 自适应调度器

/goal 关心"做完了没"，/loop 关心"现在有什么需要做"

不加参数执行三段式管线：
1. 把没做完的收尾
2. 检查当前 PR 评论、CI 状态、合并冲突
3. 跑 lint、类型检查、格式化

间隔动态调整：状态活跃时 1 分钟一轮，闲下来慢慢延长到 1 小时

```
/loop          # 自适应模式（日常推荐）
/loop 15m      # 固定 15 分钟
/loop 2h       # 固定 2 小时
```

三段式不是硬编码逻辑，是内置 prompt 模板，Claude 自己决定该执行哪一步。自适应间隔也靠 Claude 对"刚才发生了什么"的感知，不是外部指标（CI、CPU、日志）

这个限制解释了为什么 Bedrock、Vertex AI、Azure Foundry 上自适应不可用——退化为固定 10 分钟。这些平台的 API 不支持"由模型决定间隔"的通信模式

**代价**：/loop 跑在**同一个 session** 里。第 10 轮的上下文比第 1 轮臃肿得多——塞了前 9 轮的产物。开销在递增，注意力在被稀释。不是 loop 本身费钱，是 session 在老化

---

## 痛点三：主上下文被灌了一堆垃圾

![痛点三：上下文爆掉](./images/scene-04-subagent.png)

一个 session 跑久了，上下文里塞满中间产物——查过的文档、试过的方案、反复修正的路径。token 越花越多，模型越来越"笨"。但你的辅助工作（查 API、调研库、验证猜想）不该污染主线

### Sub-Agent — 上下文隔离的工人

sub-agent 解决的是"主上下文宝贵"的问题。每个 sub-agent 启动时拥有**全新的 context window**，看不到你的对话历史，做完只返回摘要，不污染主会话。嵌套限制 5 层，硬编码不可配置

**隔离机制**（源码来自 `forkedAgent.ts`）：
- **独立的 AbortController**：父会话取消不影响 sub-agent，反之亦然
- **无状态传播（no-op state propagation）**：父会话不传递任何内部状态。sub-agent 连父会话用了哪些工具都不知道。想让 sub-agent 知道某个上下文，必须显式通过 prompt 传入

5 层限制的理由很实际——每层嵌套开一个新 LLM session，深度 5 意味着同时维护 5 个 session 的 token 开销。超出深度的 sub-agent 不会收到 Agent 工具，等于被静默拒绝

#### 三种创建方式

```
# 方式一：一次性的
/agent 去调研下这个函数的调用链路

# 方式二：配置文件（持久化）
# .claude/agents/researcher.yaml
name: researcher
description: 专门做技术调研的 agent，擅长读源码、查文档
prompt: 你专注于调研...
model: claude-sonnet-4-20260514
disallowedTools: [Write, Edit]

# 方式三：SDK 创建
const agent = claude.subAgent({ prompt: "..." });
```

配置文件的 `description` 字段有特殊作用——Claude 会根据描述内容自动决定什么时候该委派任务

#### 什么时候用

| 场景 | 用不用 sub-agent |
|---|---|
| 查一个函数调用链路 | 用 `/agent`，一次性，省事 |
| 频繁做的调研任务 | 写 YAML 文件持久化，可复用 |
| 并行调研多个方案 | 各开一个 sub-agent，互不干扰 |
| 只是简单 grep 一下 | 不用，主会话直接跑更快 |

#### 团队里的 sub-agent

多人协作时，项目级 `.claude/agents/` 目录可以 git 共享。团队成员 push 自己配的 agent，其他人 pull 下来就能用。这个机制让 agent 配置变成了工程资产——跟 `.claude/rules/` 一样，是项目的一部分

---

## 痛点四：十个活挤在一起干

![痛点四：多任务混在一起](./images/scene-05-teams.png)

/goal 跑一个任务，sub-agent 处理一个子任务。但你有十个活要干——修 bug、重构模块、写文档、准备 demo。不可能一个一个来，也不能让它们互相踩

### Agent Teams — 可观察的并行

Claude Code v2.1.166+ 引入的功能。核心是用独立 session 跑每个任务，互不干扰。主 session 创建任务时指定 agenda（类似 job description），Team 层负责调度

**关键行为**：

```
Task → sub-Agent session（独立，不可见）
       ↕
Task → sub-Agent session（独立，不可见）
       ↕
Main session ← 可观测 ← 各 Agent 汇报
```

相比 sub-agent，Teams 多了三层：
1. **可观测性**——主 session 能看到各个 Agent 的实时进展
2. **并行执行**——各 Agent 跑在各自的 session 里，真正的并行
3. **被动调度**——不用显式写什么时候做什么，系统自动决定

#### 子任务分配规则

主 session 拆解任务并分发，拆法不是固定的提示工程，是模型自己的判断。给一个 agenda 说"重构 user 模块"，它自己决定怎么拆

对主任务的"理解"就来自拆解的粒度：粗就代表它没真正理解，细就代表它理清了依赖关系

#### 调试难题

独立的 session 也意味着独立的 token 消耗。不出问题还好，出问题你根本不知道是哪个 Agent、哪一步、为什么。没有全局日志，每个 session 的输入输出只能单独看

官方在同一个 TUI 里展示，但独立的 session 数据只能通过主 session 间接查看，没有中心化的调试视图。这是并行化天然要付出的代价

---

## 痛点五：一个复杂任务靠纯对话推不动

![痛点五：复杂任务需要确定性](./images/scene-06-workflow.png)

有些任务不是"干就完了"，而是多个步骤环环相扣——先调研，再设计，再编码，再测试。任何一个步骤出偏差，后面全歪。没有个框架约束，纯靠模型自由发挥，结果就是"第一次成功，第二次不行"

### Workflows — 确定性的工作流

Workflows 是 Claude Code 最近推的机制，用声明式 YAML 定义多 Agent 协作的拓扑结构。跟 Teams 的区别不在谁厉害，在**编排哲学不同**：

| | Teams | Workflows |
|---|---|---|
| 拓扑 | Hub-and-Spoke（星型） | 有向图（DAG） |
| 调度 | 被动——Task 创建后系统自动 | 显式——Step 执行顺序你定 |
| 通信 | 主 session 单向看汇报 | 上一步输出是下一步输入 |
| 确定性 | 低——看模型发挥 | 高——调参可复现 |
| 适合 | 探索性、不确定性高的任务 | 确定性、质量要求稳定的任务 |

Workflows 的阶段定义：

```yaml
name: "feature-dev"
agents:
  design:
    model: claude-sonnet-4-20260514
    prompt: "你负责技术设计..."
  implement:
    model: claude-sonnet-4-20260514
    prompt: "你负责实现..."
  review:
    model: claude-sonnet-4-20260514
    prompt: "你负责代码审查..."

steps:
  - agent: design
    output: DESIGN
  - agent: implement
    input: DESIGN
    output: CODE
  - agent: review
    input: CODE
    output: REVIEW
```

每个 step 的 `output` 是上个 step 的输出路径，`input` 是当前 step 的输入。链条清晰，出了问题知道在哪一步断的

#### Workflows 里的任务类型

内置三种：
- **feature** — 串行步进
- **swe** — 专门针对软件工程的多轮循环（设计→编码→测试→修复→审查）
- **research** — 探索性研究（不是多步，是让 agent 自己探索）

---

## 决策指南：什么场景用什么？

![决策树：五种机制选哪个](./images/scene-07-decision.png)

```
                    你的痛点是什么？
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
  每轮确认太烦        不能一直盯着         任务太复杂
   /goal               /loop               Workflows
          │                │
          ▼                ▼
   主上下文爆了        十个活挤一起
   sub-agent           Agent Teams
```

具体来说：

- **单个明确目标，过程可能跨多轮** → /goal（串行自主，最轻量）
- **没终点，需要持续关注** → /loop（自适应，但注意 session 老化）
- **辅助工作不应污染主上下文** → sub-agent（隔离最彻底）
- **同时做多件事，互不依赖** → Agent Teams（真正的并行）
- **质量要求稳定，步骤环环相扣** → Workflows（确定性最高）

---

## 写在后面

这些痛点的共同来源不是 Claude Code 的功能缺陷，而是**我们让 AI 做它设计上不擅长的事**——持续运行、自主决策、并行协作。/goal 把回合制伪装成持续执行，/loop 把等待包装成自适应调度，sub-agent 用隔离对抗膨胀。每个机制都在弥补回合制模型的局限

补丁思维看，它们确实是 hook 和 session 层面的包装。但换个角度，Claude Code 没有重新发明运行时，而是在回合制上用最轻量的方式（hook、新 session、JS 沙箱）递进出编排能力的光谱——从简单到复杂，从串行到并行

**回合制不是缺陷，是约束**。每次 turn 交回控制权，意味着可中断、可审计、可干预。持续执行的系统出问题很难喊停。回合制给了一个天然的安全边界

**编排是妥协的艺术**。想要可预测性？用 Workflows，放弃灵活性。想要隔离性？用 sub-agent，接受上下文同步成本。没有完美机制，只有取舍

**最贵的不是 token，是你的注意力**。省掉你盯着终端的时间，比省几个 token 更有价值。释放认知带宽才是这些机制真正的价值

---

## 🥚 彩蛋：一份可以直接用的 agent 配置包

上面讲了五种机制，但最有用的事情是帮你配好。这是我目前在用的 `.claude/agents/` 配置——三个配置好的 Agent，各自管一件事：

**1. researcher — 纯调研，不改代码**

```yaml
# .claude/agents/researcher.yaml
name: researcher
description: 专门做技术调研的 agent，擅长读源码、查文档、验证猜想
prompt: |
  你是一个技术调研助手。
  你的工具权限限制为只读：可以 Read、Grep、Glob，但不能 Edit、Write、Bash（除了非破坏性命令）。
  你收到的任务格式是：
    ## 调研目标
    [要搞清楚的问题]
    
    ## 背景
    [相关代码/文档的定位]
  调研完成后输出：
    - 核心发现（3-5 条）
    - 证据来源（文件路径 + 行号）
    - 推荐方案或下一步
model: claude-sonnet-4-20260514
disallowedTools: [Write, Edit, Bash]
```

**2. reviewer — 代码审查，不改代码**

```yaml
# .claude/agents/reviewer.yaml
name: reviewer
description: 代码审查，侧重安全、性能、可维护性
prompt: |
  你是一个代码审查助手。
  你只读不改。收到 PR diff 或代码块后，按以下维度审查：
  1. 安全隐患（SQL 注入、XSS、凭据泄露）
  2. 性能问题（N+1 查询、不必要的循环、内存泄漏）
  3. 可维护性（重复代码、命名、复杂度）
  4. 测试覆盖（缺什么测试、怎么补）
  每条问题标注严重程度：P0(必须修) / P1(建议修) / P2(可以以后修)
model: claude-sonnet-4-20260514
disallowedTools: [Write, Edit]
```

**3. refactorer — 专注重构，全权限**

```yaml
# .claude/agents/refactorer.yaml
name: refactorer  
description: 代码重构 agent，处理有明确范围的重构任务
prompt: |
  你是一个重构助手。
  你接收一个明确的模块路径 + 重构目标。
  规则：
  - 重构前必须先在当前目录跑一次测试，确认基线通过
  - 每次修改后跑相关测试，失败立即回退
  - 不改模块边界之外的文件
  - 重构完成后输出变更摘要
allowedTools: [Read, Write, Edit, Bash, Glob, Grep]
```

**用法：** 把这些文件放到项目根目录的 `.claude/agents/` 下，然后在 Claude Code 里用 `/agent researcher` 或 `/agent reviewer` 直接调。配置文件 Push 到仓库后团队都能用。

---

**你现在用什么场景在用这些机制？踩过什么坑？评论区聊聊 \:)**

---

*全文基于 Claude Code 实际使用 + 源码分析（forkedAgent.ts / sessionHooksRegistry / DynamicWorkflow testing 等），持续更新*
