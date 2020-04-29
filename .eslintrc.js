module.exports = {
  root: true,

  globals: {
    Map: true,
    Promise: true,
  },

  parser: 'babel-eslint',

  env: {
    node: true,
    jest: true
  },

  extends: [
    'prettier',
  ],

  plugins: ['prettier', 'eslint-plugin-import-helpers'],

  rules: {
    'prettier/prettier': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-throw-literal': 'error',
    'no-console': 'error',
    'no-undef': 'error',
    curly: 'error',
    'no-unused-vars': ['error', { args: 'none' }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: [
          'const',
          'let',
          'var',
          'function',
          'class',
          'try',
          'throw',
          'if',
          'for',
          'do',
          'while',
          'switch',
          'return',
        ],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'const',
          'let',
          'var',
          'function',
          'class',
          'try',
          'throw',
          'if',
          'for',
          'do',
          'while',
          'switch',
          'return',
        ],
      },
      { blankLine: 'any', prev: ['case'], next: ['case', 'default'] },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var', 'export', 'import'],
        next: ['const', 'let', 'var', 'export', 'import'],
      },
      {
        blankLine: 'always',
        prev: ['import'],
        next: ['export'],
      },
    ],
    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'never',
        groups: [
          '/^vue/',
          '/^@testing-library/',
          'module',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
  },
};
