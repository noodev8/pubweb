# Claude Code Guidelines

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
