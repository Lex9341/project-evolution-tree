import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this as a project site at
// https://<user>.github.io/project-evolution-tree/, not from the domain
// root, so asset URLs need this base path (the app itself uses HashRouter
// for client-side routes, which is base-path agnostic).
export default defineConfig({
  base: '/project-evolution-tree/',
  plugins: [react()],
})
