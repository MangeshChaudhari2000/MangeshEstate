import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      //each time it saw api localhost: 3000 will get added at begining 
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  },
  plugins: [react()],
})
