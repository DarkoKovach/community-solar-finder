import eslintPluginVue from 'eslint-plugin-vue';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginAccessibility from 'eslint-plugin-vuejs-accessibility';
import eslintPluginStrictVue from 'eslint-plugin-strict-vue';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';

export default [
    // Global ignores
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "coverage/**",
            "tests/**/*.spec.js",
            "**/*.spec.js",
            "**/*.test.js",
            "vitest.config.js"
        ]
    },

    // Test files configuration - specific rules for test files
    {
        files: ["tests/setup.js", "tests/**/*", "**/*.spec.js", "**/*.test.js"],
        rules: {
            // Disable the problematic rule for test files
            "import/no-extraneous-dependencies": "off"
        }
    },

    // JavaScript files configuration
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                process: "readonly"
            }
        },
        plugins: {
            import: eslintPluginImport
        },
        rules: {
            'linebreak-style': 'off',
            'camelcase': 'off',
            'no-console': 'warn',

            // Set indents to 4 spaces everywhere
            'indent': [
                'warn',
                4,
                {
                    ignoredNodes: ['TemplateLiteral'],
                },
            ],

            // Max length set to 119 to match PEP8
            'max-len': [
                'warn',
                {
                    code: 119,
                    ignorePattern: 'class=',
                    ignoreUrls: true,
                },
            ],

            // Allow certain variables to be reassigned
            'no-param-reassign': [
                'error',
                {
                    props: true,
                    ignorePropertyModificationsFor: [
                        'e', // for e.returnvalue
                        'state', // for vuex state
                        'ctx', // nuxt context,
                        'jestVue', // Jest Vue Object
                    ],
                },
            ],

            // Allow certain scoped variables to be used multiple times
            'no-shadow': [
                'error',
                {
                    allow: ['state', 'getters', 'actions', 'mutations'],
                },
            ],

            // Don't warn about dev dependencies for files not used in production
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [
                        '**/storybook/*',
                        '**/mocks/*',
                        '**/helpers/*',
                        '**/*.spec.js',
                        '**/*.test.js',
                        '**/tests/**',
                        '**/*conf*.js',
                        '**/*build*.js',
                        '**/*report*.js',
                        '**/*.story.js',
                        'vitest.config.js',
                        'vite.config.js'
                    ],
                },
            ]
        }
    },
  
    // Vue-specific configuration
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser, // Use imported parser object, not a string
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            vue: eslintPluginVue,
            'strict-vue': eslintPluginStrictVue,
            'vuejs-accessibility': eslintPluginAccessibility,
            prettier: eslintPluginPrettier
        },
        rules: {
            // Vue rules
            'vue/html-closing-bracket-newline': [
                'error',
                {
                    singleline: 'never',
                    multiline: 'never',
                },
            ],
            'vue/html-indent': ['warn', 4],

            'vue/html-closing-bracket-spacing': [
                'error',
                {
                    startTag: 'never',
                    endTag: 'never',
                    selfClosingTag: 'always',
                },
            ],

            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: {
                        max: 1,
                    },
                    multiline: {
                        max: 1,
                    },
                },
            ],

            'vue/singleline-html-element-content-newline': [
                'error',
                {
                    ignoreWhenNoAttributes: false,
                    ignoreWhenEmpty: true,
                },
            ],
      
            // Vue 3 Composition API specific rules
            'vue/script-setup-uses-vars': 'error',
            'vue/no-setup-props-destructure': 'error',
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/multi-word-component-names': 'off',
      
            // Turn off strict-vue requirement for JSDoc
            'strict-vue/require-jsdoc': 'off',
        }
    },
  
    // Shared rules for all files
    {
        files: ["**/*.{js,vue}"],
        rules: {
            'linebreak-style': 'off',
            'max-len': [
                'warn',
                {
                    code: 119,
                    ignorePattern: 'class=',
                    ignoreUrls: true,
                },
            ]
        }
    }
];