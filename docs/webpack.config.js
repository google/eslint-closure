var fs = require('fs');
var path = require('path');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './js/app.js',

  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'app.bundle.js',
  },

  plugins: [
    // Stub out all ESLint code that uses the file system.  We call
    // ESLint.verify directly, so we can pass in the rules ourselves.
    new webpack.NormalModuleReplacementPlugin(
        /eslint\/lib\/cli-engine\.js/,
        path.resolve(__dirname, 'js/empty.js')
    ),

    // An easy to parse version of load-rules for webpack.  Webpack chokes on
    // ESLint's version.
    new webpack.NormalModuleReplacementPlugin(
        /eslint\/lib\/load-rules\.js/,
        path.resolve(__dirname, 'js/eslint-load-rules.js')
    ),

    // Needed to use StringReplacePlugin in the preLoaders.
    new StringReplacePlugin(),
  ],

  devtool: 'source-map',

  module: {
    // Disable handling of unknown requires
    unknownContextRegExp: /$^/,
    unknownContextCritical: false,

    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,

    preLoaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {test: /eslint\.js$/, loader: StringReplacePlugin.replace({
        replacements: [
          {
            pattern: /require\(config\.parser\)/,
            replacement: (match, p1, offset, string) => "require('espree')",
          }
        ]
      })}
    ],
    resolve: {
      alias: {
        'json-loader': 'json-loader/index.js'
      },
    },
    resolveLoader: {
      packageMains: ['json-loader']
    },
    loaders: [
      // {
      //   test: /.js$/,
      //   exclude: /node_modules|closure-eslint-.*/,
      //   loader: 'babel-loader',
      //   query: {
      //     presets: ['es2015'].map(function(name) {
      //       return require.resolve('babel-preset-' + name);
      //     }),
      //   },
      // },
    ],
  },
};
