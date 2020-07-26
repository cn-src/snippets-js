module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)"
      ],
      env: {
        jest: true
      },
      rules: {
        "@typescript-eslint/ban-ts-comment": "off"
      }
    }
  ]
};
