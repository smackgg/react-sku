var path = require('path');
var config = {
  entry: [
    path.resolve(__dirname, 'js/main.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
};

module.exports = config;