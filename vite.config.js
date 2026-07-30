import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base doit valoir EXACTEMENT '/<nom-du-depot-github>/' en production,
// sinon les assets renvoient 404 apres publication sur GitHub Pages.
const NOM_DU_DEPOT = 'tb-maturite-ia'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? `/${NOM_DU_DEPOT}/` : '/',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
})
