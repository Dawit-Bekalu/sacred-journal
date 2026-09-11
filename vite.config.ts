import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },

  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: {
          enabled: false,
        },
        manifest: false,

        workbox: {
          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,woff2,webmanifest}"
          ],

          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "faith-marker-pages",
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: ({ request }) =>
                ["style", "script", "image", "font"].includes(
                  request.destination
                ),
              handler: "CacheFirst",
              options: {
                cacheName: "faith-marker-assets",
              },
            },
          ],

          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
      }),
    ],
  },
});
