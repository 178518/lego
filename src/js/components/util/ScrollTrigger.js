'use strict';

import React from 'react';
//import JQ from 'jquery';
import JQ from 'npm-zepto';

const ScrollTrigger = {
  getInitialState() {
    return {
      threadId: null, // 线程 ID
      /**
       * 私有变量
       */
      registerIndex: 0, // 记录序号
      lock: false, // 运行锁, 不能多次被运行
      registers: {} // 记录器, 登记的触发项
    };
  },

  start() {
    /**
     * 运行触发器
     */
    const _self = this;

    // 为避免重复重复执行, 如果已经锁上, 则停止处理
    if (this.state.lock) {
      return;
    }

    // 加运行锁
    this.setState({lock: true});

    // 激活一次
    this.activateAll();

    // 绑定滚动处理
    JQ(window).bind('scroll.scrollTrigger', function () {
      _self._scroll();
    });

    // 绑定修改窗口宽度处理
    JQ(window).bind('resize.scrollTrigger', function () {
      _self._scroll();
    });
  },

  stop() {
    // 注销滚动处理
    JQ(window).unbind('scroll.scrollTrigger');

    // 注销修改窗口宽度处理
    JQ(window).unbind('resize.scrollTrigger');

    // 解运行锁
    this.setState({lock: false});
  },

  add(options) {
    const _self = this;

    JQ(options.element).each(function () {
      var element = JQ(this);
      var key = _self.state.registerIndex++;
      element.data('scrollTrigger', key);

      _self.state.registers[key] = {
        element: element, // 处理对象
        distance: options.distance || 0, // 扩展敏感距离 (默认 0, 选填)
        onRouse: options.onRouse, // 记录触发方法
        options: options.options || null, // 记录项参数 (默认为空, 选填)
        oneoff: options.oneoff || false, // 是否是一次性的 (默认非一次性, 选填)
        viewportAdjustment: options.viewportAdjustment || 0 // 调节节点参考的视窗位置 (默认 0, 选填)
      };

      // 添加后立即执行一次
      _self._activate(_self.state.registers[key]);
    });
  },

  remove(options) {
    const _self = this;

    const elementArray = JQ(options.element);
    elementArray.each(function () {
      let element = JQ(this);
      let key = element.data('scrollTrigger');
      delete _self.state.registers[key];
    });
  },

  activate(options) {
    const _self = this;

    const elementArray = JQ(options.element);
    elementArray.each(function () {
      let element = JQ(this);
      let key = element.data('scrollTrigger');
      _self._activate(this.state.registers[key]);
    });
  },

  activateAll() {
    // 如果记录器内没有需要触发的对象, 则不做任何事情
    if (JQ.isEmptyObject(this.state.registers)) {
      return;
    }

    // 循环所有记录项
    for (var key in this.state.registers) {
      this._activate(this.state.registers[key]);
    }
  },

  _activate(register) {
    /**
     * 激活登记的节点
     */
    // 执行所有在范围内元素对应的事件
    if (this._isOnScope(register.element, register.distance, register.viewportAdjustment)) {
      this._rouse(register);
    }
  },

  _rouse(register) {
    /**
     * 触发登记的节点
     */
    register.onRouse.apply(register.element, [register.options]);

    // 如果这个元素的方法只能触发一次, 则记录为可销毁的对象
    if (register.oneoff) {
      // 注意: 因为元素对应的事件有可能是外部的销毁, 所以这些方法需要放在最后执行
      this.remove({element: register.element});
    }
  },

  _scroll() {
    /**
     * 滚动事件
     */
    const _self = this;

    clearTimeout(this.threadId);
    _self.threadId = setTimeout(function () {
      _self.activateAll();
      clearTimeout(_self.threadId);
    }, this.props.delay);
  },

  _isOnScope(element, distance, viewportAdjustment) {
    /**
     * 判断元素是否在触发范围内
     *
     * @param {jquery object} element 元素的 jQuery 对象.
     * @param {number} distance 距离敏感度.
     */
    var screenRect = this.getScreenRect();
    var elementRect = this.getElementRect(element);
    var distance = this._calculateArray(distance);
    var viewportAdjustment = this._calculateArray(viewportAdjustment);

    // 当上方扩展的敏感距离是无限大, 元素下边 > 显示上边 (元素进入显示区域或者在显示区域下方), 则表示在显示区域之内
    if (distance.top < 0 && elementRect.bottom > screenRect.top - viewportAdjustment.top) {
      return true;
    }

    // 当右方扩展的敏感距离是无限大, 元素左边 < 显示右边 (元素进入显示区域或者在显示区域上方), 则表示在显示区域之内
    if (distance.right < 0 && elementRect.left < screenRect.right + viewportAdjustment.right) {
      return true;
    }

    // 当下方扩展的敏感距离是无限大, 元素上边 < 显示下边 (元素进入显示区域或者在显示区域上方), 则表示在显示区域之内
    if (distance.bottom < 0 && elementRect.top < screenRect.bottom + viewportAdjustment.bottom) {
      return true;
    }

    // 当左方扩展的敏感距离是无限大, 元素左边 < 显示右边 (元素进入显示区域或者在显示区域上方), 则表示在显示区域之内
    if (distance.left < 0 && elementRect.right > screenRect.left - viewportAdjustment.left) {
      return true;
    }

    // 如果元素的下边在显示区域之上, 则表示不在显示区域之内
    if (elementRect.bottom + distance.bottom < screenRect.top - viewportAdjustment.top) {
      return false;
    }

    // 如果元素的左边在显示区域之右, 则表示不在显示区域之内
    if (elementRect.left - distance.left > screenRect.right + viewportAdjustment.right) {
      return false;
    }

    // 如果元素的上边在显示区域之下, 则表示不在显示区域之内
    if (elementRect.top - distance.top > screenRect.bottom + viewportAdjustment.bottom) {
      return false;
    }

    // 如果元素的右边在显示区域之左, 则表示不在显示区域之内
    if (elementRect.right + distance.right < screenRect.left - viewportAdjustment.left) {
      return false;
    }

    return true;
  },

  _calculateArray(distance) {
    /**
     * 计算距离四元数组
     */
    // 如果不是数组, 格式化为数组
    if (!JQ.isArray(distance)) {
      var val = parseInt(distance, 10);
      distance = [val, val, val, val];
    }

    // 处理数组
    switch (distance.length) {
      case 0:
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      case 1:
        var val = parseInt(distance[0], 10);
        return {
          top: val,
          right: val,
          bottom: val,
          left: val
        };
      case 2:
        var vertical = parseInt(distance[0], 10);
        var horizontal = parseInt(distance[1], 10);
        return {
          top: vertical,
          right: horizontal,
          bottom: vertical,
          left: horizontal
        };
      case 3:
        var horizontal = parseInt(distance[1], 10);
        return {
          top: parseInt(distance[0], 10),
          right: horizontal,
          bottom: parseInt(distance[2], 10),
          left: horizontal
        };
      default:
        return {
          top: parseInt(distance[0], 10),
          right: parseInt(distance[1], 10),
          bottom: parseInt(distance[2], 10),
          left: parseInt(distance[3], 10)
        };
    }
  },

  getElementRect(element) {
    let rect = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    let offset = element.offset();

    rect.top = offset.top;
    rect.right = offset.left + element.width();
    rect.bottom = offset.top + element.height();
    rect.left = offset.left;

    return rect;
  },

  getScreenRect(){
    let rect = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    let scrollPos = this.getScrollPos();

    rect.top = scrollPos.top;
    rect.right = scrollPos.left + JQ(window).width();
    rect.bottom = scrollPos.top + JQ(window).height();
    rect.left = scrollPos.left;

    return rect;
  },

  getScrollPos(){
    let viewport = JQ(window);
    let pos = {
      left: viewport.scrollLeft(),
      top: viewport.scrollTop()
    };

    return pos;
  }
};

export default ScrollTrigger;
