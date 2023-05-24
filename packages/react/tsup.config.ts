import { Options, defineConfig } from 'tsup'

const sharedConfig: Options = {
  format: ['cjs', 'esm'],
  clean: true,
  shims: true,
  sourcemap: true,
}

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist/react',
    ...sharedConfig,
  },
  {
    entry: {
      index: 'src/jsx-runtime/jsx.ts',
    },
    outDir: 'dist/jsx-runtime',
    ...sharedConfig,
  },
  {
    entry: {
      index: 'src/jsx-runtime/jsx-dev.ts',
    },
    outDir: 'dist/jsx-dev-runtime',
    ...sharedConfig,
  },
])
