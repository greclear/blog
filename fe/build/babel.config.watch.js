// 这个是启动热加载的配置
module.exports = function(__DEVELOPMENT__, __CLIENT__){
  var config = {
    //解析jsx,es6,es7
    "presets": ['react','es2015','stage-0'],
    //这3个是为了兼容性的
    "plugins": [
      "transform-runtime",
      "add-module-exports",//polyfill export 问题
      "transform-decorators-legacy",//polyfill装饰器语法
    ]
  };

  //babel-plugin-react-transform:可以在这个架子上定制工具：比如加上react-transform-catch-errors，redbox-react
  //这两个插件把catch到的错误直接显示到页面上，就不用再打开控制台看了
  if(__DEVELOPMENT__){
    config.plugins.push(["react-transform",{
      "transforms": [{
        "transform": "react-transform-catch-errors",
        "imports": ["react","redbox-react"]
      }]
    },
    {
      "transforms": [{
        "transform": "react-transform-hmr",
        // if you use React Native, pass "react-native" instead:
        "imports": ["react"],
        // this is important for Webpack HMR:
        "locals": ["module"]
      }]
    }
  ])
  }


  return config;
}
