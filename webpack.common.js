const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');

module.exports = (isProd) => {
  const envPath = `./.env.${isProd ? 'production' : 'development'}`;
  const envExists = fs.existsSync(envPath);

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, './src/'),
        '@app': path.resolve(__dirname, './src/app/'),
        '@pages': path.resolve(__dirname, './src/pages/'),
        '@widgets': path.resolve(__dirname, './src/widgets/'),
        '@features': path.resolve(__dirname, './src/features/'),
        '@entities': path.resolve(__dirname, './src/entities/'),
        '@shared': path.resolve(__dirname, './src/shared/'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },

        {
          test: /\.module\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: isProd ? '[hash:base64:8]' : '[name]__[local]--[hash:base64:5]',
                  auto: true,
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                },
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {postcssOptions: {plugins: ['autoprefixer']}},
            },
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {postcssOptions: {plugins: ['autoprefixer']}},
            },
            'sass-loader'
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },

        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          type: 'asset/resource',
          generator: {filename: 'assets/images/[name].[hash:8][ext]'},
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: {not: [/url/]},
          use: ['@svgr/webpack'],
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {filename: 'assets/fonts/[name].[hash:8][ext]'},
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),

      new ForkTsCheckerWebpackPlugin(),

      isProd && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css',
      }),

      envExists && new Dotenv({
        path: envPath,
        safe: false,
        systemvars: true,
      }),
    ].filter(Boolean),
  }
}
;
