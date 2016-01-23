'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
//import CommList from './components/comm-list';
import CommList from 'rc-lego/comm-list';
import JQ from 'jquery';

var itemAjaxConfig = {
  url: 'https://api.weibo.com/2/statuses/public_timeline.json',
  params: {
    source: 1437421778
  },
  dataType: 'jsonp',
  type: 'get',
  timeout: 5000
};

var itemSuccessDataConfig = {
  itemList: ['data','statuses']
};

var itemDataConfig = {
  id: 'id',
  subject: ['text'],
  imgUrl: ['user','profile_image_url']
};

ReactDOM.render(<CommList itemAjaxConfig={itemAjaxConfig}
                          itemSuccessDataConfig={itemSuccessDataConfig} itemDataConfig={itemDataConfig}/>, JQ('#commList')[0]);
