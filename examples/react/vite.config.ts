import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  /**
   * NOTE: Should be fixed in next major version of `@vitejs/plugin-react`.
   *
   * @see https://github.com/vitejs/vite/issues/6215#issuecomment-1155357846
   */
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  plugins: [react()],
});
