import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
    ".cursor/**",
    ".opencode/**",
    // Node-only build/media utilities — CommonJS by design.
    "scripts/**",
    // The release pipeline — a Node script, not app code.
    "publish/**",
  ]),
]);

export default eslintConfig;
