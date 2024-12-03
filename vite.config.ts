import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.base";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
  }),
);
