---
"@vingy/vueltip": patch
---

Support `@floating-ui/vue` v2 alongside v1.

The peer range widens from `^1.1.10` to `^1.1.10 || ^2.0.1`. `@floating-ui/vue` v2.0.0's only
breaking change was dropping `vue-demi` (ending Vue 2 / Vue <3.3.0 support); the public API
vueltip uses is unchanged, and vueltip is Vue 3-only regardless, so no consumer migration is
required.
