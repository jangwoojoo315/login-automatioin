import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"), // public 말고 루트에 위치
        background: resolve(__dirname, "src/background.js"),
        styles: resolve(__dirname, "styles.css"),
      },
      output: {
        inlineDynamicImports: false,
        entryFileNames: "[name].js", // 이름 고정!
        assetFileNames: "[name].[ext]", // 이미지나 기타 파일 이름도 고정
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
