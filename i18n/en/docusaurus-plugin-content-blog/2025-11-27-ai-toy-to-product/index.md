---
slug: ai-toy-to-product
title: "AI coding: how do you go from toy to product?"
date: 2025-11-27
authors: [booker]
tags: [ai, fullstack]
---

I've been helping friends review their AI-built projects recently, and I noticed something interesting:

The code runs. The features are there. But somehow... it's not usable.

Not a technical issue. Something else.

{/* truncate */}

## A typical scenario

A friend excitedly sends me a link: "Look what I built with AI — three hours!"

I open it:
- There's a page: rounded cards, gradient buttons, purple color scheme — that unmistakable AI look
- The login button does nothing
- The data is all hardcoded placeholder values
- Only runs on his machine

I ask: "How do users access this?"

He pauses: "...I hadn't thought that far."

This isn't an isolated case. Most AI-built projects I've seen hit the same wall: **the gap between demo and product.**

---

## The five pitfalls of vibe coding

Looking closely at these projects, the problems boil down to five:

### 1. Requirements are a mystery

"Build me a task management app" — that's what most people tell AI.

The problem: AI doesn't know:
- Should tasks have priorities?
- Multi-user or single-user?
- Local storage or cloud?
- Should it have notifications?

AI can only guess. If it guesses right, lucky. If wrong, you rework.

**Root cause**: no Spec mindset. Fuzzy requirements, and even the smartest AI can't fix that.

### 2. UI looks fake

Why does AI-generated UI always have that unmistakable "AI look"?

- Too many rounded corners, too large
- Gradients everywhere
- Purple + blue color scheme on repeat
- Cookie-cutter layouts

It's not that AI can't design — you didn't tell it what good design looks like.

**Root cause**: no design specs. AI is just imitating the "average" it's seen.

### 3. The backend is empty

However pretty the frontend page, clicking the login button does nothing.

Because:
- No user system
- No database
- No API endpoints
- No server

Many people think AI coding means making frontend pages. But for a usable product, backend is the bigger part.

**Root cause**: don't understand architecture choices. Don't know what tech stack to use, so just skip it.

### 4. Deployment is a black art

Code is written. Now what?

- How to buy a domain?
- How to set up HTTPS?
- Which server to choose?
- How to deploy the database?

For someone without ops experience, every single one of these is a roadblock.

**Root cause**: don't understand deployment. Running code locally and shipping a product are two different things.

### 5. One line change breaks everything

You finally got it running. Want to add a small feature.

Change one line. Everything breaks.

AI-generated code is often "disposable" — it runs, but can't be modified. Because:
- No modularity
- No type checking
- No tests
- Hardcoded values everywhere

**Root cause**: no engineering mindset. Code is written for machines to execute, not for humans to maintain.

---

## How to break through?

With the problems analyzed, the path forward is clear. Here are five concrete methods:

### Method 1: Spec first, code second

I wrote about the Kiro Spec workflow before. The core idea:

> **Vibe coding's biggest problem: it turns development into "gambling" instead of "controlled engineering."**

The solution: before asking AI to write code, have it clarify requirements. Specifically, generate three files:

1. **requirements.md** — spec document (user stories + acceptance criteria using EARS syntax)
2. **design.md** — technical design (architecture, flow, caveats)
3. **tasks.md** — task list (for tracking)

This mirrors big tech's development process and agile breakdown — but Kiro integrates it deeply with AI IDEs, making it dramatically more practical.

**What is EARS requirements syntax?**

EARS (Easy Approach to Requirements Syntax) was originally used for jet engine control systems before being widely adopted in software engineering. It uses simple sentence patterns to constrain requirements and eliminate ambiguity:

| Type | Pattern | Example |
|---|---|---|
| Ubiquitous | The system shall... | The system shall support user login |
| Event-driven | When [trigger], the system shall... | When the user clicks login, the system shall validate credentials |
| State-driven | While [state], the system shall... | While the user is logged in, the system shall show the avatar |
| Optional | Where [feature], the system shall... | Where 2FA is enabled, the system shall send a verification code |
| Complex | If [condition], then the system shall... | If password errors exceed 3, the system shall lock the account |

Clear requirements = precise AI output.

**How to use this with other AI IDEs?**

Even without Kiro, you can replicate this workflow:
- Claude Code: create `CLAUDE.md` with Spec workflow rules
- Cursor: use `.cursor/rules/project.mdc`
- Augment: use `.augment-guidelines`

With this flow, AI stops being a "black box" that generates code, and becomes a partner — **confirming at each step, progressing together.**

### Method 2: Use Skills to constrain AI's design output

Don't let AI go wild. Give it a design system.

Introducing: **Skills**.

A Skill is a reusable prompt template that encapsulates domain-specific knowledge. For example, Anthropic's open-source `frontend-design` Skill specifically addresses the "AI look" problem:

With this Skill, AI-generated UI stops looking like "AI UI."

### Method 3: Choose BaaS, don't build from scratch

Backend is the biggest blocker for most people. But you don't need to build it yourself.

**What is BaaS?**

BaaS (Backend as a Service) wraps backend capabilities into APIs. Developers just call the SDK:

| Feature | Traditional way | BaaS way |
|---|---|---|
| Database | Install MySQL, configure, write SQL | Call `db.collection('users').add()` |
| Auth | Write register/login/permission logic | Call `auth.signIn()` |
| File storage | Set up OSS, configure permissions | Call `storage.upload()` |
| APIs | Write Express/Nest.js routes | Cloud functions auto-generate HTTP endpoints |

This is 10x simpler than building from scratch with Express/Nest.js.

**Popular BaaS platforms**:
- International: Supabase, Firebase
- China: CloudBase (Tencent Cloud)

The core BaaS philosophy: **batteries included**. When you create a project, database, auth, and storage are ready to go. No infrastructure to manage.

### Method 4: Use platform hosting, skip the server

Deployment doesn't need manual effort either.

Many platforms handle it for you:

| Platform type | Examples | Features |
|---|---|---|
| Static hosting | Vercel, Netlify, Cloudflare Pages | One-click frontend deploy, auto HTTPS |
| Serverless | AWS Lambda, Cloudflare Workers | Functions as a service, pay per call |
| Full-stack BaaS | CloudBase, Supabase, Firebase | Frontend + backend + database in one |
| Container | Railway, Render, Fly.io | Any language, more flexible |

If you're using a BaaS platform (like CloudBase), deployment is even simpler — static hosting for frontend, cloud functions for backend, and database, all in one platform. No need for multiple accounts.

Push your code. The platform handles the rest.

### Method 5: Engineering mindset

When asking AI to generate code, require:

| Requirement | Practice |
|---|---|
| Modular | One file, one responsibility |
| Typed | TypeScript — types are documentation |
| Testable | Unit tests for critical logic |
| Configurable | Environment variables, config files — no hardcoding |

This produces code you can actually maintain and iterate on.

---

## My practice

After all this theory, how do I actually do it?

After some experimentation, I've settled on a system that combines all five methods:

**1. Spec workflow** — Every new project starts with AI generating `requirements.md` → `design.md` → `tasks.md`. Clear requirements make everything downstream smoother.

**2. Skill system** — A curated set of design specs packaged as Skills. Call them whenever generating UI — no more AI look.

**3. BaaS architecture** — Backend on a cloud platform, no servers touched. Database, cloud functions, auth, file storage — all ready out of the box.

**4. MCP protocol** — MCP lets AI call cloud services directly. Creating databases, deploying functions, configuring domains — no manual operations needed.

This system is packaged as **CloudBase AI Toolkit**, open source on GitHub.

---

## Final thoughts

Vibe coding works — but only for demos.

Going from demo to product doesn't require a stronger AI. It requires **engineering thinking**:
- Clear requirements (Spec workflow)
- Design standards (Skill system)
- Sound architecture (BaaS)
- Intelligent development (MCP)
- Maintainable code (engineering)

AI is a tool. But tools need the right technique.

Just like owning a power drill doesn't make you a carpenter. The key is knowing how and where to use it.

> **Remember: AI doesn't replace humans. It makes humans more capable.**

---

*Have your own AI coding experiences? I'd love to hear about them.*
