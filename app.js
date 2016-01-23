'use strict';

// load native modules
var http = require('http');
var path = require('path');

// load 3rd modules
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var colors = require('colors');

// load local modules
var pkg = require('./package.json');
var env = process.env.NODE_ENV;
var debug = !env || env === 'development';
var viewDir = debug ? 'src' : 'assets';

// init framework
var app = koa();
var port = 3000;

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
app.on('error', function(err, ctx) {
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

if(debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackDevConf = require('./webpack-dev.config');

    app.use(webpackDevMiddleware(webpack(webpackDevConf), {
        contentBase: webpackDevConf.output.path,
        publicPath: webpackDevConf.output.publicPath,
        hot: true,
        noInfo: false,
        historyApiFallback: true,
        // stats: webpackDevConf.devServer.stats
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

app.listen(port, '0.0.0.0', function() {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
});
