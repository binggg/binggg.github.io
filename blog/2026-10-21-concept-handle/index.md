---
slug: concept-handle
title: 概念把手：给复杂思想装上 API
description: 为什么有些专业词汇能精准说出你表达不出的感觉？从 concept handle 的定义、本质到使用边界，聊聊概念命名的力量。
tags: [ai, prompt-engineering]
authors: booker
date: 2026-10-21
image: /og/concept-handle.png
---

> 那些加粗的词，像是在一片模糊的直觉上忽然扣上了一个手柄。

我问一个模型：怎么把技术文档写得对 AI 友好一点。

它回了一段诊断，里面加粗了这些词：**Simplified Technical English**（受控英语）、**Action-Oriented Writing**（动作导向写作）、**Progressive Disclosure**（渐进式展开）、**Scannability**（可扫读性）、**Call to Action**（行动号召）。

我当时的原话是：我还蛮喜欢 gemini 回答一些提问的时候中这些加粗的信息的，非常精炼和准确，而且可能给我一些新的知识和名词，感觉有学习到哦，原来专业表达是这样的，说出来了我说不出的感觉，似乎文科方面他非常强。

{/* truncate */}

![一个好名字能替你说多少话](./img/01-what-a-name-does.png)
*「囚徒困境」这五个字，替掉了一整段解释*

你不需要用几百个字去解释“如何分层级逐步向读者暴露信息”，只要说出“Progressive Disclosure”，对方就能立刻抓牢这个概念。

这些词在学术和传播上有一个专门的名字，叫 **concept handle**（概念把手）。

## 给概念装上 API

Scott Alexander 在 2016-02-20 的《Writing Advice》里造了 concept handle 这个词。

他给的定义是：一个易记的名词短语，代表一个复杂且往往抽象的话题。他自己举的例子是“囚徒困境”“欧顿之窗”“对信念的信念”。

接着他讲了为什么这东西重要：

> "Successful concept handles can really amplify a vague idea which many people sort of understand but can't point to and talk about. If you give that vague notion a crisp, catchy name, you can unlock a lot of conversation and reflection."

很多人隐约理解某个想法，却指不出来、也讨论不了。给它一个清晰、上口的名字，对话和反思一下就被打开了。

他给出一个非常贴切的比喻：

> "One way to think about concept handles is as 'APIs for concepts.'"

在软件工程里，API 隐藏了底层的复杂实现，只暴露一个清晰的调用接口。概念把手做着同样的事：它把一整套背景知识、逻辑框架封装在一个名词里，让人在交流时可以直接调用，而不需要每次都重新编译整段逻辑。

Andy Matuschak 在公开笔记《Evergreen note titles are like APIs》里引用并引申了这一观点，还补了一句很妙的：

> "The 'concept handle' is a concept handle for itself, coined by Scott Alexander."

“概念把手”这个词本身，就是 Scott Alexander 为“用来指代复杂概念的名词短语”所造的一个概念把手。

## 伪把手与坏词

不是所有看起来像专业词汇的东西，都能成为好用的概念把手。

公司内部开会经常出现两个词：“口径”和“闭环”。

“我们对一下口径”，听起来很专业，实际意思是“我们对一下说法”。

“这个事要形成闭环”，听起来像说完整了，追问下去指的往往还是原来那件事。

这些词并没有封装任何实质性的复杂逻辑，也没有把模糊的想法变得精确。它们只是用一层看似正规的皮外衣，把简单的意思包裹得晦涩了一点。

![听着专业，其实一句解释都没省](./img/02-fake-names.png)
*换个说法，不等于省了话*

还有一类是自己造的词。造的时候很爽，用的时候就只有一个人懂。

如果一个词不能在他人脑海中精准映射到同一种认知，或者根本没有隐藏任何有价值的复杂度，那它就不是 API，只是混淆视听的噪音。

## 搜资料时踩到的坑

写这篇时我搜 concept handle 的出处，搜到一篇二手总结写着 "from Christopher Alexander"，差点信了。

原文是 coined by Scott Alexander。

Christopher Alexander 是《建筑模式语言》的作者，Scott Alexander 是写 Slate Star Codex 的博主，两个人。

看二手资料或者依赖记不清的印象时，这种同名人的混淆极其容易发生。一旦没有回去核对一手出处，错误就会顺着文字继续传播下去。

## 提示词里的具体与模糊

写这篇的过程中，我拿同一道题让两个模型各写过一遍，看差异。

不加任何要求时，模型能把 500 字写满，却不给出关键答案，用的填充物是“一个极其低级的小疏忽”“这个坑究竟长什么样”这种模糊指代，还会在开头预告全文（“今天这篇文章，我就带大家复盘……”）。

加上这几条要求，它才给出具体答案：别预告全文、别在结尾升华、关键的东西必须说出来不许含糊带过、结尾停在事上。

顺带一句：成语和比喻不用禁。砍了它们句子会变干净，但读着像从英文翻过来的。

最后想问你一句：你在日常工作或交流中，印象最深的一个“概念把手”是什么？
