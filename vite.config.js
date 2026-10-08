import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
            '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
            '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
        }
    },

    // Server options
    server: {
        port: 3000,
        strictPort: false,
        open: true, // Auto-open browser
        cors: true
    },

    // Build optimization
    build: {
        target: 'esnext',
        minify: 'terser',
        cssCodeSplit: true,
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
                    'date-utils': ['date-fns']
                }
            }
        }
    },

    // CSS preprocessing
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
                additionalData: `
          @import "@assets/styles/_variables.scss";
        `
            }
        },
        devSourcemap: true
    }
})