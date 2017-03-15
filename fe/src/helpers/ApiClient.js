import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'del'];

//判断环境属于服务器端还是客户端,从而拓展 path 路径
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (!__CLIENT__) {
    // Prepend host and port of the API server to the path.
    return 'http://' + config.apiServer.host + ':' + config.apiServer.port + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

//利用superagent发送请求
export default class ApiClient {
  //req参数: 如果是server端就是express的request,如果是client端就是undefined
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (!__CLIENT__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
