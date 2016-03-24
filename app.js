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
var webpackDevConf = require('./webpack-dev.config');

// load local modules
var pkg = require('./package.json');
/**
 * package.json里面配置的node模式,生产环境解析assets目录,开发环境是src目录
 */
var env = process.env.NODE_ENV;
var debug = !env || env === 'development';
console.log('If Current Node Is Debug Module ' + debug);
var viewDir = debug ? 'src' : 'assets';
var routes = require('./routes');

// init framework
var app = koa();
var ip = webpackConf.ip;
var port = webpackConf.port;

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
  app.use(webpackDevMiddleware(webpack(webpackDevConf), {
    publicPath: webpackDevConf.output.publicPath,
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

app.listen(port, webpackDevConf.ip, function () {
  console.info("==> 🌎  Listening on port %s. Open up http://%s:%s/ in your browser.", port, ip, port);

  //open('http://localhost:'+port);
});
