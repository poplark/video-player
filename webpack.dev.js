const config = require('./webpack.config');
const WriteFilePlugin = require('write-file-webpack-plugin');
const merge = require('webpack-merge');

module.exports = merge(config, {
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new WriteFilePlugin(),
  ]
});
