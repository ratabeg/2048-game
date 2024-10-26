import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // Adjust 'src' if your directory is different
    },
  },
  test: {
    coverage: {
      reporter: ["text", "html"],
    },
    globals: true,
    environment: "jsdom",
  },
});
