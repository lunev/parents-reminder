import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
      ],
    }),
  ],

  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "index.html"),
        background: "./src/background/background.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background" ? "background.js" : "assets/[name]-[hash].js";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
