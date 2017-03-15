/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';

import getRoutes from './routes';

const client = new ApiClient();
const dest = document.getElementById('app');
const store = createStore(browserHistory, client, window.__data);
const history = syncHistoryWithStore(browserHistory, store);

const component = (
  <Router render={(props) => <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />} history={history}>
    {getRoutes(store)}
  </Router>
);

render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (__DEVELOPMENT__) {
  window.React = React; // enable debugger

  //使用renderToString渲染组件，会在组件的第一个DOM带有data-react-checksum属性。
  //当客户端渲染React组件时，首先计算出组件的checksum值，然后检索HTML DOM看看是否存在数值相同的data-react-checksum属性，
  //如果存在，则组件只会渲染一次，如果不存在，则会抛出一个warning异常。
  //也就是说，当服务器端和客户端渲染具有相同的props和相同DOM结构的组件时，该React组件只会渲染一次。
  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.warn('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

//window.devToolsExtension 是判断浏览器是否安装了redux的devtool插件
//如果浏览器安装了插件，就不需要再使用webpack来加载devtools这些插件了
if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools');
  render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );

  //配置热加载的入口文件，等文件改变后应该怎样重新渲染
  // if (module.hot) {
  //     module.hot.accept('./routes', () => {
  //           const getRoutes = require('./routes');
  //           const component2 = (
  //             <Router render={(props) => <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />} history={history}>
  //               {getRoutes(store)}
  //             </Router>
  //           );
  //           render(
  //             <Provider store={store} key="provider">
  //               <div>
  //                 {component}
  //                 <DevTools />
  //               </div>
  //             </Provider>,
  //             dest
  //           );
  //       });
  //   }
}
