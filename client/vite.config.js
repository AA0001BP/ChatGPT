import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: false,
      },
      manifest: {
        theme_color: "#fff",
        background_color: "#fff",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        name: "EssayAI",
        short_name: "EssayAI",
        description: "EssayAI OpenAI",
        icons: [
          {
            src: "/manifest/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/manifest/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/manifest/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/manifest/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
