'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import LazyLoadImages from '../util/LazyLoadImages';
//import JQ from 'jquery';
import JQ from 'npm-zepto';

const BaseList = {
  propTypes: {
    productListConfig: PropTypes.object,
    productAjaxConfig: PropTypes.object.isRequired,
    productSuccessDataConfig: PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      productListConfig: {
        productType: 1,
        productListColumnNum: 1
      }
    };
  },

  mixins: [LazyLoadImages],

  getInitialState() {
    return {
      productList: [],
      page: 1,
      isLast: false,
      goTop: false
    };
  },

  loadDataFromServer(){
    let params = this.props.productAjaxConfig.params;

    if (this.state.page > 1) {
      params[this.props.productSuccessDataConfig.page] = this.state.page;
    }

    JQ.ajax({
      url: this.props.productAjaxConfig.url,
      data: params,
      dataType: this.props.productAjaxConfig.dataType,
      type: this.props.productAjaxConfig.type,
      timeout: this.props.productAjaxConfig.timeout,
      success: function (data) {
        let productList = data;

        this.props.productSuccessDataConfig.productList.forEach(function (key) {
          productList = (productList[key] === undefined) ? [] : productList[key];
        });
        let isLast = (productList.length === 0);

        this.setState({productList: this.state.productList.concat(productList)}, function () {
          this.setState({isLast: isLast, page: this.state.page + 1}, function () {
            //延时执行绑定，防止多次请求
            clearTimeout(this.threadId);
            this.threadId = setTimeout(function () {
              //只在第一页且不是最后一页触发，setState不是同步的
              if (this.state.page === 2 && !isLast) {
                //数据绘制完成后触发滚动加载
                let loadingEle = ReactDOM.findDOMNode(this.refs.loading);
                //绑定Scroll的滚动事件
                this.add({
                  element: JQ(loadingEle),
                  distance: 100,
                  onRouse: function () {
                    (!this.state.isLast) && this.loadDataFromServer();
                  }.bind(this)
                });
              }
            }.bind(this), 1000);
          });

          //只在初始化的时候启用代理模式监听图片懒加载和滚动加载
          if (!isLast) {
            let productListEle = ReactDOM.findDOMNode(this.refs.productList);
            //图片懒加载触发
            this.lazyloadImagesInit({
              element: JQ(productListEle).find('img[data-src]'),
              distance: 100
            });
          }
        });
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  },

  //插入后
  componentDidMount(){
    if (this.isMounted()) {
      const _self = this;
      _self.loadDataFromServer();

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

  renderRoot(newProps) {
    const productListConfig = this.props.productListConfig;

    const loadingClass = classNames({
      'loading': !this.state.isLast
    });

    const lastClass = classNames({
      'isLast': !this.state.isLast
    });

    const goTop = classNames({
      'goTop': true,
      'hidden': !this.state.goTop
    });

    const productListClass = classNames({
      'productList': true,
      'productListTwoColumn': productListConfig.productListColumnNum === 2,
      'productListThreeColumnNum': productListConfig.productListColumnNum === 3,
      'productListFourColumnNum': productListConfig.productListColumnNum === 4
    });


    return (
      <div className={productListClass} ref="productList">
        <ul className="util-clearfix">
          {newProps.children}
        </ul>
        <div className={loadingClass} ref="loading"></div>
        <div className={lastClass}>is Last!</div>
        <a className={goTop}
           href="javascript:void(0);" onClick={this.handleGoTop}><img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAATlBMVEX////////////////xhGv2sKDveF0AAAD84dv////+8u/////////////////////ykHn3vK7////mLgTnMwrrUi7pQh3qSyfsWjjtZUZerkW5AAAAE3RSTlO8rJ1t8t34AMkIwTRQGIST69c/ZXIAagAAAwRJREFUWMOU04tyqyAQBuAlqEfU4A0R3/9FD21od8lPtP4z7UyG+GUvQv/OY/pB21EpIvUYrR56c/EAnWJ6JMioGb0F9lrRhyjd3wXN8KDTPAZzAiKn6DKKyStwwerKVS5/Ap+W/hz7vAYXRTeilgvQaLoZbc5AY+l2rPkMPgvb6Orq2LxbV+e3o6q7wm6eCCYPxtdOW6Rk3Da1MEgp0kl9c3BJ8XsIu//5FGaosQSaN2/eXhVVdftbcF29Kt7mN9EgaMa82WON2bG/dtrXmCM/GA2AmmRq91VHTcXUX7W7/FC/g0u22SY+4ZFj0scvNNnGFwZhwV3gr2P4J7cuX7UErZzSzg1h5FB2OUibQGi4i55v6TKtj2IHTRO/MdzvfuFxJ0GID/MLDsRpoL7TGhviDD+gUWI0cX4Fr3Krq1CMcxTDViaBQ/kredkrV/Px54cEigke6TH0kognh5jiC+zF/Y0D7MpeWeziGMW97iOYXbotNQxelf6aQtNbdgFJrmROp+hR/EcgphpmuRaSHYdUIHrfYBKhxCB6jqCWK97LXgKL4i4XrSPIO57WdSp6CQSRn+I9k5HjcG3JY7Aktk4O3hCPsEsn4DEIYqqj4yHSIMdblT0JoljJVQ6k4QA8BkGEQjRZee1a8ABEsZXXz9IoZ4EegijK2Y/E98SvXjzDHoNwig8qAWavtcs8Bll08tUWICe7Q42bCEHO5LjnIM8AhAAICXL40PJNEFv+35y9pDAIBUEUJcFZCA7MZ/87jfMjtAUW5C3gItp2V993590mQD8KZZMBLRsKOwNa2Px6GdBfj+aQAW0OtK8MaPuiwWZAGywjIAI6AhhSGdAh5RiNgI5RB30GdNAbRTKgUcSwFAAJS2OcEzjHOQPnAJwDp5HY86K3HUXiILQv2zKH9gvWijdrRWHxKaxmheXxivW2sIAXFEFBYgyaZVOz7GfQLBDPiiB5qqr1WFXtD7efz/dYVa3Pgkxr6j7kcCYkHwVlWpC6Be1cF+O5uv+HywWuP26nrj9+ltNm4sjalfcAAAAASUVORK5CYII="/></a>
      </div>
    );
  }
};

export default BaseList;
