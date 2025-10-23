import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        // Proxy all /api requests to the backend
        '/api': {
          // In Docker, use the service name; otherwise use localhost
          target: env.VITE_BACKEND_URL || 'http://api:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            console.log('Proxying:', path);
            return path; // Keep /api prefix
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})