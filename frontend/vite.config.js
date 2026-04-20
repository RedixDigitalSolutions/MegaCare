import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
        extensions: [".mts", ".ts", ".tsx", ".jsx", ".mjs", ".js", ".json"],
    },
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_API_URL ?? "http://localhost:5000",
                changeOrigin: true,
            },
            "/socket.io": {
                target: process.env.VITE_API_URL ?? "http://localhost:5000",
                changeOrigin: true,
                ws: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    ui: [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-select",
                        "@radix-ui/react-tabs",
                    ],
                    charts: ["recharts"],
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
                },
            },
        },
    },
});
