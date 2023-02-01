// This file is used to run eslint --fix at build time to remove unused code. For
// example any unused i18n strings that may no longer be needed as the components
// that used them were deleted.

module.exports = {
  // Files not to lint
  ignorePatterns: ['.eslintrc.js', '.eslintrc-treeshake.js', 'quasar.conf.js'],

  // Parser
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },

  // Extensions
  extends: ['plugin:@typescript-eslint/base', 'plugin:vue/base'],

  // Overrides to ensure json files are handled correctly
  overrides: [
    {
      files: ['*.json'],
      extends: ['plugin:@intlify/vue-i18n/base']
    }
  ],

  // Rules
  rules: {
    '@intlify/vue-i18n/no-unused-keys': [
      'error',
      {
        src: './src',
        extensions: ['.js', '.vue', '.ts'],
        ignores: ['/yml_config/'],
        enableFix: true
      }
    ]
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/i18n/*.json',

      // Specify the version of `vue-i18n` you are using.
      // If not specified, the message will be parsed twice.
      messageSyntaxVersion: '^9.0.0'
    }
  }
}
