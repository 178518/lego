var http = require('http');
var koa = require('koa');
var colors = require('colors');

//init
var app = koa();
var ip = '0.0.0.0';
var port = '8088';

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
  this.body = 'Hello World!!!\n';

  yield next;
});

app.use(function *(next) {
  this.body += 'Hello Koa\n';

  yield next;
});

//创建一个Server
app = http.createServer(app.callback());

//监听端口
app.listen(port, ip, function () {
  console.info("==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.", port, ip, port);
});

