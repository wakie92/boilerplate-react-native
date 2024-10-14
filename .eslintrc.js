module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'plugin:lodash-fp/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    createDefaultProgram: true,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'lodash-fp',
    'no-secrets',
    'prettier',
    'react-hooks',
    'react',
    'security',
    '@typescript-eslint',
  ],
  rules: {
    'no-nested-ternary': 'off',
    'security/detect-object-injection': 'off',
    'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-console': ['error', { allow: ['debug', 'warn', 'error'] }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft', 'stateValidate', 'state'],
      },
    ],
    'no-secrets/no-secrets': 'error',
    'no-underscore-dangle': ['error', { allow: ['__REDUX_DEVTOOLS_EXTENSION__'] }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-one-expression-per-line': 'off', // Conflicts with prettier
    'react/jsx-curly-newline': 'off', // Conflicts with prettier
    '@typescript-eslint/no-unused-vars': ['error'],
    'security/detect-non-literal-regexp': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': { node: { paths: ['.'] }, typescript: {} },
    'import/ignore': ['react-native'],
  },
};
