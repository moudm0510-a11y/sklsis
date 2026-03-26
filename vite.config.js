import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    hmr: {
      overlay: false // This hides the red error box from Step 1
    }
  },
  // This helps fix the MIME type error on Linux
  optimizeDeps: {
    force: true 
  }
})