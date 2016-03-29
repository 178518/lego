'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ScrollTrigger from '../util/ScrollTrigger';
import Pubsub from 'pubsub-js';
//import JQ from 'jquery';
import JQ from 'npm-zepto';

const BaseList = {
  propTypes: {
    itemAjaxConfig: PropTypes.object.isRequired,
    itemSuccessDataConfig: PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  mixins: [ScrollTrigger],

  getInitialState() {
    return {
      itemList: [],
      page: 1,
      hasScrollBind: true,
      ajaxLock: false,
      isLast: false,
      goTop: false
    };
  },

  loadDataFromServer(){
    let params = this.props.itemAjaxConfig.params;

    if (this.state.page > 1) {
      params[this.props.itemSuccessDataConfig.page] = this.state.page;
    }

    JQ.ajax({
      url: this.props.itemAjaxConfig.url,
      data: params,
      dataType: this.props.itemAjaxConfig.dataType,
      type: this.props.itemAjaxConfig.type,
      timeout: this.props.itemAjaxConfig.timeout,
      success: function (data) {
        let itemList = data;

        this.props.itemSuccessDataConfig.itemList.forEach(function (key) {
          itemList = (itemList[key] === undefined) ? [] : itemList[key];
        });
        let isLast = (itemList.length === 0);

        //取得item在队列里面的index
        itemList.map(function (item, i) {
          item.animIndex = i;
        });

        //传递过来的page+1取得下一页的数据
        this.setState({
          itemList: this.state.itemList.concat(itemList),
          isLast: isLast,
          page: params.page + 1
        }, function () {
          //如果不绑定滚动加载,直接返回
          if (!this.state.hasScrollBind) {
            return;
          }

          //只绑定一次，且不是最后一页
          if (!isLast) {
            //执行绑定前先初始化一次
            this.start();
            //数据绘制完成后触发滚动加载
            let loadingEle = ReactDOM.findDOMNode(this.refs.loading);
            //绑定Scroll的滚动事件
            this.add({
              element: JQ(loadingEle),
              distance: 100,
              onRouse: function () {
                if (!this.state.isLast) {
                  //延时执行绑定,防止多次请求,注意线程不能同名,同时这个间隔必须大于ScrollTrigger的触发事件
                  clearTimeout(this.ajaxThreadId);

                  this.ajaxThreadId = setTimeout(function () {
                    //对外publish 相应的事件消息
                    Pubsub.publish('getMoreData', {});
                    (!this.state.isLast) && this.loadDataFromServer();
                  }.bind(this), 55);

                }
              }.bind(this)
            });
          }
        });
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  },

  componentDidMount(){
    if (this.isMounted()) {
      const _self = this;
      this.loadDataFromServer();

      JQ(window).on('scroll', function () {
        const scrollTop = JQ(this).scrollTop(),
          windowHeight = JQ(this).height();

        if (scrollTop > windowHeight * 2) {
          _self.setState({goTop: true});
        } else {
          _self.setState({goTop: false});
        }
      });
    }
  },

  handleGoTop(){
    window.scrollTo(0, 0);
  },

  setQueryData(data){

  },

  renderRoot(newProps) {
    const loadingClass = classNames({
      'anticon anticon-loading': !this.state.isLast
    });

    const lastClass = classNames({
      'hide': !this.state.isLast
    });

    const goTop = classNames({
      'goTop': true,
      'hide': !this.state.goTop
    });

    return (
      <div>
        {newProps.children}
        <i className={loadingClass} ref="loading"></i>
        <div className={lastClass}>is Last!</div>
        <a className={goTop}
           href="javascript:void(0);" onClick={this.handleGoTop}><img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAATlBMVEX////////////////xhGv2sKDveF0AAAD84dv////+8u/////////////////////ykHn3vK7////mLgTnMwrrUi7pQh3qSyfsWjjtZUZerkW5AAAAE3RSTlO8rJ1t8t34AMkIwTRQGIST69c/ZXIAagAAAwRJREFUWMOU04tyqyAQBuAlqEfU4A0R3/9FD21od8lPtP4z7UyG+GUvQv/OY/pB21EpIvUYrR56c/EAnWJ6JMioGb0F9lrRhyjd3wXN8KDTPAZzAiKn6DKKyStwwerKVS5/Ap+W/hz7vAYXRTeilgvQaLoZbc5AY+l2rPkMPgvb6Orq2LxbV+e3o6q7wm6eCCYPxtdOW6Rk3Da1MEgp0kl9c3BJ8XsIu//5FGaosQSaN2/eXhVVdftbcF29Kt7mN9EgaMa82WON2bG/dtrXmCM/GA2AmmRq91VHTcXUX7W7/FC/g0u22SY+4ZFj0scvNNnGFwZhwV3gr2P4J7cuX7UErZzSzg1h5FB2OUibQGi4i55v6TKtj2IHTRO/MdzvfuFxJ0GID/MLDsRpoL7TGhviDD+gUWI0cX4Fr3Krq1CMcxTDViaBQ/kredkrV/Px54cEigke6TH0kognh5jiC+zF/Y0D7MpeWeziGMW97iOYXbotNQxelf6aQtNbdgFJrmROp+hR/EcgphpmuRaSHYdUIHrfYBKhxCB6jqCWK97LXgKL4i4XrSPIO57WdSp6CQSRn+I9k5HjcG3JY7Aktk4O3hCPsEsn4DEIYqqj4yHSIMdblT0JoljJVQ6k4QA8BkGEQjRZee1a8ABEsZXXz9IoZ4EegijK2Y/E98SvXjzDHoNwig8qAWavtcs8Bll08tUWICe7Q42bCEHO5LjnIM8AhAAICXL40PJNEFv+35y9pDAIBUEUJcFZCA7MZ/87jfMjtAUW5C3gItp2V993590mQD8KZZMBLRsKOwNa2Px6GdBfj+aQAW0OtK8MaPuiwWZAGywjIAI6AhhSGdAh5RiNgI5RB30GdNAbRTKgUcSwFAAJS2OcEzjHOQPnAJwDp5HY86K3HUXiILQv2zKH9gvWijdrRWHxKaxmheXxivW2sIAXFEFBYgyaZVOz7GfQLBDPiiB5qqr1WFXtD7efz/dYVa3Pgkxr6j7kcCYkHwVlWpC6Be1cF+O5uv+HywWuP26nrj9+ltNm4sjalfcAAAAASUVORK5CYII="/></a>
      </div>

    );
  }
};

export default BaseList;
