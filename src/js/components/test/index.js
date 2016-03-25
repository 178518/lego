'use strict';

import React, {PropTypes} from 'react';
import Pubsub from 'pubsub-js';

const Text = React.createClass({
  propTypes: {},

  getInitialState() {
    return {
      productList: [{},{},{}]
    };
  },

  handleClick(event){
    // 发布事件
    Pubsub.publish('pubSubClick', {});
  },

  render() {

    const productList = [];

    this.state.productList.map(function (item, i) {
      productList.push(
        <li>AAA</li>
      );
    }, this);

    return (
      <div>
        <div onClick={this.handleClick}>PubSub</div>
        <ul>{productList}</ul>
      </div>
    );
  }
});

export default Text;
