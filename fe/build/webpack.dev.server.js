var Express = require('express');
var webpack = require('webpack');

var path = require('path');
var  httpProxy = require('http-proxy');


var config = require('../src/config/dev');
var webpackConfig = require('./webpack.config.watch.js');
var compiler = webpack(webpackConfig);

var serverOptions = {
  contentBase: 'http://' + config.webpackServer.host + ':' + config.webpackServer.port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));



const proxy = httpProxy.createProxyServer({
  target: 'http://' + config.apiServer.host + ':' + config.apiServer.port
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.get('*', function (req, res) {
    res.sendFile( path.resolve(__dirname , '../resource/index.html') );
    //res.sendFile('/Users/huangweicong/test/blog/fe/resource/dist/main-5e07d1b17e1a015d06e1.js');
})







app.listen(config.webpackServer.port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('----\n==> webpackServer is running on http://%s:%s', config.webpackServer.host, config.webpackServer.port);
  }
});
