import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true // automatically open the browser when running dev server
  },
  build: {
    outDir: '.',
    emptyOutDir: false
  }
}) 