module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    "no-duplicate-imports": "error"
  }
};
