// https://github.com/typescript-eslint/typescript-eslint/issues/251
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unused-vars': [
      'error', { 'argsIgnorePattern': '^_' }
    ],
    'no-case-declarations': 0
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  }
}
