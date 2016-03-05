module.exports = {
	context: __dirname + '/options',
	entry: './index.js',
	output: {
		path: './',
		filename: 'options.js'
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
