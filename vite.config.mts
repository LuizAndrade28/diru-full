// vite.config.mts  (ordem CERTA 👇)
import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby"; // ①  PRIMEIRO
import react from "@vitejs/plugin-react"; // ②  DEPOIS

export default defineConfig({
  plugins: [
    RubyPlugin(), // precisa definir aliases + entrée-points
    react({
      // depois o React-Refresh
      include: /\.(jsx|tsx)$/,
    }),
  ],
});
