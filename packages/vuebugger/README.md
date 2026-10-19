# Vuebugger

Vue devtools provide an easy way to inspect component state. But when having something like a composable, you actually need to catch all the returned values in order for them to show up in the devtools. This is where this package can come in handy.

## Features

- Debug composables and reactive state easily
- Tree-shakable with zero runtime overhead in production
- Simple API: just call `debug(name, state)`
- Opt-in production mode via `__ENABLE_VUEBUGGER__`
- Conditionally register state with `debug(name, state, { enable })`

## Quick start

```bash
pnpm add -D @vingy/vuebugger
```

Register the plugin in your app:

```ts
import Vuebugger from '@vingy/vuebugger'

createApp(App).use(Vuebugger)
```

## Usage

### Basic usage

`debug()` registers values from composables so they show up in Vue Devtools.

```ts
import { debug } from '@vingy/vuebugger'

export const useFoo = (initial: number) => {
  const multiplier = ref(1) // not easy to debug if something goes wrong

  const inc = () => multiplier.value++
  const dec = () => multiplier.value--

  const value = computed(() => initial * multiplier)

  debug('useFoo', { multiplier }) // now visible in devtools

  return { value, inc, dec }
}
```

### Options

`debug()` accepts an optional third argument:

| Option   | Type                        | Default     | Description                                                                                                                      |
| -------- | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `enable` | `MaybeRefOrGetter<boolean>` | `undefined` | Only register state when truthy. When reactive, the entry is added and removed from devtools automatically as the value changes. |

See the demo app in [demo/](../../demo/).

## Production usage

By default, Vuebugger is only active when `import.meta.env.DEV` is `true`, so it is automatically disabled and tree-shaken away in production builds with zero runtime overhead.

If you need Vuebugger active in a production build (e.g. for staging environments or opt-in debugging), set `__ENABLE_VUEBUGGER__` in your `vite.config.ts`:

```ts
export default defineConfig({
  define: {
    __ENABLE_VUEBUGGER__: true,
  },
})
```

Setting it to `false` explicitly disables Vuebugger even in development:

```ts
define: {
  __ENABLE_VUEBUGGER__: false,
}
```

When `__ENABLE_VUEBUGGER__` is not defined at all, the original behaviour is preserved — active in dev, inactive in production.

Define `__ENABLE_VUEBUGGER__` explicitly so production builds don't emit the devtools chunk at all. If it is left undefined, the chunk is still emitted but never loaded:

```ts
export default defineConfig(({ command }) => ({
  define: {
    __ENABLE_VUEBUGGER__: command === 'serve',
  },
}))
```
