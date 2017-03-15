var
  G = {
    ADMINPATH: require('../src/config/dev').adminPath,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: false, // <------在这里禁用 redux-devtools
  },
  path = require('path'),
  webpack = require('webpack'),
  CleanPlugin = require('clean-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'),
  babelConfig = require('./babel.config')(G.__DEVELOPMENT__,G.__CLIENT__),
  root = path.resolve(__dirname,'..'),
  assetsPath = path.resolve(root,'./resource/dist');

module.exports = {
  devtool: 'source-map',
  context: root,
  entry: {
    app: './src/client.js',
    vendor: ['react','react-dom','react-router','redux','react-redux','react-router-redux','redux-connect','classnames','superagent']
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkFilename].js',
    publicPath: '/dist/',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelConfig)},
      {test: /\.json$/, loader: 'json'},
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style','css!postcss!less')},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style','css!postcss!sass')},
    ]
  },
  postcss: function(){
    return [require('precss'),require('autoprefixer')];
  },
  progress: true,
  resolve: {
    modulesDirectories: ['src','node_modules'],
    extensions: ['','.json','.js'],
  },
  plugins: [
    //热替换
    new webpack.HotModuleReplacementPlugin(),

    //把公共库提取到一个文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'libs-[hash].js',
      minChunks: Infinity,
    }),

    //清除目录文件，清理文件夹
    new CleanPlugin([assetsPath],{root: root}),

    //分离js和css文件,将文件里面的内联css样式提取到独立的css文件中
    new ExtractTextPlugin('[name]-[chunkhash].css',{allChunks:true}),

    //设置全局环境变量
    new webpack.DefinePlugin(G),

    //有些JS库有自己的依赖树，并且这些库可能有交叉的依赖，DedupePlugin可以找出他们并删除重复的依赖。查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
    new webpack.optimize.DedupePlugin(),

    //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),

    //用于忽略引入模块中并不需要的内容，譬如当我们引入moment.js时，我们并不需要引入该库中所有的区域设置，因此可以利用该插件忽略不必要的代码。
    new webpack.IgnorePlugin(/webpack-stats\.json$/),

    //在client，webpack可以require()各种静态资源，但是在node 环境中,require()是只能用于javascript 的。
    //图片,文字文件和css，特别是css module服务器端渲染是有问题，用webpack-isomorphic-tools这个解决的,解决了服务端渲染中不能解析非js文件的痛点

    //新版的移除了developemnt方法，现在是根据环境变量来判断
    //new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools')).development(),
    new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools')),
  ]
};
