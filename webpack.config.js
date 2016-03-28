'use strict';

var genConf = require('./make-webpack.config');

/**
 * true   开发环境
 * false  生产环境
 */
module.exports = genConf({debug: false});
//module.exports = genConf({debug: true});
