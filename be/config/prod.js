var
  path = require('path'),
  beRoot = path.resolve(__dirname, '..'),
  config = {
    cookieSession: { // session
      name: 'blog',
      keys: ["~!@#$SDFGH%^&*)HJ"]
    },
    db: { // 数据库配置
      uri: 'mongodb://localhost:27017/blog',
      opts: {
        user: '',
        pass: ''
      }
    },
    host: 'localhost',
    port: 3000,
    dir: { // 目录配置
      root: beRoot,
      model: path.resolve(beRoot, 'models'),
      controller: path.resolve(beRoot, 'controllers'),
      resource: path.resolve(beRoot, '../fe/resource')
    },
    resourceFixUrl: 'http://localhost:3004', // 静态资源web访问修正路径，如果有网站的话,就填写网站地址
    exceptFolder: 'except' // model 和 controller 中read dir排除的目录名称
  };

module.exports = config;
