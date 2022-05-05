module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1, ignoreComments: true }],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    // spacings
    'key-spacing': 'error',
    'comma-spacing': 'error',
    'arrow-spacing': 'error',
    'keyword-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', 'always'],
    // warnings
    'no-unused-vars': 'warn',
    // prefers
    'prefer-const': 'error',
    'eol-last': ['error', 'always'],
  },
}
