const { FlatCompat } = require("@eslint/eslintrc");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: require("@eslint/js").configs.recommended,
  allConfig: require("@eslint/js").configs.all,
});

module.exports = [
  // bring in recommended configs using FlatCompat to keep same behavior
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    ignores: ["node_modules/**", ".vscode-test"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      // removed deprecated "member-delimiter-style" from @typescript-eslint; core/team preferences apply
      "@typescript-eslint/naming-convention": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      // use core semi rule
      semi: ["warn", "always"],
      curly: "warn",
      eqeqeq: ["warn", "always"],
      "no-redeclare": "warn",
      "no-throw-literal": "warn",
      "no-unused-expressions": "warn",
    },
  },
];
