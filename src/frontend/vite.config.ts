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
});