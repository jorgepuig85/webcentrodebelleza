import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        modulePreload: {
          resolveDependencies: (filename, deps, { hostId, hostType }) => {
            // Do not eagerly preload below-the-fold or non-critical preview chunks and third party heavy libs
            return deps.filter(dep => 
              !dep.includes('vendor-supabase') && 
              !dep.includes('vendor-motion') &&
              !dep.includes('supabaseClient') &&
              !dep.includes('BackgroundGradient') &&
              !dep.includes('ServicesPreview') && 
              !dep.includes('PromotionsPreview') &&
              !dep.includes('TechnologyPreview') &&
              !dep.includes('TestimonialsPreview') &&
              !dep.includes('LocationsPreview') &&
              !dep.includes('SeasonalHeroEffects')
            );
          },
        },
        chunkSizeWarningLimit: 600,
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            alquiler: path.resolve(__dirname, 'alquiler/index.html'),
            precios: path.resolve(__dirname, 'precios/index.html'),
          },
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
              'vendor-supabase': ['@supabase/supabase-js'],
              'vendor-recaptcha': ['react-google-recaptcha-v3'],
            }
          }
        }
      }
    };
});
