var koa = require('koa');
var View = require('./view');
var app = module.exports = koa();

app.use(function* () {
  this.type = 'html';
  this.body = new View(this);
});

app.listen(3000);

console.info("==> 🌎  Listening on port 3000");
