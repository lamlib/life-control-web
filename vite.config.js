import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    minify: true,
    target: 'es2015',
    legalComments: 'none',
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, 'auth')
      }
    }
  }

})