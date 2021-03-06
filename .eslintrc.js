module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['prettier', 'import', 'filenames', 'jest', '@typescript-eslint'],
  root: true,
  rules: {
    // Import rules
    'no-duplicate-imports': 'error',
    'no-return-await': 'error',
    'no-unused-expressions': 'error',
    'require-await': 0,
    'no-use-before-define': 0,
    'import/prefer-default-export': 0,
    'import/first': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-cycle': 'error',
    'import/no-deprecated': 'warn',
    'import/no-relative-parent-imports': 'off', // TODO: turn on once we support absolute imports
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
    // Jest rules
    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/lowercase-name': ['error', { ignore: ['describe'] }],
    'jest/no-commented-out-tests': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-duplicate-hooks': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-truthy-falsy': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/require-top-level-describe': 'error',
    'jest/valid-expect': 'error',
    // Other rules
    curly: [2, 'all'],
    'no-console': ['warn', { allow: ['error'] }],
    'no-nested-ternary': 'error',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    yoda: 'error',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true, // The true value here is for backward compatibility
        allowLiteral: false,
        allowObject: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
        readonly: 'array',
      },
    ],
  },
}
