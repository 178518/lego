'use strict';

var fs = require('fs');
var render = require('koa-ejs');
var proxy = require('koa-proxy');

module.exports = function (router, app, staticDir) {
  //首页路由
  router.get('/', function*(next) {
    var pages = fs.readdirSync(staticDir);

    pages = pages.filter(function (page) {
      return /\.html$/.test(page);
    });

    yield this.render('home', {pages: pages || []});
  });

  //404 route
  router.get('/404', function*(next) {
    this.body = 'page not found';
  });

  //500 route
  router.get('/500', function*(next) {
    this.body = 'internal server error';
  });

  //获取url后面的参数
  router.param('blogId', function *(blogId, next) {
    this.blogId = Number(blogId);

    //判断是否纯数字
    if (isNaN(this.blogId)) {
      /*this.body = 'param error';
       return;
       this.status = 404;
       this.body = '';
       return;*/

      this.redirect('/404');
    }

    yield next;
  }).get('/blog/:blogId', function*(next) {
    //:id 是路由通配规则，示例请求 /detail/123 就会进入该 generator function 逻辑
    this.body = this.params.blogId;
  });

  //获取url后面的参数
  router.param('categoryId', 'newsId', function *(categoryId, newsId, next) {
    this.categoryId = Number(categoryId);
    this.newsId = Number(newsId);

    //判断是否纯数字
    if (isNaN(this.categoryId) || isNaN(this.newsId)) {
      /*this.body = 'param error';
       return;
       this.status = 404;
       this.body = '';
       return;*/

      this.redirect('/404');
    }

    yield next;
  }).get('/news/:categoryId/:newsId', function*(next) {
    this.body = this.params.categoryId;
    this.body += '<br>';
    this.body += this.params.newsId;
  });

  render(app, {
    root: __dirname,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
  });
};
