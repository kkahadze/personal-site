import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        resume: resolve(__dirname, "resume.html"),
        about: resolve(__dirname, "about.html"),
        stats: resolve(__dirname, "stats.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
