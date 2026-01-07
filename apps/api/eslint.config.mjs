import baseConfig from "../../packages/config/eslint/eslint.config.base.mjs";
import globals from "globals";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
