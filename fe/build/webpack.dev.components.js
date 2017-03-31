var webpack = require('webpack'),
    babelConfig = require('./babel.config')(),
    path = require('path');

module.exports = {
  devtools: 'inline-source-map',
  context: path.resolve(__dirname,'..'),
  entry: [
    './src/compileApp.js'
  ],
  output: {
    path: path.resolve(__dirname, '../resource/example/componentsDist'),
    // filename: 'finger.js',
    filename: 'crop.js',
    publicPath: '/componentsDist/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelConfig)},
      { test: /\.json$/,  loader: 'json'},
      { test: /\.scss$/, loader: 'style!css!postcss!sass'},
    ]
  },
  postcss: function(){
    return [require('autoprefixer')];
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['','.json','.js']
  },
  plugins: [
    //hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
};
