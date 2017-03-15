module.exports = function(__DEVELOPMENT__, __CLIENT__){
  var config = {
    //解析jsx,es6,es7
    "presets": ['react','es2015','stage-0'],

    "plugins": [
      "transform-runtime",
      "add-module-exports",//polyfill export 问题
      "transform-decorators-legacy",//polyfill装饰器语法
    ]
  };

  return config;
}
