import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "public/popup.html"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "background.js";
          }
          return "[name].js";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
