import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        target: "esnext",
        sourcemap: true
    },
    esbuild: {
        target: "esnext",
        mangleProps:
            /pow10|pow_base|tetrate|pentate|layerAdd|layerAdd10|fromDecimal|fromNumber|fromString|slog|slog_critical|tetrate_critical|critical_section|fromValue|fromValue_noAlloc|fromComponents|fromComponents_noNormalize|normalize/,
        mangleQuoted: true
    }
});
