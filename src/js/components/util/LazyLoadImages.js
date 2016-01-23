'use strict';

import React from 'react';
import ScrollTrigger from './ScrollTrigger';
import Image from 'rc-lego/ScrollTrigger';
import JQ from 'jquery';

const LazyLoadImages = {
  getDefaultProps() {
    return {
      // 延迟触发时间
      delay: 400,
      srcAttribute: 'data-src', // 存储图片 URL 的属性
      distance: 0, // 各图片的扩展敏感距离
      prepareLoad: null // 加载每个图片前都会执行的事件
    };
  },

  mixins: [ScrollTrigger],

  lazyloadImagesInit(options){
    //执行绑定前先初始化一次
    this.start();

    let srcAttribute = options.srcAttribute || this.props.srcAttribute;
    let prepareLoad = options.prepareLoad || this.props.prepareLoad;

    this.add({
      element: options.element,
      distance: options.distance || this.props.distance,
      onRouse: function () {
        let $currentEle = JQ(this);
        // 如果存在存储图片 URL 的属性, 将它的值赋给 src 属性 this 指向被操作图片
        if ($currentEle.is('img[' + srcAttribute + ']')) {

          // 加载前的处理
          (typeof prepareLoad == 'function') && prepareLoad.apply(this);

          // 加载图片
          $currentEle.attr('src', $currentEle.attr(srcAttribute)).removeAttr(srcAttribute);
        }
      },
      oneoff: true
    });
  }
};

export default LazyLoadImages;
