module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
        indent: ['error', 4, { ignoreComments: true, SwitchCase: 1 }],
        semi: ['error', 'never'],
        'max-len': [
            'error',
            { code: 110, tabWidth: 4, ignoreTemplateLiterals: true },
        ],
    },
}
