import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NonspaceUI',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Output to dist folder
    outDir: 'dist',
    // Don't empty outDir (we put .d.ts files there first)
    emptyOutDir: false,
  },
})




