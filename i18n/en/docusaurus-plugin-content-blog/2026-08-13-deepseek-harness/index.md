---
slug: deepseek-harness-pragmatic
title: "Same Model, Different Harness, Worlds Apart: I Read DeepSeek Harness's Source. Here's What's Actually New."
description: "The model is the soul; the harness is the body. I read DeepSeek Harness (dsh)'s source and official docs to unpack its three real design decisions: even the agent loop is a plugin, PTC redefines the tool surface the model sees, and model-visible must equal logged. Plus cold water and an honest account of my failed first run."
tags: [ai, agent, deepseek, harness, open-source]
authors: booker
date: 2026-08-13
image: https://binggg.github.io/og/en/deepseek-harness-pragmatic.png
lang: en
---

> The model is the soul. The harness is the body.

![Agent = Model + Harness](./img/01-definition.png)
*The model thinks. The harness does.*

Hi, I'm Booker.

Today I'm taking apart DeepSeek Harness (dsh), open-sourced by DeepSeek yesterday (2026-08-13).

This is not a secondhand recap. I read the source and the official docs. I'll walk through its three real design decisions, pour some cold water, and honestly tell you my first run failed.

{/* truncate */}

## Start with three questions

Three scenarios. You've probably hit at least one.

**First.** You ran a long agent task. It failed after hours. Can you tell which tool call it died on? Can you reconstruct what context the model was actually seeing?

**Second.** You wanted to add a rule: "after a tool call fails, retry once." Can you add it? Or do you have to fork the framework?

**Third.** You wanted three agents working together: one researching, one writing code, one reviewing. They come from different ecosystems — one speaks MCP, one speaks ACP, one speaks Hooks. Can you wire them together?

This article is about those three questions.

DeepSeek's answer for dsh fits in three words: **everything is a plugin.** But "everything is a plugin" is easy to misunderstand. Read on.

## A model doesn't do things. It generates text.

Start at the most basic place.

You ask ChatGPT a question. It answers. At this point you have no concept of a "harness," and you don't need one. It's a thing that generates text: you feed it a sentence, it produces the next one.

The trouble starts when you ask it to *do* something.

Say: "fix the code in this project." To fix code, it needs to read files, find the error, edit it, run tests. The model can do none of that.

A model does exactly one thing: **predict the next token.** What it generates isn't "the act of fixing code" — it's text describing how to fix it.

So who actually reads files and runs commands?

Something outside the model has to wrap those real actions into a form the model can "call." The model says "read src/main.ts"; this layer reads it and feeds the content back.

**That layer is the Harness.**

The official site puts it better than I can:

> "The model is the soul of the agent. The Harness gives the agent the ability to understand its environment, use tools, and keep working in real scenarios."

Here's the non-obvious part: most people don't know this layer exists. We say "switch models, switch agents." But the same model inside a different harness can perform dramatically differently — how tools are exposed, how context is managed, how the loop runs — all of that is harness territory.

## The moment things get complex, this layer has a lot to manage

If "read one file" were all it did, a thin wrapper would be enough. Real tasks aren't like that.

Back to "fix the code." A real fix task involves:

- The model says "read this file." First question: **do you have permission?** That's the sandbox's job.
- The file is huge. You need to **trim or compress** it before feeding it back. That's the context layer's job.
- Tests fail after the edit. **Retry? How many times?** That's the loop layer's job.
- Every step **needs to be logged**, or you'll never know where it died. That's the traceability layer's job.
- Should this run in a CLI, a web UI, or behind an IDE? That's the entry-point's job.

Every one of these needs someone to make decisions for the model. Those decisions all live in the Harness.

![Three pains, three answers](./img/02-painpoints.png)
*Three real pains, and the mechanisms dsh built for them*

Here are the three pains everyone hits with Claude Code, Codex, or Cursor:

**Pain 1: The agent is a black box.** Long tasks die, and you can't tell where — or reconstruct what context the model was seeing.

**Pain 2: The framework is a fixed shell.** Want to change "retry behavior" or "how the loop turns"? You can't. Fork the source or wait for the next release.

**Pain 3: Multi-agent doesn't fit together.** MCP here, ACP there, Hooks somewhere else. No unified orchestration. You build your own wheels.

These aren't DeepSeek's inventions. They're industry-wide. dsh's value is that it has *buildable* mechanism answers to all three.

## Design decision #1: even "how the loop turns" is a plugin

Let me correct my own earlier understanding first: a lot of people (including me, initially) read "everything is a plugin" as "you can add tools and skills." No. dsh's plugin system goes much deeper.

Reading the source, I found this in `packages/core/agent-loop`'s README — the key to understanding dsh:

> "This is the only package in the harness that contains concrete loop logic. Everything else is an abstract service or a plugin against extension points — new behavior goes into plugins, not here."

Translation: **even "how the agent loop turns" is itself just a concrete plugin (agent-loop), not framework core.** Model adapters, tool registry, session log, sandbox, UI, scheduling — all plugins in dsh, mounted on a plugin tree by Cordis.

How is it assembled? Three config layers: `bundle → profile → patch`.

![bundle → profile → patch assembly](./img/04-assembly.png)
*A stack of config, assembled into a running Agent*

- **bundle**: a distribution unit (npm package); each bundle declares which config rows it contributes
- **profile**: a named composition that lists which bundles to stack (`web` and `headless` ship as templates)
- **patch**: your overlay layer, replacing a config row wholesale by id

Want to change "retry after failure"? Don't touch source. Mount a patch that replaces that config entry. Want a different context-compaction strategy? Same thing.

And it's not a hacky "anything can mount." Cordis has a formal theory (spatiotemporal composability). The core guarantee: **when a plugin unloads, its side effects roll back completely, as if it was never installed.** Without that guarantee, plugin systems are toys. With it, deep replacement is real engineering.

`dsh --profile web --dump-config` prints the actual plugin tree your machine boots — every row is replaceable.

## Design decision #2: PTC isn't "saving round trips," it's "redefining the tool surface the model sees"

This is the part I think is most interesting — and the part most write-ups get shallow.

Let me say where my own initial understanding was wrong: I thought PTC (programmatic tool calling) was "let the model write a program instead of making many tool calls." Right direction, but shallow.

Here's the truth from the source:

**In PTC mode (officially called "PTC 模式" — PTC Mode, not "Code Mode"), the tool surface the model sees changes entirely.**

The tool registry stays, but the presentation layer (tool-presentation) switches to `code`:

- The model **sees only** `run_code` plus a generated TypeScript SDK
- The model **can only directly call** `run_code`. If it calls any other tool directly, that call resolves to `UNKNOWN_TOOL` at execution-creation time — before approval and guards, because "nothing should observe or approve a call that can only fail"
- The error message even points the way: "only `run_code` is callable directly — call `<name>` from inside a `run_code` program instead"

Underneath is a design invariant called **announced surface = callable surface**. What the model sees must be exactly what the model can call.

![PTC comparison](./img/06-ptc.png)
*Traditional: 5 round trips. PTC: 1 program*

So what does "5 round trips becomes 1" actually mean? From the `code` preset's config comment:

> "the model writes a TypeScript program against a generated SDK and `run_code` executes it, so a sequence that would be five round trips becomes one."

Three design points that matter:

1. **The SDK is deterministic.** Every visible tool has exact parameter and output types (`ToolArgsMap`/`ToolOutputMap`). The model-written program never "guesses" a tool signature.
2. **Intermediate values stay in the execution environment.** Binding call results, logs, and intermediate computation live only in the worker thread. **Only the program's final logs and return value re-enter model context.** That's how context is saved.
3. **Tool calls inside the program still go through the full pipeline.** Sandbox, approval, timeout, logging — nothing is skipped. It's not "bypassing," it's "compressing round trips."

I tried to run it (more on that below), but even just reading this mechanism was worth it.

## Design decision #3: everything the model sees gets logged

How does dsh solve the black-box problem? Its approach is plain but hard:

**Anything that reaches a model request must be reconstructable from the log.**

![Unified event stream](./img/05-eventstream.png)
*What the model sees = what's logged. Reconstructable, replayable, forkable*

A session is an append-only `SessionEvent` stream — the **single source of truth** for the whole interaction history. The model's message history isn't stored separately; it's *derived* from the log.

What gets logged? System prompts, chain of thought, tool calls and results, sub-agent scheduling, every context injection. The official name for this invariant: **model-visible ⟺ logged**.

Long task died? Open the Trajectory view, see every step by source, and what context the model had at each one. Fork a line and rerun. Replay for postmortem.

Hidden bonus for tinkerers: run the *same task trajectory* against different loop strategies or tool implementations and compare. That was basically impossible before.

One more detail: secrets never enter the log. Credentials go through a separate credentials seam; the log only holds references (environment variable names), never values.

## Four modes = four plugin combinations

dsh's official four modes — the names are easy to get wrong, so I verified them in the source `preset.yml`:

![Four modes](./img/07-modes.png)
*Standard / PTC / Minimal / Creator — four plugin combos*

| Mode | Key | What it is |
|---|---|---|
| **Standard** | standard | Full-featured coding agent: file editing, Shell, file & web search, Skills, planning, goals, subagents, workflows |
| **PTC** | code | Everything in Standard, but tools are presented via a Code Mode SDK (the thing from the last section) |
| **Minimal** | minimal | Exactly two tools: persistent bash + str_replace_editor. Official note: "for model benchmarking in minimal environments" |
| **Creator** | cordis | Everything in Standard, plus runtime inspection, plugin experimentation, and preset-creation guidance |

Two observations:

**Minimal mode's existence shows DeepSeek itself cares about benchmarks.** Yet BENCHMARK.md only explains *how* to run them — no published results. I'll come back to that contrast.

**Creator mode is the most imaginative.** It ships a `tool-cordis` plugin: the agent can inspect its own runtime plugin tree and mount/unmount model-written plugins. In other words: **the harness config itself becomes something the agent can operate on.** "An agent reshaping its own harness" is one step away.

![Three plugs, one socket](./img/08-plug-socket.png)
*MCP / ACP / Hooks — all plug into dsh*

Multi-agent and ecosystem: subagents, forks, and workflows are all plugins; dsh consumes MCP, serves ACP, and bridges Claude Code and Codex Hooks — your existing hook scripts don't get rewritten.

## What's actually new

Talk is cheap. Compare with what exists.

I put dsh against three mainstream targets: Claude Code, Codex CLI, and OpenHands.

![Ecosystem comparison matrix](./img/09-comparison.png)
*Five axes: plugin depth / sandbox / traceability / modes / open-source*

The differences that matter:

- **Plugin depth**: Claude Code has Hooks and MCP, Codex has AGENTS.md, OpenHands has skills. But **none of them make the agent loop itself a replaceable plugin.** dsh is the first.
- **Sandbox**: Claude Code and Codex lean on permission prompts; OpenHands uses Docker. dsh ships native isolation on three platforms (Landlock/bwrap on Linux, Seatbelt on macOS, ACL on Windows), with three permission levels (read-only / workspace-write / danger-full-access). And "partial enforcement is reported honestly" — platforms that can't do it fully say `partial`, no pretending.
- **Traceability**: everyone logs. dsh makes "model-visible = logged" an engine-level invariant, not product-layer design.
- **Open-source**: Claude Code is closed. Codex is open. dsh is MIT — and hit 17.8k+ stars the day it launched.

One line: **on "taking the agent apart," dsh goes further than anyone.**

## Strategy: what is DeepSeek actually doing

Technical depth isn't the whole story. Look at the people.

The dsh team lead is **崔添翼 (@tianyi)**, formerly 9 years at Jane Street in quantitative trading, co-founder of TSY Capital. The media read (36Kr): "DeepSeek is using the rigor of building trading systems to build the agent execution layer."

That background isn't gossip. It explains a lot of dsh's design:

- The obsession with **traceability** (a trading system can never afford to be unable to say which trade went wrong)
- The insistence on **fail-loud, no silent degradation** (missing provider, unknown event type — all loud rejects)
- The harsh **engineering gates** (more on this below)

Timing matters too: dsh launched the same day DeepSeek released **V4-Pro**. A "model + Harness" combo on the same day is a clear signal — **DeepSeek isn't content to sell model APIs. It's competing for the agent execution layer.**

The open question (InfoQ's): will dsh become DeepSeek's own coding product, or the common under-layer of many agent products? Too early to say.

## Cold water

Praise done. A few honest warnings. I don't like hype.

![Cold water](./img/10-cooling.png)
*Stay level-headed*

**"Anything can be swapped" doesn't automatically mean better results.** Value comes from the quality of default plugins, stable composition patterns, credible benchmarks, and third-party ecosystem. Plugins buy you room to differentiate; they don't deliver it.

**No multi-agent paradigm breakthrough.** It's hierarchical Supervisor–Worker — parent decomposes, child executes. New enough, but it's not Swarm (autonomous discovery, negotiation, competition, dynamic takeover). InfoQ's line is fair: "calling it a revolutionary multi-agent architecture oversells it."

**No public benchmarks.** I checked BENCHMARK.md myself. It explains *how* to run benchmarks. It publishes zero results. And it built a Minimal mode specifically for benchmarking, yet publishes no numbers — deliberate or not ready, worth watching.

**Breaking changes are explicit.** It's v0.1. The README literally says *THERE WILL BE COMPATIBILITY-BREAKING CHANGES*. Early adopters, your migration cost won't be trivial.

**Plugins have a price.** Interface stability, dependency management, version compat, performance overhead, debugging complexity. The deeper you carve, the harder these get.

## My first run (the honest version)

I wanted to write "it works, it's great." Honest version: it didn't run.

`npx @deepseek-ai/dsh@0.1.0-rc.6 web` installed fine (100+ packages), but the `dsh` command didn't land in PATH. Calling `bin.js` directly hit `ERR_MODULE_NOT_FOUND` (a js-yaml ESM resolution issue). That's the real rc.6 install experience.

That *is* the preview reality: the README explicitly warns of breaking changes, and this is exactly the kind of thing I hit. No sugarcoating — v0.1's install experience is rough. To get it running you'd build from source (`pnpm install && pnpm run build`), which needs a chunk of dependencies and disk I didn't have on this machine.

This is also why 17.8k stars don't make me drop my guard — **hype is hype, engineering maturity is another thing.**

## Close

One sentence for the whole article: **Agent performance = model + the layer around it, and that layer is usually ignored.**

dsh offers three answers worth stealing:

1. **Even the loop is a plugin** — change retry policy without waiting for upstream
2. **PTC redefines the tool surface the model sees** — announced surface = callable surface; intermediate values never enter context
3. **Model-visible = logged** — when it dies, you stop guessing

It's not mature yet, but the thinking is worth a look — even if all you're doing is finding an agent in your own toolchain that you can *change* and *trace*.

Which of the three pains is your current framework hitting? I'd love to hear.

🥚 Easter egg: while reading the source I found its engineering gates are brutal — per-file 100% line coverage, doc drift blocks CI, cross-file clone detection. Next post can explore where the confidence to keep breaking compatibility at v0.1 comes from. Stay tuned.

— Booker
