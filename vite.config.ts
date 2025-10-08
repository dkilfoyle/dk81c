import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), arraybuffer()],
  optimizeDeps: {
    include: ["vscode-textmate", "vscode-oniguruma", "@vscode/vscode-languagedetection"],
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },
});
