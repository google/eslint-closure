var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.min.js',
  },
  plugins: [],
  devtool: 'source-map',
  module: {
    rules: [
      {test: /\.json$/, use: [{loader: "json-loader"}]},
    ]
  },
};
