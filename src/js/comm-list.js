'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import CommList from './components/comm-list';
//import CommList from 'rc-lego/comm-list';
import Pubsub from 'pubsub-js';

var itemAjaxConfig = {
  url: 'https://api.weibo.com/2/statuses/public_timeline.json',
  params: {
    source: 2043051649
  },
  dataType: 'jsonp',
  type: 'get',
  timeout: 5000
};

var itemSuccessDataConfig = {
  itemList: ['data', 'statuses']
};

var itemDataConfig = {
  id: 'id',
  subject: ['text'],
  imgUrl: ['user', 'profile_image_url'],
  textClickCallBack:function(event){
    console.log(event);
  }
};

/*var itemAjaxConfig = {
 url: 'http://demo.lego.com:8088/zhihu',
 params: {
 page: 1
 },
 dataType: 'jsonp',
 type: 'get',
 timeout: 5000
 };

 var itemSuccessDataConfig = {
 itemList: ['stories']
 };

 var itemDataConfig = {
 id: 'id',
 subject: ['title'],
 imgUrl: ['images','0']
 };*/

window['commList'] = ReactDOM.render(<CommList itemAjaxConfig={itemAjaxConfig}
                          itemSuccessDataConfig={itemSuccessDataConfig}
                          itemDataConfig={itemDataConfig}/>, document.getElementById('commList'));

//订阅事件,成功之后进项相应处理
Pubsub.subscribe('getMoreData', function (msg, data) {
  // 获得选项信息，进行相应处理
  console.log(data);
});
