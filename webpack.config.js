var rucksack = require('rucksack-css');

module.exports = {
	context: __dirname,
	entry: {
		'options': './src/options/index.js',
		'background': './src/background/index.js',
		'tracker': './src/tracker/index.js'
	},
	output: {
		path: './build',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: /src/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'stage-0', 'react']	
				}
			},
			{
				test: /\.css$/,
				include: /src/,
				loaders: [
					'style-loader',
					'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
					'postcss-loader'
				]
			}
		]	
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'	
	},
	resolve: {
		extensions: ['', '.js', '.jsx']	
	},
	postcss: [rucksack({autoprefixer: true})]
};
