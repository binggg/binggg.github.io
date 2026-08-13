---
slug: agent-skills-practice
title: "AI Programming's Second Half: Don't Let AI Code Live Only on Localhost"
image: https://binggg.github.io/og/en/agent-skills-practice.png
description: You gave your AI agent Skills but it ignores them. After months of wrestling, the hardest problem isn't AI writing bad code — it's AI writing code that only works locally. Here's how we pushed skill activation from 20% to 84%.
date: 2026-01-22
authors: [booker]
tags: [ai, agent, skills, prompt-engineering, claude-code]
---

I've been working with Agent Skills for a while now. The most frustrating discovery: it's not that AI can't write code. It's that the code it writes **only works on localhost**, and it **keeps ignoring the rules you set**.

This article covers two things:

1. **Making AI-generated code actually deployable** — AI writes demo-quality code, full of security holes. The root cause: AI doesn't understand production environments.
2. **Fixing "AI has Skills but won't use them"** — activation rates can be as low as 20%. Here's how we pushed that to 84%.

{/* truncate */}

---

## Vibe Coding's "Localhost Comfort Zone"

Everyone's enjoying Vibe Coding. AI whips up a beautiful UI on localhost in minutes. But the magic dies the moment you try to deploy.

AI's code logic is reasonable, but it can't sense the real production environment. The result: code that looks right but can't survive outside your laptop.

**The longest distance in software is from localhost to production.** AI fills the code gap, but not the infrastructure gap.

## What Are Agent Skills?

Skills were introduced by Anthropic in October 2025 for Claude Code. They're a packaging format for instructions, scripts, and resources — **domain expertise bundled as skill packs.**

```directory
my-skill/
├── SKILL.md          # Core: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: reference docs
└── assets/           # Optional: templates, resources
```

Think of AI as a brilliant intern. Skills are the **standard operating procedure manual**. They don't change the AI's intelligence, but they inject procedural knowledge — how things are actually done in your specific environment.

Agent Skills became an open standard in December 2025. Claude, Cursor, VS Code, GitHub Copilot, and OpenCode all support it.

### Progressive Loading

Skills use **progressive disclosure** for context efficiency:

1. **Discovery**: Agent loads only name + description of each Skill
2. **Activation**: When a task matches, the full SKILL.md is loaded
3. **Execution**: Agent follows instructions, loading scripts on demand

Teams are already pushing this forward. Vercel released `react-best-practices` Skills to fix AI's React code quality. Remotion shipped video production Skills. All solving the same problem: **give AI domain-specific engineering intuition.**

---

## The Hard Truth: Why AI Ignores Skills

You configured Skills. AI ignores them. This was the most frustrating part, and it comes down to two deep architectural issues:

**Attention Dilution**: In the Transformer architecture, every token competes for attention weight. The deeper your conversation goes, the more weight your business requirements get — and the Skill instructions in the background get drowned out.

**Inference Laziness**: Calling a Skill is a tool-use operation. The model does a cost-benefit analysis: if it thinks its training data can produce "reasonably correct" code, it will skip the external tool to save inference resources.

**The result**: Without intervention, AI's active Skill invocation rate hovers around **20%**. It would rather "blindly guess" than read the manual.

---

## 3 Solutions That Actually Work

### 1. First-Line Injection (Crude but Effective)

Start every prompt with this mantra:

> **You MUST read the guideline skill FIRST when working with this project.**

**Principle**: Primacy effect. The model naturally pays more attention to the beginning of the input sequence. This forced injection reliably raises activation rates.

### 2. Project-Level Rules (CLAUDE.md)

Create `CLAUDE.md` or `AGENT.md` with binding rules:

```markdown
# Project Workflow

0. You MUST read the guideline skill FIRST when working with this project.
1. Evaluate: Before writing code, list available Skills.
2. Commit: State which Skill you need and why.
3. Execute: Never skip rules to write code directly.
```

This saves you from adding the mantra every time. But it's not bulletproof — as conversation context grows, AI may still ignore the rules.

### 3. Forced Eval Hook (The Heavy Lifter)

If the first two are "asking nicely," this is **physical enforcement**.

Scott Spence discovered the most effective method: use your editor's hook mechanism. Configure `.claude/settings.json` to intercept every query and force the AI to write an evaluation report before any code:

- What Skills are available?
- Does this task need them? Why?

Here's the trick: once the AI has committed in writing to using a tool, it follows through. The hook eliminates the "I'll just wing it" shortcut.

**Result**: Skill activation jumps from **20% to 84%**.

---

## Architecture Lesson: 1 Guideline + N Independent Skills

The biggest problem I encountered: **AI can't distinguish environments.** It confuses Web, Mini Program, and Node.js APIs.

The fix: instead of one monolithic "super skill," use **1 guideline + N environment-specific skills**.

### Solving Semantic Contamination

Web, Mini Program, and Node.js SDKs have nearly identical method names. Put everything in one Skill, and AI will use the wrong syntax for the wrong platform.

Solution: split by platform. A guideline Skill routes AI to the right sub-skill based on project detection. **Search space shrinks by 90%, reasoning accuracy jumps.**

### Enabling Targeted Intervention

A massive skill pack dilutes attention. When you need AI to focus on one specific problem (e.g., "handle authentication"), the full manual becomes noise.

Independent plugins mean you can say: "Check the auth skill for phone number login." This is a direct intervention path — when AI is confused, pull up the right sub-skill and snap it back on track.

---

## Closing Thoughts

After months of wrestling with Skills, my biggest takeaway: **AI programming productivity isn't about how brilliant the generated code is — it's about how much engineering constraint you can apply.**

**The core: turn tacit knowledge into procedural knowledge.** Today's agents are brilliant interns with zero respect for production reality. Skills give them engineered muscle memory — years of hard-won experience encoded as precondition checks.

**The shift: agents need environment awareness.** The next frontier isn't better reasoning — it's infrastructure perception. Skills guard the floor, platforms enable the ceiling.

**Determinism is the only metric that matters.** Don't expect AI to become "perfect" automatically. Use engineering to make it "predictable." AI provides the logical ceiling. Engineering constraints guard the delivery floor.

If you're working with Skills, the most valuable thing you can do: **measure whether your AI is actually using them.** A 20% baseline is not shameful — but not knowing that number is.
