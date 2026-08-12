---
slug: sbe-methodology
title: "Why does your AI code always need rework? SBE methodology has the answer"
image: https://binggg.github.io/og/en/sbe-methodology.png
date: 2025-08-05
authors: [booker]
tags: [ai, fullstack]
---

My [Kiro Spec Workflow guide](/blog/kiro-spec-workflow) blew up recently, and many people DM'd me: **"Why is the Spec approach so effective? What's the theory behind it?"**

Honestly, I'd been thinking about this too. Then I read Gojko Adzic's *Specification by Example: How Successful Teams Deliver the Right Software*, and it all clicked.

It turns out Kiro's Spec workflow is a perfect implementation of **SBE (Specification by Example)** methodology. **Let me unpack this framework and fix your AI coding rework problem once and for all.**

{/* truncate */}

## Why does your AI code always need rework?

Sound familiar?

- You ask AI to build a login feature, it generates a registration page
- You request data export, AI gives you data import
- You want a simple API, AI builds a complex microservice architecture

**What's the root cause?**

It's not that AI isn't smart enough — it's that our requirements are too vague. It's like talking to a foreign friend: if you say "I want food," they might interpret it as "I want rice," "I want to go to a restaurant," or "I want to order delivery."

With AI coding, this ambiguity is amplified. AI can only guess what you want based on your description. When it guesses right, great. When it guesses wrong, you rework.

### The traditional requirements dilemma

Classic software engineering identified these problems long ago:

1. **Ambiguous requirements**: same spec, different interpretations
2. **Late rework**: discover misunderstandings after development
3. **Stale documentation**: specs can't keep up with changes
4. **Communication overhead**: endless requirement clarification

These problems are magnified in AI coding. When requirements are fuzzy, AI is fumbling in the dark, relying on "luck" to generate the right code.

## Traditional software engineering had the answer all along

Gojko Adzic's *Specification by Example* — SBE methodology — was built specifically to solve these problems.

### SBE core principles

#### 1. Example-driven requirements

Replace abstract descriptions with **concrete, real examples**:

❌ **Abstract**: The login feature must be secure and reliable
✅ **Example-driven**:
- Given the user enters the correct username and password
- When they click the login button
- Then the system shows the welcome page

#### 2. Collaborative requirement clarification

Emphasize **cross-role collaboration** by discussing examples together, avoiding "requirement silos." In AI coding, this is the human-AI collaboration process.

#### 3. From requirements to executable tests

Turn examples into **automated test cases** — "requirements as tests." This is the theoretical foundation of Spec mode's test generation from requirements.

#### 4. Living documentation

Example-driven requirements produce a **dynamically updated documentation system** that stays in sync as requirements change. This is exactly the continuously updated `requirements.md` and `design.md` in Spec mode.

## SBE meets Spec: a perfect mapping

### Requirement clarification → requirements.md iteration

**SBE principle**: Use concrete examples to clarify requirements, ensuring shared understanding.

**Spec practice**:
```markdown
### Requirement 1 - User Login

**User Story:** As a user, I want to log in securely so I can access my personal data.

#### Acceptance Criteria
1. When the user enters correct credentials, the system shall display the welcome page
2. When the user enters an incorrect password, the system shall show an error message
3. When the user enters wrong credentials 3 times, the system shall lock the account for 30 minutes
```

### Technical design → design.md collaboration

**SBE principle**: Avoid technical pitfalls by focusing on business functionality.

**Spec practice**:
```markdown
## Technical Design

### Architecture
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT Token
```

### Test-driven → requirements-based test generation

**SBE principle**: Requirements are tests. Ensure implementation meets expectations.

**Spec practice**:
```javascript
// Auto-generated test cases from requirements.md
describe('User Login', () => {
  test('successful login with correct password', async () => {
    const response = await login('user@example.com', 'correctPassword');
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Welcome page');
  });
});
```

## Hands-on: SBE in AI coding

### What I learned from practice

After applying this across multiple projects, I found SBE methodology genuinely effective in AI coding:

#### 1. Requirement iteration is the most important thing

**Key finding**: Continuously iterating and clarifying `requirements.md` and `design.md` is the heart of the process.

**Real case**:
- In the `CloudBase-AI-ToolKit` project, every new feature uses the Spec approach
- After iterative refinement of requirements.md, requirement clarity improved by 80%
- Rework rate dropped from 60% to 15%

#### 2. Generate test cases from requirements

**Key finding**: Test cases generated from requirements.md make AI coding verifiable.

#### 3. Apply to existing projects too

**Key finding**: Spec mode isn't just for greenfield projects — it works just as well on existing codebases.

### Granularity best practices

On the question of how to split: here's my experience:

#### Split by feature module
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

#### Split by iteration
```
specs/
├── v1.0-basic-features/
├── v1.1-advanced-features/
└── v1.2-optimization/
```

#### Split by complexity
- **Simple features**: single spec file
- **Medium features**: dedicated spec folder
- **Complex features**: multiple related spec folders

## How good is SBE methodology, really?

At this point you might ask: **"Is this methodology really that effective? Isn't it too complex?"**

Honestly, I had the same concern at first. But practice proved SBE methodology delivers:

### Why is SBE so effective?

1. **Clear requirements**: concrete examples beat abstract descriptions every time
2. **Less rework**: clear specs produce higher quality code
3. **Better collaboration**: shared understanding reduces communication overhead
4. **Living docs**: stays fresh as requirements evolve

### When to use it

**Good fit**:
- ✅ Complex, multi-module projects
- ✅ Team collaboration needing unified standards
- ✅ High quality requirements with traceability

**Less suitable**:
- ❌ Quick prototypes to validate ideas
- ❌ Personal projects with simple features
- ❌ Extremely time-constrained projects

## Summary: From "hope it works" to "engineered certainty"

SBE methodology provides a battle-tested theoretical foundation and practical framework for AI coding. Through example-driven requirements, collaborative clarification, test-driven development, and living documentation, we can make AI coding more controllable, efficient, and reliable.

Remember: **AI doesn't replace humans — it frees humans to focus on decisions and direction, leaving the tedious details to AI.**

That way, your AI coding stops being a "hope it works" gamble and becomes true **engineered certainty**.

---

**Let's talk**:
1. What development approach are you using?
2. Do you think Spec mode would work for your projects?
3. Share your AI coding experiences below!
