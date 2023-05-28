import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV
const isDEV = env === 'development'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  clean: true,
  shims: true,
  sourcemap: true,
  define: {
    __DEV__: isDEV ? 'true' : 'false',
  },
})
