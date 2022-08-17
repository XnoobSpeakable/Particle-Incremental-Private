module.exports = {
   env: {
      browser: true,
      es2021: true,
   },
   parser: '@typescript-eslint/parser',
   plugins: ['@typescript-eslint'],
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
   },
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
   ],
   rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
'@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-types': [
         'error',
         {
            types: {
               // add a custom message to help explain why not to use it
               number: 'use type jsnumber from util.js',
            },
            extendDefaults: true,
         },
      ],
   },
};
