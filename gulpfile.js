/*
 * @Author: dmyang
 * @Date:   2015-06-16 15:19:59
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-08-27 11:16:12
 */

'use strict';

var gulp = require('gulp');
var webpack = require('webpack');

var gutil = require('gulp-util');

// 引入组件
var jshint = require('gulp-jshint'),
  eslint = require('gulp-eslint'),
  notify = require('gulp-notify'),
  stylish = require('jshint-stylish'),
  //esstylish = require('eslint-stylish'),
  replace = require('gulp-replace'),      // 替换
  htmlmin = require('gulp-htmlmin'),      // html压缩
  minifycss = require('gulp-minify-css'), // CSS压缩
  uglify = require('gulp-uglify'),        // js压缩
  concat = require('gulp-concat'),        // 合并文件
  rename = require('gulp-rename'),        // 重命名
  clean = require('gulp-clean');          //清空文件夹

var webpackConf = require('./webpack.config');
//var webpackDevConf = require('./webpack-dev.config');

var src = process.cwd() + '/src';
var assets = process.cwd() + '/assets';

// js check
gulp.task('hint', function () {
  return gulp.src([
    src + '/js/**/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('lint', function () {
  return gulp.src('/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

//压缩css
gulp.task('minifycss', function () {
  return gulp.src(assets + '/css/*/*.css')    //需要操作的文件
    //.pipe(concat('all.css'))             //合并所有css到all.css
    .pipe(rename({suffix: '.min'}))     //rename压缩后的文件名
    .pipe(minifycss())                  //执行压缩
    .pipe(gulp.dest(assets + '/css'))     //输出文件夹
    .pipe(notify({message: '样式文件处理完成'}));
});

//压缩，合并 js
gulp.task('minifyjs', function () {
  return gulp.src(assets + '/js/*/*.js')      //需要操作的文件
    //.pipe(concat('all.js'))             //合并所有js到all.js
    .pipe(rename({suffix: '.min'}))     //rename压缩后的文件名
    .pipe(uglify())                     //压缩
    .pipe(gulp.dest(assets + '/js'))      //输出到文件夹
    .pipe(notify({message: 'JS文件处理完成'}));
});

// clean assets,先执行hint，在执行clean
//noinspection Eslint
gulp.task('clean', ['lint'], function () {
  return gulp.src(assets, {read: true}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], function (done) {
  webpack(webpackConf, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({colors: true}));
    done();
  });
});

// html process
gulp.task('default', ['pack'], function () {
  /**
   * 对生产之后的文件进行压缩
   */
  gulp.start('minifycss', 'minifyjs');

  /**
   * 执行HTML文件替换
   */
  return gulp
    .src(assets + '/*.html')
    .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
    // @see https://github.com/kangax/html-minifier
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(assets));
});

// run HMR on `cli` mode
// @see http://webpack.github.io/docs/webpack-dev-server.html
gulp.task('hmr', function (done) {
  var WebpackDevServer = require('webpack-dev-server');
  var compiler = webpack(webpackConf);

  var devSvr = new WebpackDevServer(compiler, {
    contentBase: webpackConf.output.path,
    publicPath: webpackConf.output.publicPath,
    hot: true,
    noInfo: false,
    //historyApiFallback: true,
    stats: {
      cached: false,
      colors: true
    }
  });

  devSvr.listen(webpackConf.hmrPort, webpackConf.ip, function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);

    gutil.log('[webpack-dev-server]',
      'http://'+webpackConf.ip+':'+webpackConf.hmrPort+'/webpack-dev-server/index.html');

  });
});
