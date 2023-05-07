import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    esbuild: {
        target: "esnext",
        mangleProps: /scaleFunction|costDiv|currency|extra|displayName|unlockAt|next|textColor|bgColor|buttonColor|borderColor|gradientColor|buttonGradientOverride|themeName/,
        mangleQuoted: true
    },
    build: {
        target: "esnext",
        sourcemap: true
    }
});