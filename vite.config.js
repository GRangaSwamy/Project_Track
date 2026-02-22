import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // suppress warning; chunking below handles it
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase SDK
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // PDF generation (large)
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
          // Lottie player
          'vendor-lottie': ['@lottiefiles/react-lottie-player'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})

