import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.ADSENSE_CLIENT_ID': JSON.stringify(process.env.ADSENSE_CLIENT_ID),
    'process.env.ADSENSE_SLOT_ID': JSON.stringify(process.env.ADSENSE_SLOT_ID),
  }
})