const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common(true), {
  mode: 'production',
  devtool: false,

  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const context = module.context || '';
            const match = context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            if (!match) return 'vendor';
            const packageName = match[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: 'single',
  },
});
