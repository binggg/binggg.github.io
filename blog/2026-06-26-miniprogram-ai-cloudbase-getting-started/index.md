---
slug: miniprogram-ai-cloudbase-getting-started
title: 给小程序接上 AI：API Key 怎么不暴露、模型怎么换，一次说清
date: 2026-06-26
image: /og/miniprogram-ai-cloudbase-getting-started.png
authors: [booker]
tags: [ai, 全栈, cloudbase]
description: 小程序接 AI 的两条路：用 AI 写小程序代码，和小程序里调 AI。API Key 不暴露、流式输出、模型切换——一份带踩坑记录的实操笔记。
---

我常被问一个问题：小程序怎么接 AI？

问的人大多不是不会写代码，是卡在几个具体的地方：模型 API Key 放在哪才安全、小程序为什么不能直接调接口、流式回复怎么做、换模型麻不麻烦。

这篇把我踩过的坑和现在用的标准做法写一遍。核心就一个思路：**让云平台当中间人，前端永远不碰密钥。**

{/* truncate */}

## 先分清两件事

很多人把这两件事混在一起：

**用 AI 写小程序代码**——把模型接进 CodeBuddy、Cursor 这类 AI 编程工具，让 AI 帮你写页面和云函数。

**在小程序里调 AI**——小程序运行的时候，用户输入一句话，返回一段 AI 回复。做成聊天、文案、客服都算。

两件事都能做，但完全是两码事。这篇主要讲第二件，第一件最后带一句。

## 为什么小程序不能直接调大模型接口

我第一次做的时候，想法很直接：在小程序里拿 API Key 调模型接口不就行了？

不行。两个硬限制：

1. 小程序有**域名白名单**，接口域名要在后台配置才放行，还得备案过的 HTTPS。
2. **API Key 写在前端等于公开**。小程序代码打包到用户手机上，反编译就能抠出来。我见过有人把 Key 写死在 `config.js` 里，上线第二天被人刷了几百块。

所以必须有个中间层。密钥留在服务端，前端只发请求、收结果。

## 现在的标准做法：wx.cloud.extend.AI

过去要在服务端自己搭一层代理，还要处理鉴权、计费、流式。现在云开发把这个中间层做好了，小程序里直接调：

```js
// 初始化（app.js）
wx.cloud.init({ env: "你的环境ID" })
```

```js
// 页面里调用
const model = wx.cloud.extend.AI.createModel("cloudbase")

const res = await model.streamText({
  data: {
    model: "hy3",                      // 模型名，随时可换
    messages: [
      { role: "system", content: "你是个耐心的中文助手，回答要简洁。" },
      { role: "user", content: "用三句话介绍云开发" }
    ]
  }
})

// 流式接收
let reply = ""
for await (let str of res.textStream) {
  reply += str
}
```

三件事它替我解决了：

- **密钥不暴露**。Key 在云平台那边，前端代码里什么都没有。用户身份靠小程序登录态，云平台自己校验。
- **不用配域名**。`wx.cloud.extend.AI` 走云开发内部通道，绕开白名单。
- **流式是内置的**。`textStream` 一个循环就拿到增量文本，不需要自己拼 WebSocket。

基础库要 3.15.1 以上，太低会报 `wx.cloud.extend` undefined。

## 换模型只改一个参数

模型名就是个字符串，换个名字就是换模型：

```js
model: "hy3"              // 混元
model: "deepseek-v4-flash" // DeepSeek
model: "glm-5.2"           // GLM
```

具体支持哪些，以控制台「AI → 生文模型」里能开的为准。开通哪个用哪个，一个环境里的模型共享同一份计费。

## 什么时候才需要云函数

`wx.cloud.extend.AI` 适合"前端直接要结果"的场景。如果你的逻辑不止调模型——比如要先查数据库、再拼 prompt、再做权限判断——那就把 AI 调用放进云函数：

```js
// cloudfunctions/chat/index.js
const tcb = require('@cloudbase/node-sdk')
// 云函数环境里不传 env，自动使用当前环境
const app = tcb.init()

exports.main = async (event) => {
  const model = app.ai().createModel("cloudbase")
  const res = await model.generateText({
    model: "hy3",
    messages: [{ role: "user", content: event.prompt }]
  })
  return { reply: res.text }
}
```

注意这里用的是 `@cloudbase/node-sdk`（版本 ≥3.16.0），不是 `wx-server-sdk` 的旧 `cloud.ai()` API。我一开始按网上老教程写 `cloud.ai().createChatCompletion(...)`，直接报不存在——SDK 改版了，网上教程没跟上。这是我最想提醒的坑。

前端再通过 `wx.cloud.callFunction` 调这个云函数就行。

## 用 AI 写小程序代码（路径二）

想让 AI 编程工具直接写小程序，配置也简单。在 AI 工具里加一个 OpenAI 兼容的模型：

| 配置项 | 值 |
|---|---|
| Base URL | `https://<ENV_ID>.api.tcloudbasegateway.com/v1/ai/cloudbase` |
| API Key | 控制台 → 环境配置 → API Key 里创建 |
| 模型 | `hy3`（或其他已开通模型） |

然后让 AI 帮你写页面、写云函数，写完右键部署。省掉配开发环境这一步。详细的我之前写过，这里不展开。

## 上线前要检查的

AI 生成的代码容易漏三类东西，提审前让 AI 自己过一遍：

- 有没有**用户协议和隐私政策**（AI 会收集用户输入，必须声明）
- 页面有没有**加载状态和错误提示**（模型超时、断网的时候不能白屏）
- 云函数有没有**访问控制**（不是所有用户都能调你的函数）

我第一版就漏了隐私政策，审核被拒了一次，教训。

## 一句话总结

小程序接 AI 现在不复杂：前端 `wx.cloud.extend.AI` 直接调，逻辑复杂就包一层云函数，密钥永远留在云端，模型名改一个字符串就换。

你卡在哪一步？是域名配置、密钥安全，还是流式输出？评论区聊聊，我知道的都会答。

下一篇准备写：小程序里做流式对话的完整代码，以及多轮对话怎么管理历史。有想看的内容也可以直接说。
