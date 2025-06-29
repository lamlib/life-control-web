import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  esbuild: {
    minify: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        addArticle: './pages/add-article.html',
        allArticle: './pages/all-article.html',
        editArticle: './pages/edit-article.html',
        emailConfirm: './pages/email-confirm.html',
        login: './pages/login.html',
        home: './pages/home.html',
        profile: './pages/profile.html',
        viewArticle: './pages/view-article.html',
      }
    }
  },
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'api')
      }
    }
  },
})