var fs = require('fs');
var path = require('path');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './js/app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },

  plugins: [
  ],

  devtool: 'source-map',
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: "json"},
    ]
  },
  // Loaders are resolved relative to the docs directory.  Since the docs/
  // directory isn't a parent of the plugin directory, we can't use loaders by
  // default on any requires that eslint-plugin-closure uses.  Setting
  // resolveLoader avoids this problem.
  resolveLoader: {
    root: path.join(__dirname, "node_modules"),
  }
};
