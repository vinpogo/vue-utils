import type { App, Plugin } from 'vue'

import { setUidGenerator } from './debug'
import type { PluginOptions } from './types'

export const plugin: Plugin<[PluginOptions?]> = {
  install: (app: App, options?: PluginOptions) => {
    if (
      typeof __ENABLE_VUEBUGGER__ === 'undefined'
        ? !import.meta.env?.DEV
        : !__ENABLE_VUEBUGGER__
    )
      return
    if (options?.uidFn) setUidGenerator(options.uidFn)
    void import('./devtools').then(
      ({ setupComposableDevtools }) =>
        setupComposableDevtools(app),
    )
  },
}
