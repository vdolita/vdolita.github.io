const reactRules = {
  'react/prop-types': 'off',
  'react/require-default-props': 'off',
};

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  ignorePatterns: ['.cache', 'node_modules', 'public'],
  extends: [
    'plugin:css-modules/recommended',
    'plugin:react/recommended',
    'google',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'css-modules'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: {
      version: '>17',
    },
  },
  rules: {
    ...reactRules
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        createDefaultProgram: true
      },
      extends: [
        'airbnb-typescript',
        'prettier',
      ],
      rules: {
        ...reactRules
      }
    }
  ]
};
