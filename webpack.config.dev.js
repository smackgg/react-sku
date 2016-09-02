var path = require('path');
var webpack = require('webpack');
var config = {
  entry: [
    path.resolve(__dirname, 'js/main.js'),
    'webpack-dev-server/client?http://127.0.0.1:8080',
    'webpack/hot/only-dev-server',
  ],
  output: {
    publicPath: "http://127.0.0.1:8080/dist/",
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css?sourceMap", "postcss", "sass?sourceMap"],
    },
    {
      test: /\.less$/,
      loader: "style!css!less"
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
};

module.exports = config;