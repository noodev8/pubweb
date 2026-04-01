# Claude Code Guidelines

## Working Style

- Andreas is a builder, not a salesperson. Frame growth/sales work as engineering problems — "building a system that produces customers" — not as selling.
- Don't suggest building platform/product before getting customers. "Get me the customers and I will build it." Each new customer site IS a project that naturally drives platform improvements.
- Bias towards customer acquisition over speculative product work. Speed improvements come from repetition, not from pre-building features nobody's using yet.
- Keep things process-driven and mechanical, not relationship-based or soft-touch.

## Project Context

- **Product:** Online Front Door (onlinefrontdoor.co.uk) — managed online presence for local businesses
- **Parent company:** Noodev8 (noodev8.com)
- **Pricing:** £55/month or £600/year (annual discount)
- **Status:** 1 paying customer (The Nags Head), building the next few to prove the model
- **Start here:** `docs/STATUS.md` — current pipeline, next actions, quick wins
- **Sales process:** `docs/SALES_PROCESS.md` — FIND → BUILD → DELIVER → CHECK → ENGAGE → IMPROVE → CONVERT
- **Business plan:** `docs/BUSINESS_PLAN.md`

## ESLint Rules

**IMPORTANT**: Never add `eslint-disable` comments to hide warnings or errors without confirming with the user first. ESLint catches real issues that need proper fixes.

Acceptable exceptions (after discussion):
- React 19's `react-hooks/set-state-in-effect` for standard data-loading-on-mount patterns
- Third-party component issues that cannot be fixed without forking

## Code Standards

- Use Next.js `<Image>` component instead of `<img>` tags for automatic optimization
- Never use the `unoptimized` prop on `<Image>` — configure `remotePatterns` in `next.config.ts` instead. `unoptimized` bypasses Next.js image optimization and is a workaround, not a fix.
- Fix unused variables - don't leave dead code
- Keep dependencies up to date
