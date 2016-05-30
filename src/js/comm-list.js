'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import CommList from './components/comm-list';
//import CommList from 'rc-lego/comm-list';
import Pubsub from 'pubsub-js';
import fetch from './components/util/Fetch';
import jsonp from './components/util/Jsonp';

/*var itemAjaxConfig = {
  //url: 'https://api.weibo.com/2/statuses/public_timeline.json',
  url: 'http://www.yuuso.com/weibo',
  params: {
    count: 10
  },
  dataType: 'jsonp',
  type: 'get',
  timeout: 5000
};*/

var itemAjaxConfig = {
  //url: 'https://api.weibo.com/2/statuses/public_timeline.json',
  url: '//www.52pi.cc:9080/weibo?count=10',
  dataType: 'jsonp',
  type: 'get',
  timeout: 5000
};

var itemSuccessDataConfig = {
  //itemList: ['data', 'statuses']
  itemList: []
};

var itemDataConfig = {
  id: ['id'],
  subject: ['text'],
  imgUrl: ['user', 'profile_image_url'],
  textClickCallBack: function (event) {
    console.log(event);
  }
};

/*var params = new URLSearchParams();
params.append('widgetId', 101);
params.append('nodeId', 633);
params.append('displayType', 'DATA');
params.append('locale', 'en_US');
params.append('currency', 'USD');
params.append('userId', '226323522');
params.append('region', 'CN');
params.append('limit', 10);
params.append('offset', 0);
params.append('channel', 'mobile');
params.append('page', 1);

fetch('http://api.dos.aliexpress.com/aliexpress/data/doQuery.jsonp?'+params,{
  method: 'GET',
  mode:"cors",
  timeout:5000,
  credentials:"include"
}).then(function (res) {

}, function (e) {
  console.log("Fetch failed!", e);
});

fetch('/test.json',{
  method: 'GET',
  mode:"no-cors",
  timeout:5000,
  credentials:"include"//诸如cookie之类的凭证的请求
}).then(function (res) {
  console.log(res);

  if (res.ok) {
    console.log(res.headers.get('Content-Type'));
    console.log(res.headers.get('Date'));
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.type);
    console.log(res.url);

    //检查响应文本
    res.json().then(function(data){
      console.log(data);
    });
  } else {
    console.log("Looks like the response wasn't perfect, got status", res.status);
  }
}, function (e) {
  console.log("Fetch failed!", e);
});

jsonp('http://www.yuuso.com/weibo',{
  method: 'GET',
  timeout:5000,
  credentials:"include"//诸如cookie之类的凭证的请求
}).then(function (res) {
  if (res.ok) {
    //检查响应文本
    res.json().then(function(data){
      console.log(data);
    });
  } else {
    console.log("Looks like the response wasn't perfect, got status", res.status);
  }
}, function (e) {
  console.log("Fetch failed!", e);
});*/

window['commList'] = ReactDOM.render(<CommList itemAjaxConfig={itemAjaxConfig}
                                               itemSuccessDataConfig={itemSuccessDataConfig}
                                               itemDataConfig={itemDataConfig}/>, document.getElementById('commList'));

//订阅事件,成功之后进项相应处理
Pubsub.subscribe('getMoreData', function (msg, data) {
  // 获得选项信息，进行相应处理
  console.log(data);
});
