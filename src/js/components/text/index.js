'use strict';

require('./css/text.less');

import React, {PropTypes} from 'react';
import Style from '../style';
import classNames from 'classnames';

const Text = React.createClass({
  propTypes: {
    numberOfLines: PropTypes.number,
    onPress: PropTypes.func,
    textString: PropTypes.string.isRequired
  },

  handleClick(event){
    this.props.onPress(event);
  },

  render() {
    const textClass = classNames({
      'lego-text':true,
      'lego-textTwoLine': this.props.numberOfLines === 2,
      'lego-textThreeLine': this.props.numberOfLines === 3,
      'lego-textFourLine': this.props.numberOfLines === 4
    });

    return (typeof (this.props.numberOfLines) === 'undefined' || (this.props.numberOfLines > 0)) ? (
      <div className={textClass} onClick={this.handleClick}>
        !{this.props.textString}
      </div>
    ) : null;
  }
});

export default Text;
