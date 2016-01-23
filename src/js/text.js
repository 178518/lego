'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
//import Text from './components/text';
import Text from 'rc-lego/text';

var num=2;
function callback(event) {
  console.log(event);
}

ReactDOM.render(<Text textString='习近平参观中埃科技展 为百度等中企点赞,习近平参观中埃科技展 为百度等中企点赞,习近平参观中埃科技展 为百度等中企点赞,习近平参观中埃科技展 为百度等中企点赞,习近平参观中埃科技展 为百度等中企点赞'
                      numberOfLines={num} onPress={callback}/>, document.getElementById('myText'));
