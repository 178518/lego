'use strict';

require('./css/loading.less');

import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true
    };
  }

  componentDidMount() {
  }

  render() {
    const props = this.props;
    const {prefixCls,prefixPreloaderCls,prefixSpinnerCls,type,color,className, ...restProps} = props;

    const classString = classNames({
      [prefixCls]: true,
      [className]: className
    });

    const classStringPre = classNames({
      [prefixPreloaderCls]: true,
      [`${type}`]: true,
      [`active`]: this.state.show ,
      [className]: className
    });

    const classStringSpinner = classNames({
      [prefixSpinnerCls]: true,
      [`spinner-${color}-only`]: true,
      [className]: className
    });

    return (
      <div className={classString} {...restProps}>
        <div className={classStringPre}>
          <div className={classStringSpinner}>
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Loading.propTypes = {
  prefixCls: PropTypes.string,
  prefixPreloaderCls: PropTypes.string,
  prefixSpinnerCls: PropTypes.string,
  type: PropTypes.string,
  active: PropTypes.string,
  color: PropTypes.string
};

Loading.defaultProps = {
  prefixCls: 'rc-loading',
  prefixPreloaderCls: 'preloader-wrapper',
  prefixSpinnerCls: 'spinner-layer',
  type: 'small',
  active: 'active',
  color: 'red'
};
