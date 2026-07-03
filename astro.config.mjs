// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@js": "/src/js"
      }
    }
  }
  // Eliminamos output y adapter para que sea estático por defecto
});
