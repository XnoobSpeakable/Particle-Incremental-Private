import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        target: "esnext",
        sourcemap: true
    },
    esbuild: {
        target: "esnext",
        mangleProps: /pow10|pow_base|tetrate|pentate|layerAdd|layerAdd10/,
        mangleQuoted: true
    }
});
