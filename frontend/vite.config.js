import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import this

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Add this to the array
  ],
  server: {
    proxy: {
      // Whenever React asks for a URL starting with '/api'...
      '/api': {
        target: 'http://localhost:3000', // ...Vite will forward it to your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})