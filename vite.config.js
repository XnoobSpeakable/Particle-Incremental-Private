import { defineConfig } from "vite";
export default defineConfig({
  base: "/Particle-Incremental-Canary/",
  build: { target: "esnext", sourcemap: true, minify: false},
});