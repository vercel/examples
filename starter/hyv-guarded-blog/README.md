---
name: AI Voice Gate Blog Starter
slug: hyv-guarded-blog
description: A Next.js blog that fails its own build if posts sound like ChatGPT wrote them. Runs 100% locally, zero API calls.
framework: Next.js
useCase: Blog
css: Tailwind
publisher: Hold Your Voice
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/shashank-sn/hold-your-voice
demoUrl: https://hold-your-voice-vercel.vercel.app
relatedTemplates:
  - blog-starter-kit
---

# a next.js blog that fails its own build if it sounds like chatgpt wrote it

```
hyv scan _posts/ai-slop-example.md

  ● line 16: ai.holistic — describe the actual approach
  ● line 16: ai.fast-paced — cut this — every industry says this
  ● line 16: ai.cut[t]?ing-edge — name the specific technology
  ● line 20: ai.paradigm — describe the actual shift
  ○ line 20: formula.firstly — just start — "firstly" is filler
  ○ line 24: ai.foster — use: build, grow, encourage, support
  ● line 32: ai.delve — use a specific verb: dig, explore, look at
  ● line 36: ai.ever-evolving — cut this — it says nothing
  ● line 36: formula.in-conclusion — just end. readers know it's the end.

  34 issues (14 red, 20 yellow)
  score: 0/100

  exit code 2 -- build refused
```

prebuild runs `hyv scan` on every post with `--fail-on-hit`. exits 2 on any hit. vercel refuses the deploy.

## Demo

https://hold-your-voice-vercel.vercel.app

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shashank-sn/hold-your-voice)

## How to use

```bash
npx create-next-app --example https://github.com/shashank-sn/hold-your-voice hyv-guarded-blog
```

install it once: `npm i -g @holdyourvoice/hyv@latest`. runs 100% locally. zero api calls. free forever.

$1 first month → [holdyourvoice.com](https://holdyourvoice.com)
