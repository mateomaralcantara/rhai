// eslint.config.js
import eslintPluginNext from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      "@next/next": eslintPluginNext,
    },
    rules: {
      // Puedes agregar o ajustar reglas aquí
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
