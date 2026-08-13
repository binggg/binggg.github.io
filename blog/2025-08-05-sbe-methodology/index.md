---
slug: sbe-methodology
title: 为什么你的 AI 编程总是返工？SBE 方法论给出了答案
date: 2025-08-05
image: /og/sbe-methodology.png
authors: [booker]
tags: [ai, 全栈]
---

用 Spec 工作流写了几个月代码之后，我一直在想一个问题：这套"先写需求、再写设计、再拆任务"的流程，为什么有效？

直到我翻到 Gojko Adzic 的《实例化需求：团队如何交付正确的软件》，才把这件事想明白。Kiro 的 Spec 工作流，背后正是 SBE（Specification by Example）方法论。这篇文章把两者的关系讲清楚，也解释你的 AI 编程为什么总在返工。

{/* truncate */}

![](./images/cover.png)
*图：文章配图*

## 你的 AI 编程为什么总是返工？

几个常见场面：

- 让 AI 生成一个登录功能，结果生成了注册页面
- 要求实现数据导出，AI 却给你一个数据导入功能
- 想要一个简单的 API，AI 却生成了复杂的微服务架构

问题不在 AI 不够聪明，在需求表达太模糊。就像和一个外国朋友说"我要吃饭"，他可能理解成"我要吃米饭"、"我要去餐厅"或者"我要点外卖"。

在 AI 编程里，这种模糊性被放大了。AI 只能根据你的描述猜你想要什么，猜对了省事，猜错了返工重来。

传统软件工程早就遇到过同样的问题：

1. **需求歧义**：同一个需求，不同人理解不同
2. **后期返工**：开发完成后发现理解偏差
3. **文档滞后**：需求文档跟不上实际变化
4. **沟通成本**：反复确认需求，拖慢节奏

这些问题在 AI 编程里只会更严重。需求不清晰的时候，AI 就像在黑暗中摸索，靠运气生成符合期望的代码。

## SBE 是什么

Gojko Adzic 在《实例化需求》里提出的 SBE，就是冲着这些问题来的。

### 核心原则

**1. 以实例为中心的需求定义**

用具体、真实的例子替代抽象描述：

❌ **抽象描述**：用户登录功能要安全可靠
✅ **实例化描述**：
- Given 用户输入正确的用户名和密码
- When 点击登录按钮
- Then 系统显示欢迎页面

**2. 协作式需求澄清**

跨角色一起讨论实例，避免"需求孤岛"。在 AI 编程里，这就是人机协作的过程。

**3. 从需求到可执行测试**

把实例转成自动化测试用例，实现"需求即测试"。这是 Spec 模式里基于 requirement 生成测试用例的理论基础。

**4. 活文档（Living Documentation）**

实例化需求产出的是一套随需求变更自动更新的文档系统。对应到 Spec 模式，就是持续迭代的 requirements.md 和 design.md。

## SBE 与 Spec 模式的映射

### 需求澄清 → requirements.md 的迭代

**SBE 原则**：用具体实例澄清需求，确保理解一致。

**Spec 实践**：
```markdown
### 需求 1 - 用户登录功能

**用户故事：** 作为用户，我希望能够安全登录系统，以便访问我的个人数据。

#### 验收标准
1. When 用户输入正确的用户名和密码时，系统应当显示欢迎页面
2. When 用户输入错误的密码时，系统应当显示错误提示
3. When 用户连续输入错误密码 3 次时，系统应当锁定账户 30 分钟
```

### 技术设计 → design.md 的协作

**SBE 原则**：避免技术陷阱，聚焦业务功能。

**Spec 实践**：
```markdown
## 技术方案设计

### 架构设计
- 前端：React + TypeScript
- 后端：Node.js + Express
- 数据库：MongoDB
- 认证：JWT Token
```

### 测试驱动 → 基于需求的测试生成

**SBE 原则**：需求即测试，确保实现符合预期。

**Spec 实践**：
```javascript
// 基于 requirements.md 自动生成的测试用例
describe('用户登录功能', () => {
  test('正确密码登录成功', async () => {
    const response = await login('user@example.com', 'correctPassword');
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('欢迎页面');
  });

  test('错误密码登录失败', async () => {
    const response = await login('user@example.com', 'wrongPassword');
    expect(response.status).toBe(401);
    expect(response.data.error).toBe('密码错误');
  });
});
```

## 我在实践中验证了什么

### 需求迭代和澄清是整个流程的核心

requirements.md 和 design.md 反复迭代的过程，比最终文档本身值钱。每次澄清都在消除 AI 猜错的可能。我在 CloudBase-AI-ToolKit 项目里每个新功能都走 Spec 模式，最直观的感受是：需求阶段多花半小时，实现阶段少返工好几轮。

### 基于需求生成测试用例，让 AI 编程可验证

requirements.md 里的每一条验收标准，都是一条测试用例的输入：

```markdown
# requirements.md 示例
When 用户上传文件时，系统应当验证文件类型和大小
When 文件验证通过时，系统应当返回上传成功响应
When 文件验证失败时，系统应当返回错误信息
```

### 存量项目也能用

Spec 模式不挑新项目。老项目里每次新功能开发都走 Spec 工作流，逐步把现有功能迁进去，团队规范就慢慢立起来了。

### 粒度拆分

关于粒度，我的经验是：

**按功能模块拆分**
```
specs/
├── user-management/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── file-upload/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── data-export/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

**按迭代拆分**
```
specs/
├── v1.0-basic-features/
├── v1.1-advanced-features/
└── v1.2-optimization/
```

**按复杂度拆分**
- **简单功能**：单个 spec 文件
- **中等功能**：独立的 spec 文件夹
- **复杂功能**：多个关联的 spec 文件夹

## 适用场景

**适合**：
- 复杂项目，涉及多个模块
- 团队协作，需要统一标准
- 质量要求高，需要可追溯性

**不太适合**：
- 快速原型，验证想法
- 个人项目，简单功能
- 时间极其紧迫的项目

## 总结

SBE 给 AI 编程补上了理论底座：实例化需求、协作式澄清、测试驱动、活文档。这四个动作对应到 Spec 工作流里，就是 requirements.md、design.md、tasks.md 那套流程。

AI 不是替代人，是让人更专注于决策和把控方向，把繁琐的细节交给 AI。这样 AI 编程就不靠运气了。

这篇文章本身，也是我用这套工作流和 AI 搭档一起协作完成的。从理论研究到经验总结，过程就是 Spec 模式的现场演示。

你目前用的是哪种开发模式？Spec 模式在你的项目里可行吗？评论区聊聊。
