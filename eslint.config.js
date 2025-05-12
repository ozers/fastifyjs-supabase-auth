import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['eslint.config.js'],
    languageOptions: {
      parser,
      parserOptions: {
        project: null,
      },
    },
  },
  {
    ignores: ['node_modules', 'dist', '.idea'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: pluginPrettier,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      'prettier/prettier': 'error',
    },
  },
];
