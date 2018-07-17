const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
