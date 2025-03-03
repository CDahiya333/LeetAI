import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy'; // Import the plugin

export default defineConfig({
  plugins: [
    react(),
    // Add the viteStaticCopy plugin to your plugins array
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json', // Path to your manifest.json file
          dest: '.' // Destination directory (root of dist)
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        worker: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    emptyOutDir: true
  },
  publicDir: 'public'
});