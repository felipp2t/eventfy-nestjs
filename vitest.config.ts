import swc from 'unplugin-swc'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },

  plugins: [
    viteTsConfigPaths(),
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],
})
