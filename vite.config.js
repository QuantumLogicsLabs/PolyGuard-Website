import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Enables client-side routing — Vite dev server will serve index.html
  // for all routes so react-router-dom can take over.
  server: {
    historyApiFallback: true,
  },
})
