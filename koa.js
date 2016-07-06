'use strict';

var http = require('http');
var path = require('path');
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var colors = require('colors');

//init
var app = koa();
var ip = '0.0.0.0';
var port = '8088';
//运行的目录,开发模式运行在源码目录
var viewDir = 'src';
//路由
var routes = require('./kao_routes');

//主题设置
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

//设置error事件的监听函数
app.on('error', function (err, ctx) {
  err.url = err.url || ctx.request.url;
  console.error(err, ctx);
});

/**
 * 向middleware数组添加Generator函数
 * Generator函数负责对HTTP请求进行各种加工，比如生成缓存、指定代理、请求重定向等等。
 */
app.use(function *(next) {
  this.body = 'Hello World!\n';

  //表示执行下一个中间件
  yield next;
});

app.use(function *(next) {
  this.body += 'Hello Koa\n';

  //表示执行下一个中间件
  yield next;
});

//注入 koa-router 中间件
routes(router, app, path.resolve(__dirname, viewDir));
app.use(router.routes());

//handle static files
app.use(serve(path.resolve(__dirname, viewDir), {
  maxage: 0
}));

//创建一个Server
app = http.createServer(app.callback());

//监听端口
app.listen(port, ip, function () {
  console.info("==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.", port, ip, port);
});

