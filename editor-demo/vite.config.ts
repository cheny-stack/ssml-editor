import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/voice-editor/',
  plugins: [vue()],
  resolve: {
    alias: {
      'ssml-editor': resolve(__dirname, 'libs/ssml-editor')
    }
  }
})
