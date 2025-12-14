import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    alias: {
      '@': resolve(rootDir, 'src'),
    }
  }
})
