import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Alias para facilitar a importação de arquivos em src
    },
  },
  build: {
    assetsDir: 'assets', // Diretório onde os assets serão copiados no build
  },
  publicDir: 'public', // Diretório para arquivos estáticos (opcional)
  server: {
    port: 3000,
    proxy: {
      '/usuario': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/turno': { // Adicionado para cobrir /turno/bater-ponto
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/sessao': { // Adicionado para cobrir /turno/bater-ponto
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
});