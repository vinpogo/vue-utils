# Vue Utilities

## Overview

Monorepo with independently-versioned packages:

- **vuebugger**: Vue devtools plugin for debugging composables and reactive state
- **vueltip**: Headless tooltip component with smart visibility detection
- **shared**: Internal shared types/utilities (`@vingy/shared`)

## Stack

- **pnpm workspaces** with catalog protocol for centralized versions
- **vite** — ESM-only builds with `.d.ts` types
- **Vitest** — dual projects: unit tests (Node) + browser tests (Browser/Playwright)

## Commands

All tasks run via mise: `mise run <task>`

`install` `build` `test` `oxlint` `oxfmt` `bump`

## Skills

Read the relevant skill before writing code in that area:

| When you need to...    | Read                                                     |
| ---------------------- | -------------------------------------------------------- |
| Write or modify tests  | [Testing Decisions](.github/skills/testing-decisions.md) |
| Design or manage state | [State Management](.github/skills/state-management.md)   |
| Write any code         | [Common Pitfalls](.github/skills/common-pitfalls.md)     |
