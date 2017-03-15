import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';
import reducer from './modules/reducer';

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  //其实就是为了能dispatch一个跳转路由地址,统一形式
  //以前是 import {browserHistory} from 'react-router'; 在组件里面 browserHistory.push('/foo');
  //加入这个中间件后，现在可以统一由dispatch管理, import {push} from 'react-router-redux'; 在组件里面 dispatch(push('/foo'));
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(client), reduxRouterMiddleware];

  let finalCreateStore;
  //客户端开发模式且允许启用devtool的话,就启动devtools
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(reducer, data);

  //下面的代码用来支持热加载应用
  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    //接受这个文件的修改用来热加载,应用任何的改变将造成热加载,重新渲染。
    module.hot.accept('./modules/reducer', () => {
      const nextRootReducer = require('./modules/reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
