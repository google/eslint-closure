const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './js/app.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'app.min.js',
  },
  plugins: [
    new HtmlWebpackPlugin({template: './index.html'}),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: '.',
  },
  module: {
    rules: [
      {test: /\.json$/, use: [{loader: "json-loader"}]},
      {test: /\.html$/, use: [{loader: "raw-loader"}]},
    ]
  },
};
