---
slug: sbe-methodology
title: "Why does your AI code always need rework? SBE methodology has the answer"
image: https://binggg.github.io/og/en/sbe-methodology.png
date: 2025-08-05
authors: [booker]
tags: [ai, fullstack]
---

After a few months of coding with the Spec workflow, I kept asking myself one question: why does this "write requirements first, design next, then break down tasks" process actually work?

Then I came across Gojko Adzic's *Specification by Example: How Successful Teams Deliver the Right Software*, and it clicked. Behind Kiro's Spec workflow is exactly the SBE (Specification by Example) methodology. This article explains the relationship between the two — and why your AI coding keeps ending up in rework.

{/* truncate */}

---

## Why does your AI code always need rework?

Some familiar scenes:

- You ask AI to build a login feature, it generates a registration page
- You request data export, AI gives you data import
- You want a simple API, AI builds a complex microservice architecture

The problem isn't that AI isn't smart enough — it's that the requirement is too vague. Like telling a foreign friend "I want food": they might hear "I want rice," "I want to go to a restaurant," or "I want takeout."

In AI coding, this ambiguity is amplified. AI can only guess what you want from your description. Guess right, you're done; guess wrong, you rework.

Traditional software engineering ran into the same problem long ago:

1. **Ambiguous requirements**: different people read the same requirement differently
2. **Late rework**: the misunderstanding only surfaces after development
3. **Stale documentation**: requirements docs can't keep up with changes
4. **Communication overhead**: endless back-and-forth clarification slows things down

These problems only get worse in AI coding. When requirements are unclear, AI is fumbling in the dark, relying on luck to generate code that matches your expectation.

## What is SBE

SBE — proposed by Gojko Adzic in *Specification by Example* — is aimed directly at these problems.

### Core principles

**1. Example-driven requirement definition**

Replace abstract descriptions with concrete, real examples:

❌ **Abstract**: The login feature must be secure and reliable
✅ **Example-driven**:
- Given the user enters the correct username and password
- When they click the login button
- Then the system shows the welcome page

**2. Collaborative requirement clarification**

Cross-role teams discuss examples together to avoid "requirement silos." In AI coding, this is the human-AI collaboration process.

**3. From requirements to executable tests**

Turn examples into automated test cases — "requirements as tests." This is the theoretical foundation for generating test cases from requirements in Spec mode.

**4. Living documentation**

Example-driven requirements produce a documentation system that stays in sync as requirements change. In Spec mode, this maps to the continuously iterated requirements.md and design.md.

## Mapping SBE to the Spec workflow

### Requirement clarification → iterating requirements.md

**SBE principle**: clarify requirements with concrete examples so everyone understands the same thing.

**Spec practice**:
```markdown
### Requirement 1 - User login

**User story:** As a user, I want to log in securely so I can access my personal data.

#### Acceptance criteria
1. When the user enters correct credentials, the system shall display the welcome page
2. When the user enters an incorrect password, the system shall show an error message
3. When the user enters wrong credentials 3 times, the system shall lock the account for 30 minutes
```

### Technical design → collaborating on design.md

**SBE principle**: avoid technical pitfalls by focusing on business functionality.

**Spec practice**:
```markdown
## Technical design

### Architecture
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT Token
```

### Test-driven → generating tests from requirements

**SBE principle**: requirements are tests; make sure the implementation matches expectations.

**Spec practice**:
```javascript
// Test cases auto-generated from requirements.md
describe('User login', () => {
  test('successful login with correct password', async () => {
    const response = await login('user@example.com', 'correctPassword');
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Welcome page');
  });

  test('failed login with wrong password', async () => {
    const response = await login('user@example.com', 'wrongPassword');
    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Incorrect password');
  });
});
```

## What I verified in practice

### Requirement iteration and clarification are the heart of the process

The back-and-forth iteration of requirements.md and design.md is worth more than the final documents themselves. Every clarification eliminates a chance for AI to guess wrong. In the CloudBase-AI-ToolKit project I run every new feature through the Spec workflow — the most direct takeaway: half an hour extra at the requirements stage saves several rounds of rework at the implementation stage.

### Generating test cases from requirements makes AI coding verifiable

Every acceptance criterion in requirements.md is an input to a test case:

```markdown
# requirements.md example
When the user uploads a file, the system shall validate file type and size
When validation passes, the system shall return a success response
When validation fails, the system shall return an error message
```

### It works on existing codebases too

Spec mode isn't picky about greenfield projects. Run every new feature through the Spec workflow in legacy code, gradually migrate existing features in, and team conventions take root.

### Granularity

On granularity, here's my experience:

**Split by feature module**
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

**Split by iteration**
```
specs/
├── v1.0-basic-features/
├── v1.1-advanced-features/
└── v1.2-optimization/
```

**Split by complexity**
- **Simple features**: a single spec file
- **Medium features**: a dedicated spec folder
- **Complex features**: multiple related spec folders

## Where it fits

**Good fit**:
- Complex projects spanning multiple modules
- Team collaboration that needs unified standards
- High quality requirements with traceability

**Not a great fit**:
- Quick prototypes to validate an idea
- Personal projects with simple features
- Severely time-constrained projects

## Summary

SBE gives AI coding a theoretical foundation: example-driven requirements, collaborative clarification, test-driven development, living documentation. Mapped into the Spec workflow, these are the requirements.md, design.md, tasks.md pipeline.

AI doesn't replace humans — it lets people focus on decisions and direction while the tedious details go to AI. That's how AI coding stops relying on luck.

This article itself was written with an AI partner using this very workflow. From research to summary, the process was a live demo of the Spec pattern.

Which development mode are you using? Would the Spec workflow work in your project? Leave a comment.
