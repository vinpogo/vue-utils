import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: 'vue',
      tsconfigPath: './tsconfig.json',
      entryRoot: 'src',
      include: ['src'],
      exclude: ['src/**/*.test.ts'],
      bundleTypes: {
        bundledPackages: ['@vingy/shared'],
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        basicTooltip: resolve(
          import.meta.dirname,
          'src/basicTooltip.css',
        ),
      },
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['vue', '@floating-ui/vue'],
      output: {
        assetFileNames: '[name][extname]',
      },
    },
    cssCodeSplit: true,
  },
})
