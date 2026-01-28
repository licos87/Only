const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common(false), {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	devServer: {
		port: 3000,
		hot: true,
		historyApiFallback: true,
		open: true,
		proxy: [
			{
				context: ['/api'],
				target: 'http://127.0.0.1:5001',
				changeOrigin: true,
			},
		],
	},
});
