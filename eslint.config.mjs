import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // CV download links in Contact use <a> to /api/cv/* on purpose.
      "@next/next/no-html-link-for-pages": "off",
      // React 19 rule flags useMediaQuery's sync setState in effect.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([".next/**", "next-env.d.ts"]),
]);

export default eslintConfig;
