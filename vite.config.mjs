import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: { include: ["src/**/*.test.{ts,tsx}"], testTimeout: 60000 },
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        main: "index.html",
        colors: "colors.html",
        installation: "installation.html",
      },
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules") &&
            /\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)
          )
            return "motion";
          if (
            id.includes("node_modules") &&
            /\/(react|react-dom|scheduler)\//.test(id)
          )
            return "react";
          if (id.includes("node_modules/glimm/")) return "glimm";
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  plugins: [react(), tailwindcss()],
});
