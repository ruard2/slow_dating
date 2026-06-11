import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Slow Dating",
        short_name: "Slow Dating",
        description: "Ontdek elkaar stap voor stap",
        theme_color: "#17120f",
        background_color: "#17120f",
        display: "standalone",
        orientation: "portrait",
      },
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/legacy": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "ws://127.0.0.1:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
