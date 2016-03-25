'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Test from './components/test';
import Pubsub from 'pubsub-js';

window['TextObj'] = ReactDOM.render(<Test/>, document.getElementById('test'));

$('#add').on('click', function () {
  window['TextObj'].setState({productList: window['TextObj'].state.productList.concat({},{})});
});

//订阅事件,成功之后进项相应处理
Pubsub.subscribe('pubSubClick', function (msg, data) {
  // 获得选项信息，进行相应处理
  console.log(data);
  window['TextObj'].setState({productList: window['TextObj'].state.productList.concat({},{})});
});
