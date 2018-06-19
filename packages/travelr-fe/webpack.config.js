module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  // settings for webpack-serve
  serve: {
    content: [__dirname, 'public'], // serve this folder as '/'
    hot: true,
    https: false,
  },
};
