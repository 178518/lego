'use strict';

require('./css/comm-list.less');

import React, {PropTypes} from 'react';
import BaseList from '../base-list';
import Style from '../style';
import Item from '../item';

const CommList = React.createClass({
  propTypes: {
    itemDataConfig: PropTypes.object.isRequired,
    itemAjaxConfig: PropTypes.object.isRequired,
    itemSuccessDataConfig: PropTypes.object.isRequired
  },

  mixins: [BaseList],

  render() {
    const itemDataConfig = this.props.itemDataConfig;
    const children = [];

    this.state.itemList.map(function (item, i) {
      children.push(
        <Item key={i} itemDataConfig={itemDataConfig} item={item}/>
      );
    }, this);

    return this.renderRoot({
      children
    });
  }
});

export default CommList;
