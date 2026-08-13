---
slug: miniprogram-ai-cloudbase-getting-started
title: "Adding AI to a mini program: how to keep API keys safe and switch models"
image: https://binggg.github.io/og/en/miniprogram-ai-cloudbase-getting-started.png
date: 2026-06-26
authors: [booker]
tags: [ai, fullstack, cloudbase]
description: Two paths to AI-powered mini programs — using AI to write mini program code, and calling AI inside a mini program. How to keep API keys hidden, do streaming output, and switch models. A hands-on note with real pitfalls.
---

A question I get a lot: how do you add AI to a mini program?

Most people asking aren't stuck on the coding. They're stuck on the concrete parts: where to put the API key safely, why the mini program can't call the model API directly, how streaming replies work, whether switching models is a hassle.

This post covers the pitfalls I hit and the standard way I do it now. The core idea is one sentence: **let the cloud platform be the middleman — the frontend never touches a secret key.**

{/* truncate */}

## First, separate two things

People often mix these up:

**Using AI to write mini program code** — plugging a model into AI coding tools like CodeBuddy or Cursor and letting AI write your pages and cloud functions.

**Calling AI inside a mini program** — at runtime, the user types a sentence and gets an AI reply back. Chat, copywriting, customer service — all of these.

Both are possible, but they're completely different things. This post focuses on the second one, with a note on the first at the end.

## Why a mini program can't call a model API directly

My first instinct: just take the API key, call the model API from inside the mini program, done.

Doesn't work. Two hard limits:

1. Mini programs have a **domain whitelist**. The API domain has to be configured in the admin backend, and the HTTPS endpoint has to be ICP-registered.
2. **An API key in the frontend is public.** The mini program package ships to the user's phone — decompile it and the key is out. I've seen people hardcode a key in `config.js` and get it scraped for hundreds of yuan the day after launch.

So you need a middle layer. The key stays server-side. The frontend only sends requests and receives results.

## The standard way now: wx.cloud.extend.AI

In the past you'd build your own proxy on the server and handle auth, billing, and streaming yourself. Now CloudBase provides that middle layer, and the mini program calls it directly:

```js
// Initialize (app.js)
wx.cloud.init({ env: "your-env-id" })
```

```js
// In the page
const model = wx.cloud.extend.AI.createModel("cloudbase")

const res = await model.streamText({
  data: {
    model: "hy3",                      // model name, easy to change
    messages: [
      { role: "system", content: "You are a patient Chinese assistant. Keep answers concise." },
      { role: "user", content: "Introduce CloudBase in three sentences." }
    ]
  }
})

// Receive streaming output
let reply = ""
for await (let str of res.textStream) {
  reply += str
}
```

Three things it handles for me:

- **The key never leaks.** The key lives on the cloud platform side. There's nothing sensitive in the frontend code. User identity relies on the mini program login state, which the platform validates itself.
- **No domain config.** `wx.cloud.extend.AI` goes through CloudBase's internal channel, bypassing the whitelist.
- **Streaming is built in.** One loop over `textStream` gets you incremental text — no hand-rolled WebSocket.

Base library 3.15.1+ required. Below that, `wx.cloud.extend` will be `undefined`.

## Switching models = changing one parameter

The model name is just a string:

```js
model: "hy3"               // Hunyuan
model: "deepseek-v4-flash" // DeepSeek
model: "glm-5.2"           // GLM
```

The actual list depends on what's enabled in the console's "AI → text models" page. Use what you've enabled. All models in one environment share the same billing.

## When you actually need a cloud function

`wx.cloud.extend.AI` fits "frontend asks for a result directly." If your logic is more than calling a model — query the database first, build the prompt, then do permission checks — put the AI call in a cloud function:

```js
// cloudfunctions/chat/index.js
const tcb = require('@cloudbase/node-sdk')
// In a cloud function, no env needed — it uses the current environment
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

Note this uses `@cloudbase/node-sdk` (version ≥3.16.0), not the old `cloud.ai()` API from `wx-server-sdk`. I followed an old tutorial that used `cloud.ai().createChatCompletion(...)` at first — it didn't exist. The SDK was revamped and the tutorials weren't. That's the pitfall I most want to warn you about.

The frontend calls this cloud function through `wx.cloud.callFunction`.

## Path two: using AI to write mini program code

Want your AI coding tool to write mini programs directly? The config is simple. Add an OpenAI-compatible model to the tool:

| Setting | Value |
|---|---|
| Base URL | `https://<ENV_ID>.api.tcloudbasegateway.com/v1/ai/cloudbase` |
| API Key | Create one in Console → Environment Config → API Key |
| Model | `hy3` (or any enabled model) |

Then have AI write your pages and cloud functions, right-click to deploy. It saves the whole local setup step. I wrote a separate post on the details; not expanding here.

## What to check before launch

AI-generated code tends to miss three things. Before submission, have AI check itself:

- **User agreement and privacy policy** (AI collects user input — you must declare it)
- Pages have **loading states and error messages** (no blank screens on model timeout or network issues)
- Cloud functions have **access control** (not every user should be able to call your function)

My first version missed the privacy policy and got rejected in review. Lesson learned.

## One-sentence summary

Adding AI to a mini program isn't complicated now: call `wx.cloud.extend.AI` directly from the frontend, wrap it in a cloud function if the logic gets complex, keep the secret key on the cloud side forever, and switch models by changing one string.

Where are you stuck — domain config, key security, or streaming output? Leave a comment and I'll answer what I know.

Next up I'm planning: the full code for streaming chat in a mini program, plus how to manage conversation history for multi-turn dialogue. Tell me if there's something specific you want covered.
