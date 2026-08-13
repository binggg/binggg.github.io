---
slug: ai-miniprogram-dev-guide
title: "Building a mini program with AI: from registration to submission, every step I actually walked through"
image: https://binggg.github.io/og/en/ai-miniprogram-dev-guide.png
date: 2026-07-07
authors: [booker]
tags: [ai, fullstack, cloudbase]
description: A complete hands-on record of building a mini program with AI in 2026 — account registration, claiming growth-plan resources, connecting AI tools to CloudBase, AI agent Skills, deployment and review. Every step with honest commentary and pitfalls.
---

To be honest, I rarely think a "perk" is worth a dedicated post. This one is different.

In July 2026, three things lined up:

- WeChat DevTools opened up **AI agent Skills**, so the Cursor / Claude Code you use can directly read DevTools console logs, look at simulator screenshots, auto-deploy cloud functions.
- The **mini program growth plan's second phase** bumped Token from 100M to 1B, image generation from 10K to 100K, and upgraded the model to Hunyuan Hy3.
- **CloudBase flattened the backend** — AI tools connect directly to its models, Token comes out of your plan, and you can deploy right after writing.

Put together, the hardest hurdles to "one person building a complete mini program alone" were all cleared. Below is my hands-on note. I walked every step, and I'll tell you what's good and what's not.

{/* truncate */}

## Registering the account: AppID cost me ten minutes

Register a mini program account at [mp.weixin.qq.com](https://mp.weixin.qq.com). A personal entity is fine.

After registering, copy your **AppID** — under "Develop > Development Settings." You'll need it for every step. I didn't write it down and kept going back to look it up. Save it in your notes now.

## Claiming the growth plan resources: this step is genuinely valuable

Log into the WeChat public platform, left menu → **Industry Capabilities → Mini Program Growth Plan**, click "Join," fill in a description and source (I filled "friend invite," approved instantly).

After signing up, click "Claim" and 1B Token + 100K image generations land immediately. At official API prices, those are worth over 20,000 yuan.

Key details, don't trip on these:

- The resource pack is valid for **6 months**, one claim per account
- If you joined phase one, you get **auto-supplemented**, no re-application needed
- No CloudBase environment? You get **6 months of the personal plan**; already have one? You get a **120 yuan voucher**
- WeChat notifies you at 80%, 90%, 100% usage

Mini games can claim too, via "Features > Game Capability Map > AI Growth Plan." I haven't tested that one — check the official page.

## Installing DevTools: the version must be new enough

Download [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html).

To use AI agent Skills, you must install **preview build 2.02.2607032 or later**. I installed the stable build at first and couldn't find the Skills entry anywhere. It took half an hour of reading docs to discover the version requirement. A wasted half hour.

## Connecting AI tools to CloudBase: the smoothest part

Your Cursor, CodeBuddy, Claude Code can connect directly to CloudBase's models, Token comes from your plan — no separate API key purchase.

Get your environment ID (`ENV_ID`) from the console, then configure in the AI tool:

| Setting | Value |
|---|---|
| Base URL | `https://<ENV_ID>.api.tcloudbasegateway.com/v1/ai/cloudbase` |
| API Key | Your CloudBase API key |
| Model | `hy3` (or any enabled model) |

Entry points differ per tool, same principle:

- **CodeBuddy**: Settings → Add custom model → Provider: OpenAI Compatible
- **Cursor**: Settings → Models → put CloudBase's key in OpenAI API Key, and the URL above in Override Base URL
- **Claude Code**: two env vars, `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`

Supported models include Hunyuan, DeepSeek, GLM, Kimi, MiniMax — all in the same plan pool.

## What genuinely excites me: AI agent Skills

### The problem before

Your AI coding tool can read and write code, run commands, but the world inside DevTools is invisible to it — did the compile pass, what does the simulator look like, what did the console log, is the cloud function deployed. It's like a top-tier chef who knows recipes by heart but can't see the pot or smell the food. You just keep tasting.

### Four scenarios I find most useful

**A cloud function errors** → AI reads the console log and network requests directly, locates the exact line, fixes it itself. No copy-paste.

**UI finished, time to verify** → AI auto-compiles, operates the simulator, screenshots and checks the layout. Text misaligned, styles off — it finds and fixes.

**"Make me a daily-poem mini program"** → AI goes from writing code to compiling, verifying, and pushing a real-device preview, all automatic. You scan a QR code and see the result.

**Screenshot the layout itself** → button positions, spacing, colors — it screenshots and reviews.

### Security

Dangerous operations like cloud function deployment and preview release pop a confirmation dialog. Sensitive info like AppID and cloud env requires your authorization. Everything runs locally — code and logs never upload.

### How to connect

Install the preview build, then pick one:

- Run `wechatide` in the terminal, paste the output Skill path into your AI tool
- Or DevTools menu → "Export DevTools Skill" → import into the AI tool

## Hands-on: build a "Daily Poem" mini program

Walk a real case so you get the feel.

**Step one: have AI generate the project.** In your AI tool (connected to CloudBase), type:

```
Create a WeChat mini program called "Daily Poem."
The home page shows a poem line + author + plain-language translation.
Bottom TabBar has Home and About pages.
Data read from the cloud database. Light, clean style.
```

AI produces the `app.json` and page code scaffold. I scanned the structure first — clean naming, no random file names.

**Step two: set up the cloud env.** Click "Cloud Dev" in DevTools, pick your environment (or use the one the growth plan gave you). Create a `poems` collection and add one record:

```json
{
  "title": "Thoughts on a Still Night",
  "author": "Li Bai",
  "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
  "translation": "Bright moonlight before my bed, I wonder if it's frost on the ground. Lifting my head, I gaze at the bright moon; lowering it, I miss my hometown."
}
```

**Step three: have AI write the cloud function + frontend.** Ask it to create a cloud function that returns a random poem from the collection, and call + render it on the home page:

```javascript
exports.main = async (event, context) => {
  const { data } = await db.collection('poems')
    .aggregate().sample({ size: 1 }).end()
  return { code: 0, data: data[0] }
}
```

Right-click the cloud function and "Upload and Deploy." With AI agent Skills, let AI deploy it itself.

**Step four: preview and debug.** Click "Preview" in DevTools, scan the QR code with WeChat. Hit an error? With Skills, just say "help me look at this error" — it reads logs, locates, fixes. Without Skills, paste the error to AI and it fixes it too.

## Launch and review: run AI through a checklist before submitting

Upload from DevTools → submit for review in the mini program admin console under "Manage > Version Management." Usually 1-3 business days.

**One warning**: AI-generated code often misses non-functional requirements like the privacy policy and user agreement. My first submission got rejected precisely because there was no privacy policy. Before submitting, have AI check:

```
Help me check whether this mini program meets review requirements:
- Is there a user agreement and privacy policy?
- Do pages have loading states and error messages?
- Do cloud functions have access control?
- Does it fit the chosen category's service scope?
```

## Why I think now is the best time

**Money:**

| Item | Before | Now |
|---|---|---|
| AI coding | Cursor $20/mo | CloudBase plan includes Token |
| Backend | server 50+/mo | Cloud Dev free for 6 months |
| AI models | pay-per-API | 1B Token + 100K images free |
| Payments | build your own | all-terminal virtual payments + discounted rates |

**Time:** A mini program with a backend used to take 5-7 days. Now with AI, 2-3 hours to a prototype, 1-2 days to submission. Debugging went from "copy-paste the error" to "AI reads logs, locates, fixes."

**Data:** 45K mini programs have joined the growth plan, 70%+ individual developers. Homework helpers, game guides, ID-photo generators, voice tools — products hitting 100K daily active users in every vertical. That number is the official figure; source is in the links below.

WeChat's social distribution + virtual payments + plug-and-play ad integration makes "build it → people use it → monetize" a much shorter chain.

## Practical reminders

- **Models get deprecated.** The `hy3` I mention is the recommended model today, but names change. Before you start, check "AI → text models" in the console for the current list. Don't copy model names from old tutorials.
- **When Token runs out, switch to a resource-point plan.** Plan usage offsets model Token; DeepSeek, Hunyuan, GLM, Kimi, MiniMax all draw from the same pool.
- **One claim per account.** Used up your practice quota? Register a fresh mini program account and claim again.

## References

1. 微信开发者. 在你熟悉的编程环境里搞定小程序项目开发. 微信公众平台, 2026-07-07. https://mp.weixin.qq.com/s/WdU010YZ4VMjG84YN2nuQg
2. 微信公开课. 10亿Token免费！AI小程序成长计划上新混元Hy3. 微信公众平台, 2026-07-07. https://mp.weixin.qq.com/s/_89my8Dh8TyoJYs_gGosEw
3. 腾讯云开发CloudBase. 从写代码到上线，一份 CloudBase 套餐做完一个小程序. 微信公众平台, 2026-06-26. https://mp.weixin.qq.com/s/p0goKaram_K2NURUkZvflQ
4. 腾讯云开发. AI 工具 — CloudBase 文档. https://docs.cloudbase.net/ai/quickstart/ai-tools
5. 赛博禅心. 微信小程序「成长计划」：价值2万多的token，1分钟到账. 微信公众平台, 2026-07-07. https://mp.weixin.qq.com/s/-jjlPQILjD_WgVqtnrvXrw

---

Have you built a mini program with AI lately? Where did you get stuck? Leave a comment and I'll answer what I know.
