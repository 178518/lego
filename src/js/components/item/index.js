'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Image from '../image';
import Text from '../text';

let velocity;
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  velocity = require('velocity-animate');
} else {
  velocity = function velocityServerDummy() {
    const callback = arguments[arguments.length - 1];
    setImmediate(function () {
      callback();
    });
  };
}

const Item = React.createClass({
  propTypes: {
    itemDataConfig: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  },

  componentDidMount(){
    if (this.isMounted()) {
      let id = this.props.item;
      this.props.itemDataConfig.id.forEach(function (key) {
        id = id[key];
      });

      const node = ReactDOM.findDOMNode(this.refs[id]);
      if (!node) {
        return;
      }

      if (typeof this.props.item.animIndex !=='undefined') {
        node.style.visibility = 'hidden';

        // Stop animation before completion
        velocity(node, 'stop');

        // Start animation
        // http://ant.design/components/queue-anim/#/?_k=u8fw7x
        // http://easings.net/zh-cn
        velocity(node,
          {opacity: [1, 0], translateY: [0, 50]}, {
            delay: (100 * this.props.product.animIndex),
            duration: 500,
            easing:[0.6, -0.28, 0.735, 0.045],
            visibility: 'visible'
          }
        );
      }
    }
  },

  render() {
    let id = this.props.item,
      uri = this.props.item,
      textString = this.props.item,
      numberOfLines = 3,
      textClickCallBack = this.props.itemDataConfig.textClickCallBack;

    this.props.itemDataConfig.id.forEach(function (key) {
      id = id[key];
    });

    this.props.itemDataConfig.imgUrl.forEach(function (key) {
      uri = uri[key];
    });

    this.props.itemDataConfig.subject.forEach(function (key) {
      textString = textString[key];
    });

    return (
      <div className="row-flex" ref={id}>
        <div className="col-8">
          <Image uri={uri}/>
        </div>
        <div className="col-16">
          <Text textString={textString} onPress={textClickCallBack} numberOfLines={numberOfLines}/>
        </div>
      </div>
    );
  }
});

export default Item;
