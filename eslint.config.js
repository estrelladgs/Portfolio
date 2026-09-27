import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'dist-ssr', 'node_modules', 'design'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Browser app: accessibility + hooks rules.
  {
    files: ['src/**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },

  // Node scripts and build config.
  {
    files: ['scripts/**/*.mjs', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  // The audit scripts also pass callbacks to page.evaluate(), which run inside the browser.
  {
    files: ['scripts/a11y-check.mjs', 'scripts/keyboard-walk.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },

  // Formatting is Prettier's job: turn off stylistic rules that would conflict with it.
  prettier,
);
