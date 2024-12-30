import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Optimisation du cache
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue'],
          'ui': [
            '@/components/ui/Button.vue',
            '@/components/ui/Input.vue',
            '@/components/ui/Card.vue',
            '@/components/ui/Alert.vue',
            '@/components/ui/Spinner.vue'
          ]
        },
        // Nommage des chunks pour un meilleur cache
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Compression des assets
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Configuration du serveur de développement
  server: {
    hmr: {
      overlay: false // Désactive l'overlay HMR pour de meilleures performances
    }
  }
})
