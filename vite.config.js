import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: isProduction ? '/testt/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
