---
'@vingy/vueltip': minor
---

Export the `TooltipDirective`, `Value` and `Modifier` types. `TooltipDirective`
in particular has to be exported for the `GlobalDirectives` augmentation to
survive the `.d.ts` rollup — without it, `vue-tsc` resolved `v-tooltip`'s value
to `any` and silently accepted malformed bindings.
