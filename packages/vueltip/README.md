# Vueltip

A headless tooltip component for Vue.js.

## Features

- **Dynamic Visibility**: The tooltip does not display when the tooltip text is identical to the element's content, unless the content is truncated.
- **Single Tooltip Instance**: A single tooltip is used, which is repositioned within the window as needed.
- **Headless Design**: Fully customizable; bring your own component(s) for rendering.

## Quick Start

To install Vueltip, use npm or yarn:

```bash
pnpm add @vingy/vueltip
```

Register the tooltip in your app:

```ts
import {
  vueltipPlugin,
  vueltipDirective,
} from '@vingy/vueltip'

createApp(App)
  .use(vueltipPlugin, { component: Tooltip })
  .directive('tooltip', vueltipDirective)
```

## Usage

### 1. Create a Tooltip Component

First, create a tooltip component using the \`useTooltip\` composable:

```ts
<!-- Tooltip.vue -->
<template>
  <div
    ref="tooltipElement"
    v-show="show"
    :style="tooltipStyles"
    class="tooltip"
  >
    {{ content }}
    <div
      ref="arrowElement"
      :style="arrowStyles"
      class="tooltip-arrow"
    />
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import { useVueltip } from '@vingy/vueltip'

const tooltipElement = useTemplateRef('tooltipElement')
const arrowElement = useTemplateRef('arrowElement')

const { tooltipStyles, arrowStyles, show, content } =
  useVueltip({
    tooltipElement,
    arrowElement,
    offset: 8,
    padding: 8,
  })
</script>

<style scoped>
.tooltip {
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
}

.tooltip-arrow {
  background: #333;
}
</style>
```

### 2. Register in Your App

Import and register the tooltip component and plugin in your app's entry point:

```ts
import {
  vueltipPlugin,
  vueltipDirective,
} from '@vingy/vueltip'
// main.ts
import { createApp } from 'vue'

import App from './App.vue'
import Tooltip from './components/Tooltip.vue'

const app = createApp(App)

app
  .use(vueltipPlugin, {
    component: Tooltip,
  })
  .directive('tooltip', vueltipDirective)

app.mount('#app')
```

### 3. Use the Directive

Now you can use the `v-tooltip` directive on any element:

```vue
<template>
  <div>
    <button v-tooltip="'Click me to submit'">Submit</button>

    <input
      v-tooltip="'Enter your email address'"
      type="email"
      placeholder="Email"
    />

    <span
      v-tooltip="{
        text: 'This is a helpful tooltip',
        placement: 'right',
      }"
    >
      Hover over me
    </span>
  </div>
</template>
```

See the demo app in [demo/](../../demo/).

## Basic Tooltip Component

Vueltip provides a pre-built `BasicTooltip` component with default styling that you can use out of the box:

```ts
import {
  vueltipPlugin,
  vueltipDirective,
  BasicTooltip,
} from '@vingy/vueltip'

import '@vingy/vueltip/basicTooltip.css'

const app = createApp(App)

app
  .use(vueltipPlugin, {
    component: BasicTooltip,
  })
  .directive('tooltip', vueltipDirective)
```

### Theming the Basic Tooltip

The `BasicTooltip` component uses CSS custom properties for theming. You can customize it in two ways:

**1. Use the default theme:**

Import the provided CSS file for automatic light/dark mode support:

```ts
import '@vingy/vueltip/basicTooltip.css'
```

**2. Override with custom CSS variables:**

Define your own theme by setting CSS variables:

```css
.vueltip-theme {
  --vueltip-bg: hotpink;
  --vueltip-text: white;
  --vueltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  --vueltip-border-radius: 8px;
  --vueltip-padding: 8px 12px;
  --vueltip-font-size: 16px;
  --vueltip-font-weight: 500;
}
```

**Available CSS variables:**

- `--vueltip-bg`: Background color
- `--vueltip-text`: Text color
- `--vueltip-shadow`: Box shadow
- `--vueltip-border-radius`: Border radius
- `--vueltip-padding`: Content padding
- `--vueltip-font-size`: Font size
- `--vueltip-font-weight`: Font weight

## Options

### Plugin Options

| Option                     | Type                             | Default                    | Description                                                        |
| -------------------------- | -------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `component`                | `Component`                      | Required                   | The Vue component to render as the tooltip                         |
| `showDelay`                | `number`                         | `0`                        | Delay in ms before the tooltip appears                             |
| `hideDelay`                | `number`                         | `200`                      | Delay in ms before the tooltip disappears                          |
| `defaultPlacement`         | `Placement`                      | `'top'`                    | Default placement: `'top'`, `'bottom'`, `'left'`, `'right'`, etc.  |
| `defaultTruncateDetection` | `'x' \| 'y' \| 'both' \| 'none'` | `'both'`                   | Axis to check for text truncation                                  |
| `handleDialogModals`       | `boolean`                        | `false`                    | Move the tooltip inside `<dialog>` elements when they are modal    |
| `placementAttribute`       | `string`                         | `'data-vueltip-placement'` | HTML attribute name for per-element placement overrides            |
| `keyAttribute`             | `string`                         | `'data-vueltip-key'`       | HTML attribute name used to identify tooltip targets               |
| `truncateAttribute`        | `string`                         | `'data-vueltip-truncate'`  | HTML attribute name for per-element truncation detection overrides |

### useVueltip Options

| Option            | Type                       | Default  | Description                                          |
| ----------------- | -------------------------- | -------- | ---------------------------------------------------- |
| `tooltipElement`  | `Ref<HTMLElement \| null>` | Required | Reference to the tooltip container element           |
| `arrowElement`    | `Ref<HTMLElement \| null>` | —        | Reference to the arrow element for positioning       |
| `offset`          | `number`                   | `0`      | Distance between the tooltip and the target element  |
| `padding`         | `number`                   | `0`      | Minimum space between the tooltip and viewport edges |
| `arrowSize`       | `number`                   | `0`      | Size of the arrow element                            |
| `floatingOptions` | `UseFloatingOptions`       | `{}`     | Advanced options passed to Floating UI               |

### Directive Options

The directive accepts a simple string or an object:

```
v-tooltip="'text'"
v-tooltip="{ text, placement, custom }"
```

| Option      | Type        | Default | Description                                              |
| ----------- | ----------- | ------- | -------------------------------------------------------- |
| `text`      | `string`    | —       | Tooltip text                                             |
| `placement` | `Placement` | `'top'` | Placement override for this element                      |
| `custom`    | `object`    | —       | Arbitrary typed data accessible in the tooltip component |

**Placement via directive arg:**

Placement can also be set as a directive argument instead of inside the object:

```
v-tooltip:right="'text'"
```

**Truncation detection modifiers:**

Control which axis is checked for text overflow. When the element is not truncated and the tooltip text matches the element content, the tooltip is suppressed.

| Modifier | Description                          |
| -------- | ------------------------------------ |
| `x`      | Check horizontal overflow only       |
| `y`      | Check vertical overflow only         |
| `both`   | Check both axes (default)            |
| `none`   | Always show regardless of truncation |

```
v-tooltip.x="'text'"
v-tooltip.y="'text'"
v-tooltip.none="'Always visible'"
```

## Custom Data

You can extend the tooltip content with custom typed data for use in your tooltip component:

**1. Create a type declaration file (e.g., `vueltip.d.ts`):**

```ts
declare module '@vingy/vueltip' {
  interface CustomVueltipData {
    userId?: number
    userName?: string
    severity?: 'info' | 'warning' | 'error'
    metadata?: Record<string, unknown>
  }
}
```

**2. Use custom data in your directive:**

```vue
<button
  v-tooltip="{
    text: 'User profile',
    custom: {
      userId: 123,
      userName: 'John Doe',
      severity: 'info',
    },
  }"
>
  View Profile
</button>
```

**3. Access custom data in your Tooltip component:**

```vue
<script setup>
import { useVueltip } from '@vingy/vueltip'

const { content, show } = useVueltip({/* ... */})
</script>

<template>
  <div v-if="show">
    {{ content?.text }}

    <!-- Access your custom data -->
    <span v-if="content?.custom?.userId">
      User ID: {{ content.custom.userId }}
    </span>
  </div>
</template>
```
