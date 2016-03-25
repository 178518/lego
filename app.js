'use strict';

// load native modules
var http = require('http');
var path = require('path');

// load 3rd modules
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var colors = require('colors');
var open = require('open');

var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpack = require('webpack');
var webpackConf = require('./webpack.config');
//var webpackDevConf = require('./webpack-dev.config');

// load local modules
var pkg = require('./package.json');
/**
 * package.json里面配置的node模式,生产环境解析assets目录,开发环境是src目录
 */
var env = process.env.NODE_ENV;
var debug = !env || env === 'development';
console.log('If Current Node Is Debug Module ' + debug);
//运行的目录,开发模式运行在源码目录
var viewDir = debug ? 'src' : webpackConf.assets;
var routes = require('./routes');

// init framework
var app = koa();

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

// basic settings
app.keys = [pkg.name, pkg.description];
app.proxy = true;

// global events listen
app.on('error', function (err, ctx) {
  err.url = err.url || ctx.request.url;
  console.error(err, ctx);
});

// handle favicon.ico
app.use(function*(next) {
  if (this.url.match(/favicon\.ico$/)) this.body = '';
  yield next;
});

// logger
app.use(function*(next) {
  console.log(this.method.info, this.url);
  yield next;
});

// use routes
routes(router, app, path.resolve(__dirname, viewDir));
app.use(router.routes());

if (debug) {
  /**
   * Webpack本身具有运行时模块替换功能，称之为Hot Module Replacement (HMR)。
   * 当某个模块代码发生变化时，Webpack实时打包将其推送到页面并进行替换，从而无需刷新页面就实现代码替换。
   * 这个过程相对比较复杂，需要进行多方面考虑和配置。
   * 而现在针对React出现了一个第三方react-hot-loader加载器，使用这个加载器就可以轻松实现React组件的热替换，非常方便。
   * 其实正是因为React的每一次更新都是全局刷新的虚拟DOM机制，让React组件的热替换可以成为通用的加载器，从而极大提高开发效率。
   * 要使用react-hot-loader，首先通过npm进行安装：
   * 为了热加载React组件，我们需要在前端页面中加入相应的代码，
   * 用以接收Webpack推送过来的代码模块，进而可以通知所有相关React组件进行重新Render。
   */
  app.use(webpackDevMiddleware(webpack(webpackConf), {
    publicPath: webpackConf.output.publicPath,
    hot: true,
    noInfo: false,
    historyApiFallback: true,
    stats: {
      cached: false,
      colors: true
    }
  }));
}

// handle static files
app.use(serve(path.resolve(__dirname, viewDir), {
  maxage: 0
}));

app = http.createServer(app.callback());

app.listen(webpackConf.port, webpackConf.ip, function () {
  console.info("==> 🌎  Listening on port %s. Open up http://%s:%s/ in your browser.", webpackConf.port, webpackConf.ip, webpackConf.port);

  //open('http://localhost:'+port);
});
