import Vuebugger from '@vingy/vuebugger'
import {
  vueltipDirective,
  vueltipPlugin,
} from '@vingy/vueltip'
import { createApp } from 'vue'

import App from './App.vue'
import Tooltip from './Tooltip.vue'

const app = createApp(App)

app
  .use(Vuebugger)
  .use(vueltipPlugin, {
    component: Tooltip,
    handleDialogModals: true,
  })
  .directive('tooltip', vueltipDirective)

app.mount('#app')

declare module '@vingy/vueltip' {
  export interface CustomVueltipData {
    sum: number
  }
}
