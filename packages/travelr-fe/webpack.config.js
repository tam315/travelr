const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
  entry: './src/index.jsx',
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
    // fallback all routes to index.html
    add: app => {
      app.use(convert(history()));
    },
    hot: true,
    https: false,
  },
};
