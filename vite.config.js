import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
export default defineConfig({
    plugins: [react()],

    define: {
        global: {},
    },
    resolve: {
        alias: {
            "./runtimeConfig": "./runtimeConfig.browser",
        },
    },
    build: {
        rollupOptions: {
            plugins: [nodePolyfills()],
        },
    },
});
