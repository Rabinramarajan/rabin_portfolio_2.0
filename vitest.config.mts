/* `.mts`, not `.ts`: Vite's next-major `configLoader: 'native'` hands the file
   to Node directly, and Node reads a bare `.ts` here as CommonJS — the ESM
   syntax below would fail to parse. The extension states the module system
   rather than depending on a `"type": "module"` in package.json, which would
   also reinterpret every `.js` script in this repo. */
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      // `__dirname` does not exist under ESM, which this file now definitively is.
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
