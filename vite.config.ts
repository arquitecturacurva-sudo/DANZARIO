import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode, command }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy:
      command === "serve" &&
      loadEnv(mode, process.cwd(), "VITE_").VITE_USE_EMULATORS === "true"
        ? {
            "/google.firestore.v1.Firestore": {
              target: "http://127.0.0.1:8080",
              changeOrigin: true,
            },
          }
        : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const path = id.replaceAll("\\", "/");
          return path.includes("/node_modules/") &&
            (path.includes("/firebase/") || path.includes("/@firebase/"))
            ? "firebase"
            : undefined;
        },
      },
    },
  },
}));
