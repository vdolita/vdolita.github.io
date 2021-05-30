module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['.cache', 'node_modules', 'public', '.eslintrc.js', 'gatsby-config.js', '.husky'],
  extends: [
    'plugin:react/recommended',
    'google',
    'airbnb-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/display-name': 0,
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
};
