const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');

module.exports = mergeConfig(getDefaultConfig(__dirname), {
    watchFolders: [root],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Ensure all extensions are included
  },
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'), // Use the installed transformer
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.includes('react-native/Libraries/')) {
          req.url = req.url.replace(
            '/react-native/Libraries/',
            `/node_modules/react-native/Libraries/`
          );
        }
        return middleware(req, res, next);
      };
    },
  },
});
