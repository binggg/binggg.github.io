---
slug: concept-handle
title: "Concept Handles: Giving Complex Ideas an API"
description: "Why do some professional terms describe a feeling you couldn't put into words? A look at concept handles — what they are, why they work, and where they stop being useful."
tags: [ai, prompt-engineering]
authors: booker
date: 2026-10-21
image: https://binggg.github.io/og/en/concept-handle.png
lang: en
---

> Those bolded words felt like a handle snapping onto a blurry intuition.

I asked a model how to make technical docs friendlier to AI.

It came back with a diagnosis that bolded these terms: **Simplified Technical English**, **Action-Oriented Writing**, **Progressive Disclosure**, **Scannability**, **Call to Action**.

My reaction, verbatim: I like these bolded bits. They're precise and concise, and they hand me names I didn't have. I actually learned something. So that's what the professional expression is. It said what I couldn't say.

{/* truncate */}

![How much work one good name does](./img/01-what-a-name-does.png)
*"Prisoner's dilemma" replaces a whole paragraph*

You don't need several hundred words to explain "revealing information to the reader in layers as they need it." Say "Progressive Disclosure" and the other person has it immediately.

This kind of word has a name of its own: a **concept handle**.

## Giving concepts an API

Scott Alexander coined the term in a 2016-02-20 post called *Writing Advice*.

His definition: a memorable noun phrase representing a complex, often abstract topic. His examples: "prisoner's dilemma," "Overton window," "belief in belief."

Then he explained why it matters:

> "Successful concept handles can really amplify a vague idea which many people sort of understand but can't point to and talk about. If you give that vague notion a crisp, catchy name, you can unlock a lot of conversation and reflection."

Plenty of people half-understand an idea but can't point at it or discuss it. Give it a crisp, memorable name and the conversation opens up.

He also supplied a very apt metaphor:

> "One way to think about concept handles is as 'APIs for concepts.'"

In software, an API hides a complicated implementation behind a clean call. A concept handle does the same thing: it packs a whole body of background knowledge and reasoning into one noun, so people can call it in conversation instead of recompiling the logic every time.

Andy Matuschak picked it up in his public notes, *Evergreen note titles are like APIs*, and added a neat twist:

> "The 'concept handle' is a concept handle for itself, coined by Scott Alexander."

The phrase "concept handle" is itself a concept handle — a name Scott Alexander coined for "memorable noun phrases that stand in for complex ideas."

## Fake handles and dead words

Not every word that sounds professional is a working concept handle.

Two show up constantly in corporate Chinese: 口径 and 闭环.

"Let's align on 口径" sounds precise. It means "let's align on how we phrase it."

"This needs to form a 闭环" sounds like a complete thought. Ask a follow-up question and it usually refers to the same thing it did before.

Neither packs any real complexity, and neither makes a fuzzy idea more precise. They wrap a simple meaning in an official-looking skin and make it slightly harder to see.

![Professional-sounding words that save nothing](./img/02-fake-names.png)
*A different word isn't a shorter explanation*

Then there's the invented kind. Fun to coin. Useful to exactly one person.

If a word doesn't map to the same understanding in someone else's head, or doesn't hide any complexity worth hiding, it isn't an API. It's noise.

## A stumble while checking the source

While writing this, I searched for where concept handle came from and found a secondhand summary attributing it to "Christopher Alexander." I almost believed it.

The original says Scott Alexander.

Christopher Alexander wrote *A Pattern Language*. Scott Alexander wrote Slate Star Codex. Two different people.

Same-name mix-ups like this happen constantly when you rely on secondhand sources or a vague memory. Skip the primary source once, and the error keeps propagating.

## Specific versus vague in a prompt

While working on this, I gave the same prompt to two models to see how they'd differ.

With no constraints at all, a model can fill 500 words without ever stating the answer. What did it fill with? Vague stand-ins like "an extremely low-level oversight" and "what this pit actually looks like." It also spoiled the piece up front: "today I'll walk you through..."

Add a few constraints and it produces the actual answer: don't preview the piece, don't elevate at the end, state the key fact instead of gesturing at it, and end on the event.

One footnote: idioms and metaphors don't need banning. Cut them and the sentences get clean, but they read like they were translated from English.

So, a question for you: what's the most useful concept handle you've run into at work?
