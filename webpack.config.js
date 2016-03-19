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
				loader: 'babel',
				query: {
					presets: ['es2015', 'stage-0', 'react']	
				}
			}	
		]	
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'	
	},
	resolve: {
		extensions: ['', '.js', '.jsx']	
	}
};
