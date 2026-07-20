---
title: "AI coding without luck: the complete guide to replicating Kiro's Spec workflow"
description: A complete guide to porting Kiro's Spec workflow to any AI IDE — write requirements with EARS syntax, design technical solutions, split tasks, and move from vibe coding to engineered AI development.
tags: [ai, fullstack, open-source]
authors: booker
date: 2025-07-21
---

Last year I had a project — an AI-generated data analysis dashboard. First version looked fine: charts, filters, exports, all there. Then I asked it to add one filter condition. The chart stopped updating. Asked AI to fix the chart — the filters disappeared. Five rounds later, the codebase had tripled in size and less of it worked than when I started.

The problem wasn't that AI couldn't write code. It was that I couldn't say what I wanted clearly enough.

Kiro's Spec workflow fixes exactly that. Here's how it works and how to replicate it in any AI tool.

{/* truncate */}

---

## Two pain points of vibe coding

**First, you can't describe it, AI has to guess.** You say "add a filter." Does AI know it's frontend or backend? Single or multi-select? Should it cascade other charts? No. It picks the most common guess — probably not what you meant.

**Second, fix one thing, break three others.** AI has no concept of "global impact analysis." Tell it to swap a component library, it only changes the file you pointed at. Every other file depending on the old library breaks. And you have no idea which files those are.

Both problems share the same root — **there's no translation layer between an idea and code.** Traditional software engineering handles this with requirements docs and technical design docs. The Spec workflow adds those two layers back into AI coding.

---

## The core: three files

Kiro packaged the Spec workflow into a repeatable pattern. Three files:

```
project/
├── requirements.md    # EARS syntax for requirements
├── design.md          # architecture, tech choices, flows
└── tasks.md           # trackable todo list
```

### What is EARS syntax?

EARS (Easy Approach to Requirements Syntax) was originally used for jet engine control systems — a domain with much higher precision requirements than software. It constrains requirements into a few fixed sentence patterns:

| Pattern | When to use | Example |
|---|---|---|
| **When** `<trigger>` **the system shall** `<action>` | User action | When user clicks "mute", the system shall suppress all audio output |
| **Where** `<state>` **the system shall** `<action>` | System state | Where network is unavailable, the system shall cache operations and sync on recovery |
| **As** `<condition>` **the system shall** `<action>` | Continuous condition | As user types a search query, the system shall trigger autocomplete every 500ms |
| **Then** `<result>` | System response | Then the system shall display "operation successful" |

With these patterns, AI has zero ambiguity about what you want.

Reference: [EARS syntax guide](https://alistairmavin.com/ears/)

---

## Replicating Spec workflow in Claude Code

Even without Kiro, this workflow works in Claude Code. The key is CLAUDE.md — it's the AI's "job description."

### Step 1: Write CLAUDE.md

```markdown
# CLAUDE.md

You are a professional AI programming assistant. Follow the Spec workflow strictly:

1. Clarify requirements, output requirements.md using EARS syntax.
2. Design technical solution, output design.md (architecture, tech choices, interfaces, test strategy).
3. Break down tasks, output tasks.md as actionable todo list.
4. Implement step by step per tasks.md, save artifacts to output/.
5. Confirm with me before each step transition.
```

### Step 2: Example conversation

**You**: I want to build a "meeting notes auto-generator." Can you help plan it?

**Claude** (after reading CLAUDE.md):
Sure. Let me clarify requirements first using EARS syntax:

```
# requirements.md

## User Story
As someone who attends frequent meetings, I want to upload meeting recordings
and get structured notes in Markdown or Word format.

## Acceptance Criteria
1. When user uploads an audio file, the system shall support mp3, wav, m4a.
2. When upload completes, the system shall transcribe and extract key points.
3. When user clicks export, the system shall support Markdown and Word.
```

Please confirm. Once confirmed I'll proceed to design.md.

**You**: Confirmed.

**Claude**: Here's design.md—

```
# design.md

## Architecture
- Frontend: file upload + progress + export button
- Backend: ASR → LLM extraction → document conversion
- Storage: temporary, auto-deleted after processing

## Tech Stack
- Frontend: React
- Backend: Node.js + LLM API
- ASR: Whisper API
- Export: jsdocx / markdown-it

## Flow
Upload → Transcribe → Extract → Display → Export
```

You only step in at "confirm" points. AI handles everything else. Much better than vibe coding's "tweak → test → break → retweak" loop.

---

## Before vs after

After a few tries, the most visible change was **fewer redo rounds**. Before Spec workflow, a feature averaged 2-3 rounds of back-and-forth before AI got it right. With Spec, the requirements capture everything upfront — AI references requirements.md when writing code, so one round usually suffices.

| | Vibe coding | Spec workflow |
|---|---|---|
| Requirements | One-liner | EARS syntax, acceptance criteria |
| Implementation | AI guesses → you fix → AI reguesses | Review requirements first, then code |
| Redo rate | High (2-3 rounds) | Low (usually 1 round) |
| Traceability | ❌ What changed? | ✅ Every decision recorded |

The tradeoff: writing requirements.md takes time, and you need to know what you want. Spec doesn't help with "I don't know what to build." It helps with "I know what to build, don't let AI misunderstand it."

---

## Gotchas I hit

**Don't over-specify requirements.md.** I initially wrote every detailed acceptance criterion. That actually constrained the design phase. The sweet spot is defining input/output boundaries clearly, leaving implementation details to design.md.

**Claude Code occasionally skips the confirmation step.** If the instruction isn't explicit enough, it might go from requirements straight to coding. Solution: bold "confirm before each step" at the top of CLAUDE.md.

**Not every project needs this.** Prototyping, one-off scripts, personal tools — not worth three files. Spec workflow pays off most with multi-person projects or long-term maintenance.

---

The Spec workflow doesn't solve "AI can't write correct code." It solves "AI doesn't know what you're asking." The former depends on model iteration. The latter depends on process — and that's something you can fix right now.
