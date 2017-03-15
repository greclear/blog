//#!/usr/bin/env node //在开头一行指定脚本的解释程序为node
global.__CLIENT__ = false; //标识是客户端还是服务器端
global.__DISABLE_SSR__ = false; //禁用服务器端渲染
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.ADMINPATH = require('../src/config').adminPath; //后台地址路径

var
  path = require('path'),
  WebpackIsomorphicTools = require('webpack-isomorphic-tools'),
  babelConfig = require('../build/babel.config')(__DEVELOPMENT__,__CLIENT__);

require('babel-register')(babelConfig);

//在client，webpack可以require()各种静态资源，但是在node 环境中,require()是只能用于javascript的。
//图片,文字文件和css，特别是css module服务器端渲染是有问题，用webpack-isomorphic-tools这个
//解决了服务端渲染中不能解析非js文件的痛点
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools

// [webpack-isomorphic-tools] [error] `.development()` method is now deprecated
// (for server-side instance only, not for webpack plugin instance)
// and has no effect. Set up a proper `process.env.NODE_ENV` variable
//  instead: it should be "production" for production, otherwise it assumes development.
// The currently used mode is: development. `process.env.NODE_ENV is: undefined

// global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../build/webpack.isomorphic.tools'))
//   .development(__DEVELOPMENT__)
//   .server(path.resolve(__dirname, '..'), function() {
//     //回调，在这里启动server服务
//     require('../src/server');
//   });

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../build/webpack.isomorphic.tools'))
    .server(path.resolve(__dirname, '..'), function() {
      //回调，在这里启动server服务
      require('../src/server');
    });
