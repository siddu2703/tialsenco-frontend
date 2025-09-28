import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' data: https://www.google-analytics.com https://cdn.tinymce.com https://accounts.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tinymce.com",
        "font-src 'self' https://fonts.gstatic.com https://cdn.tinymce.com",
        "img-src 'self' data: https: blob:",
        "media-src 'self' data: blob:",
        "connect-src 'self' ws: wss: https:",
        "worker-src 'self' 'unsafe-eval' blob:",
      ].join('; ')
    },
  },
  define: {
    // Help Monaco Editor work without eval in production
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    assetsDir: 'react',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Heavy UI libraries
          'ui-vendor': ['antd', '@headlessui/react', 'styled-components'],

          // Editors (lazy loaded)
          'editors': ['@monaco-editor/react', '@tinymce/tinymce-react'],

          // Charts and visualization
          'charts': ['recharts', 'react-qr-code'],

          // Form libraries
          'forms': ['formik', 'react-select', 'react-datepicker', 'react-date-range'],

          // Utility libraries
          'utils': ['lodash', 'dayjs', 'axios', 'collect.js', 'currency.js'],

          // Authentication
          'auth': ['@azure/msal-browser', '@react-oauth/google', 'react-apple-signin-auth'],

          // State management
          'state': ['@reduxjs/toolkit', 'react-redux', 'jotai', 'react-query'],
        },
      },
    },
  },
});
