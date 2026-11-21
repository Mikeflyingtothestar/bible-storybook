const expoConfig = require('eslint-config-expo/flat')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.expo/**',
      'supabase/seed/**',
      'supabase/migrations/**',
      'supabase/functions/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.cache/**',
    ],
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      // eslint-plugin-import's TypeScript resolver does not understand TypeScript 6 yet.
      'import/namespace': 'off',
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/named': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-duplicates': 'off',
    },
  },
])
