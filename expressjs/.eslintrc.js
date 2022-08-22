module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },

  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'prettier'
  ],

  rules: {
    // ESLint
    'import/order': 'off',

    // AirBnB
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-console': 'off',
    'no-void': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',

    // Naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variableLike',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is']
      }
    ],

    // General
    '@typescript-eslint/no-shadow': 'error'
  }
}
