import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path"

// https://vitejs.dev/config/

export default defineConfig(({ cmd, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue()],

    define: {
      __APP_ENV__: JSON.stringify(env)
    },
  
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "./src")
      }
    },
  
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3333/",
          changeOrigin: true,
          rewrite: (path) => path.replace("/api/", "")
        }
      }
    }
  }
})
