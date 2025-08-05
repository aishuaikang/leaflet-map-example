import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), tailwindcss(), vueDevTools(), ElementPlus({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
