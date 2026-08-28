// Contrôle statique du code source.
//
// `pluginVue.configs['flat/recommended']` est la mise en application du Style
// Guide officiel de Vue (https://vuejs.org/style-guide/) : priorités A
// (essentiel : props typées, v-for avec clé, style encapsulé), B (fortement
// recommandé : nommage, un attribut par ligne, expressions simples dans les
// templates) et C. Ce fichier est la référence à citer dans le rapport pour
// justifier les conventions de code.

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser
    },
    rules: {
      // Les noms d'écran (App, ScreenDiag, …) sont déjà explicites ; on garde la
      // règle mais on exempte le composant racine, comme le prévoit le guide.
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
      // Le style guide veut PascalCase dans les composants monofichiers.
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Mise en forme : Prettier s'en charge déjà (.vscode/settings.json,
      // formatage à l'enregistrement). Laisser ces deux règles actives ferait
      // se contredire les deux outils à chaque sauvegarde — c'est le seul motif
      // de leur désactivation, les règles de fond restent toutes actives.
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off'
    }
  },

  {
    // Fichiers de configuration : exécutés par Node, pas par le navigateur.
    files: ['*.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node }
  },

  {
    // Outillage de contrôle : exécuté par Node en ligne de commande, jamais
    // livré au navigateur. Sans ces globales, `process` y est signalé comme non
    // défini par no-undef.
    files: ['scripts/**/*.js'],
    languageOptions: { globals: globals.node }
  }
]
