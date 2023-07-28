import { defineConfig } from "vite";

export default defineConfig({
  base: "/Particle-Incremental/",
  build: {
    target: "esnext",
    sourcemap: true
  },
  esbuild: {
    target: "esnext",
    mangleProps: /pow10|pow_base|tetrate|pentate|layerAdd|layerAdd10/,
    mangleQuoted: true
  },
  server: {
    host: "0.0.0.0"
  }
});