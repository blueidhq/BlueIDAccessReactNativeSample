
module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
        '@babel/preset-flow', // For Flow type syntax
        '@babel/preset-typescript', // Add TypeScript preset
    ],
    overrides: [
        {
            plugins: [
                [
                    '@babel/plugin-transform-private-methods',
                    {
                        loose: true,
                    },
                ],
            ],
        },
    ],
    plugins: [

        ['@babel/plugin-transform-private-methods', { loose: true }],
        'babel-plugin-syntax-hermes-parser',
    ],
}
