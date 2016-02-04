'use strict';

var fs = require('fs');

var render = require('koa-ejs');
var proxy = require('koa-proxy');

module.exports = function (router, app, staticDir) {
  //首页路由
  router.get('/', function*() {
    var pages = fs.readdirSync(staticDir);

    pages = pages.filter(function (page) {
      return /\.html$/.test(page);
    });

    yield this.render('home', {pages: pages || []});
  });

  render(app, {
    root: __dirname,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
  });
};
