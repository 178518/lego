'use strict';

require('./css/comm-list.less');

import React, {PropTypes} from 'react';
import BaseList from '../base-list';
import Style from '../style';
import Image from '../image';
import Text from '../text';

const CommList = React.createClass({
  propTypes: {
    itemDataConfig: PropTypes.object.isRequired,
    itemAjaxConfig: PropTypes.object.isRequired,
    itemSuccessDataConfig: PropTypes.object.isRequired
  },

  mixins: [BaseList],

  render() {
    const children = [];

    this.state.itemList.map(function (item, i) {
      let uri = item,
        textString = item,
        numberOfLines = 3;

      this.props.itemDataConfig.imgUrl.forEach(function (key) {
        uri = uri[key];
      });

      this.props.itemDataConfig.subject.forEach(function (key) {
        textString = textString[key];
      });

      children.push(
        <div className="row-flex" key={i}>
          <div className="col-8">
            <Image uri={uri}/>
          </div>
          <div className="col-16">
            AAA<Text textString={textString} numberOfLines={numberOfLines}/>
          </div>
        </div>
      );
    }, this);

    return this.renderRoot({
      children
    });
  }
});

export default CommList;
