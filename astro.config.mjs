// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  compressHTML: false, // for debugging. in real production, minify should be enabled.
  devToolbar: {
    enabled: false,
  },
  server: ({ command }) => ({
    port: command === 'dev' ? 4321 : 1234,
  }),

  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          includePaths: ['./src/styles/'],
          // when using scss, put global styles like variables and mixins here.
          additionalData: `
          @use "variables" as *;
          @use "mixins" as *;
          `,
        },
      },
    },
    build: {
      assetsInlineLimit: 0, // Prevent inline JS/TS
      minify: false, // for debugging. in real production, minify should be enabled.
    },
  },
});
