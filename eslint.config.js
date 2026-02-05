import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        DC: 'readonly',
        echarts: 'readonly',
        Cesium: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      quotes: ['error', 'single'],
      'no-unused-vars': 'off',
    },
  },
]
