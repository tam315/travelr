/* eslint-disable */
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
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
});
