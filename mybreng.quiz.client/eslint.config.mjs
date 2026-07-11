import javaScriptLint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import typeScriptLint from 'typescript-eslint';

const jsRules = {
    'dot-notation': 'error',
    'class-methods-use-this': 'off',
    'no-unused-vars': 'error',
    'default-param-last': 'error',
    'no-useless-constructor': 'error',
    'require-await': 'error',
    'no-empty-function': 'error',
    'no-unused-expressions': 'error',
    'for-direction': 'error',
    'getter-return': 'error',
    'no-setter-return': 'error',
    'no-class-assign': 'error',
    'no-const-assign': 'error',
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-ex-assign': 'error',
    'no-func-assign': 'error',
    'no-import-assign': 'error',
    'no-invalid-regexp': 'error',
    'no-undef': 'off',
    'no-trailing-spaces': 'error',
    'no-irregular-whitespace': 'error',
    'no-loss-of-precision': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-self-compare': 'error',
    'no-self-assign': 'error',
    'no-obj-calls': 'error',
    'no-sparse-arrays': 'error',
    'no-this-before-super': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-private-class-members': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'curly': 'error',
    'default-case-last': 'error',
    'eqeqeq': 'error',
    'new-cap': ['error', {
        'capIsNew': false
    }],
    'no-delete-var': 'error',
    'no-div-regex': 'error',
    'no-empty-static-block': 'error',
    'no-eq-null': 'error',
    'no-extend-native': 'error',
    'no-extra-boolean-cast': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-lonely-if': 'error',
    'no-negated-condition': 'error',
    'no-nested-ternary': 'error',
    'no-redeclare': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'symbol-description': 'error',
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'eol-last': 'error',
    'nonblock-statement-body-position': ['error', 'below'],
    'camelcase': [
        'error',
        {
            'properties': 'always'
        }
    ],
    '@stylistic/js/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    '@stylistic/js/function-call-spacing': ['error', 'never'],
    '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/js/function-paren-newline': ['error', 'consistent'],
    '@stylistic/js/generator-star-spacing': ['error', { 'before': false, 'after': true }],
    '@stylistic/js/yield-star-spacing': ['error', 'after'],
    '@stylistic/js/max-len': ['error', { 'code': 120, 'tabWidth': 4 }],
    '@stylistic/js/jsx-quotes': ['error', 'prefer-single'],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/lines-between-class-members': [
        'error',
        {
            'enforce': [
                { 'blankLine': 'always', 'prev': '*', 'next': 'method' },
                { 'blankLine': 'always', 'prev': 'method', 'next': '*' }
            ]
        }
    ],
    '@stylistic/js/wrap-iife': 'off',
    '@stylistic/js/template-tag-spacing': 'error',
    '@stylistic/js/template-curly-spacing': 'error',
    '@stylistic/js/switch-colon-spacing': ['error', { 'after': true, 'before': false }],
    '@stylistic/js/newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
    '@stylistic/js/no-confusing-arrow': 'off',
    '@stylistic/js/no-extra-parens': ['error', 'all', { 'nestedBinaryExpressions': false }],
    '@stylistic/js/no-extra-semi': 'error',
    '@stylistic/js/no-mixed-operators': 'error',
    '@stylistic/js/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/js/no-multi-spaces': 'error',
    '@stylistic/js/no-multiple-empty-lines': 'error',
    '@stylistic/js/no-tabs': 'error',
    '@stylistic/js/no-trailing-spaces': 'error',
    '@stylistic/js/no-whitespace-before-property': 'error',
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    '@stylistic/js/object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
    '@stylistic/js/one-var-declaration-per-line': ['error', 'always'],
    '@stylistic/js/quotes': ['error', 'single', { 'avoidEscape': true }],
    '@stylistic/js/quote-props': 'off',
    '@stylistic/js/rest-spread-spacing': ['error', 'never'],
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/semi-spacing': ['error', { 'before': false, 'after': true }],
    '@stylistic/js/semi-style': ['error', 'last'],
    '@stylistic/js/space-before-blocks': ['error', 'always'],
    '@stylistic/js/space-in-parens': ['error', 'never'],
    '@stylistic/js/space-infix-ops': 'error',
    '@stylistic/js/space-unary-ops': 'error',
    '@stylistic/js/spaced-comment': ['error', 'always'],
    '@stylistic/js/array-element-newline': ['error', 'consistent'],
    '@stylistic/js/padded-blocks': ['error', 'never'],
    '@stylistic/js/multiline-comment-style': 'off',
    '@stylistic/js/dot-location': ['error', 'property'],
    '@stylistic/js/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/js/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/js/arrow-parens': ['error', 'as-needed'],
    '@stylistic/js/implicit-arrow-linebreak': ['off'],
    '@stylistic/js/operator-linebreak': ['error', 'after'],
    '@stylistic/js/space-before-function-paren': [
        'error',
        {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }
    ],
    '@stylistic/js/indent': [
        'error',
        4,
        { 'SwitchCase': 1 }
    ],
    '@stylistic/js/key-spacing': [
        'error',
        {
            'beforeColon': false,
            'afterColon': true,
            'mode': 'strict'
        }
    ],
    '@stylistic/js/padding-line-between-statements': [
        'error',
        { 'blankLine': 'always', 'prev': 'class', 'next': '*' },
        { 'blankLine': 'always', 'prev': 'cjs-import', 'next': '*' },
        { 'blankLine': 'never', 'prev': 'cjs-import', 'next': 'cjs-import' },
        { 'blankLine': 'always', 'prev': 'import', 'next': '*' },
        { 'blankLine': 'never', 'prev': 'import', 'next': 'import' },
        { 'blankLine': 'always', 'prev': '*', 'next': 'export' },
        { 'blankLine': 'always', 'prev': 'export', 'next': '*' },
        { 'blankLine': 'always', 'prev': 'cjs-export', 'next': '*' }
    ],
    '@stylistic/js/keyword-spacing': [
        'error',
        {
            'overrides': {
                'break': { 'before': false, 'after': false },
                'continue': { 'before': false, 'after': false },
                'case': { 'before': false, 'after': false },
                'default': { 'before': false, 'after': true },
                'if': { 'before': false, 'after': false },
                'switch': { 'before': false, 'after': false },
                'try': { 'before': false, 'after': true },
                'catch': { 'before': true, 'after': false },
                'finally': { 'before': true, 'after': true },
                'throw': { 'before': false, 'after': true },
                'class': { 'before': false, 'after': false },
                'const': { 'before': false, 'after': true },
                'debugger': { 'before': false, 'after': false },
                'delete': { 'before': false, 'after': false },
                'do': { 'before': false, 'after': true },
                'while': { 'before': true, 'after': false },
                'else': { 'before': true, 'after': true },
                'with': { 'before': false, 'after': false },
                'export': { 'before': false, 'after': true },
                'from': { 'before': true, 'after': true },
                'import': { 'before': false, 'after': true },
                'extends': { 'before': false, 'after': false },
                'for': { 'before': false, 'after': false },
                'function': { 'before': false, 'after': false },
                'get': { 'before': false, 'after': false },
                'set': { 'before': false, 'after': false },
                'in': { 'before': true, 'after': true },
                'of': { 'before': true, 'after': true },
                'let': { 'before': false, 'after': true },
                'var': { 'before': false, 'after': true },
                'new': { 'before': false, 'after': false },
                'return': { 'before': false, 'after': true },
                'yield': { 'before': false, 'after': false },
                'static': { 'before': false, 'after': false },
                'super': { 'before': false, 'after': false },
                'this': { 'before': false, 'after': false },
                'typeof': { 'before': false, 'after': false },
                'void': { 'before': false, 'after': false }
            }
        }
    ]
};

const tsRules = {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_$',
        'varsIgnorePattern': '^_$'
    }],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-find': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-tslint-comment': 'error',
    '@typescript-eslint/consistent-generic-constructors': 'error',
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    'default-param-last': 'off',
    '@typescript-eslint/default-param-last': 'error',
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-array-delete': 'error',
    '@typescript-eslint/no-base-to-string': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-deprecated': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-duplicate-type-constituents': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-explicit-any': ['error', { 'fixToUnknown': true }],
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-unary-minus': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-enum-comparison': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    'no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
            allowDefaultCaseForExhaustiveSwitch: true,
            considerDefaultExhaustiveForUnions: true
        }
    ],
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble'
        },
        {
            selector: 'import',
            format: ['camelCase', 'PascalCase']
        },
        {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble'
        },
        {
            selector: 'typeLike',
            format: ['PascalCase']
        },
        {
            selector: 'enumMember',
            format: ['PascalCase', 'camelCase']
        },
        {
            selector: 'objectLiteralProperty',
            format: null
        }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
            'accessibility': 'explicit',
            'overrides': {
                'constructors': 'no-public'
            }
        }
    ],
    '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
            'assertionStyle': 'as',
            'objectLiteralTypeAssertions': 'allow'
        }
    ],
    '@typescript-eslint/parameter-properties': [
        'warn',
        {
            'allow': [
                'private readonly',
                'private',
                'protected readonly',
                'protected',
                'public readonly',
                'public',
                'readonly'
            ],
            'prefer': 'parameter-property'
        }
    ]
};

const config = {
    rootConfigs: [],
    jsRules: {
        ...jsRules
    },
    tsRules: {
        ...jsRules,
        ...tsRules
    },
    jsLanguageOptions: {},
    tsLanguageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    jsTsPlugins: {},
    tsPlugins: {}
};

export default [
    javaScriptLint.configs.recommended,
    stylisticJs.configs['all-flat'],
    ...typeScriptLint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: config.jsLanguageOptions,
        plugins: {
            '@stylistic/js': stylisticJs,
            ...config.jsTsPlugins
        },
        rules: config.jsRules
    },
    {
        files: ['**/*.ts'],
        ignores: ['src/app/web-api/**'],
        languageOptions: config.tsLanguageOptions,
        plugins: {
            '@typescript-eslint': typeScriptLint.plugin,
            ...config.tsPlugins
        },
        rules: config.tsRules
    },
    ...config.rootConfigs
];
