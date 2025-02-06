import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}) // add options if needed
      ],
    }
  }
})
