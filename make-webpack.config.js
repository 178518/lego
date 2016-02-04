'use strict';

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var _ = require('lodash');

var AssetsPlugin = require('assets-webpack-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var srcDir = path.resolve(process.cwd(), 'src');
//编译后的目录
var assets = 'assets/';
var IP = '0.0.0.0';
var PORT = 3000;
var HMRPORT = 4000;

var excludeFromStats = [
  /node_modules[\\\/]/
];

function makeConf(options) {
  options = options || {};

  /**
   * package.json 里面start读dev配置，production读正式配置
   * @type {boolean}
   */
  var debug = options.debug;
  var entries = genEntries(debug);
  var chunks = Object.keys(entries);

  /**
   * hash
   * chunkhash
   * contenthash
   */
  var config = {
    ip: IP,
    port: PORT,
    hmrPort: HMRPORT,
    entry: entries,
    output: {
      // 在debug模式下，__build目录是虚拟的，webpack的dev server存储在内存里
      path: path.resolve(debug ? '__build' : assets),//打包好的资源的存放位置,__dirname不能少
      publicPath: debug ? '/__build/' : '',//用于配置文件发布路径，如CDN或本地服务器
      /**
       * [hash]：代表编译hash值，与模块集的代码有关，如果模块集的代码有修改，hash值也会变
       * 这个在生成环境里可以解决客户端的缓存问题
       * [chunkhash]：代表模块集名称的hash值，注意chunkhash与hash不能同时使用
       * [id], chunk的id
       * [name], chunk名
       * [hash], 编译哈希值
       * [chunkhash], chunk的hash值
       */
      filename: debug ? 'js/[name]/[name].js' : 'js/[name]/[name].[hash].js'//生产的打包文件名
      //filename: debug ? 'js/[name]/[name].js' : 'js/[name]/[name].[chunkhash:8].js'//生产的打包文件名
      //chunkFilename: debug ? 'js/[name]/[name].js' : 'js/[name]/[name].[chunkhash:8].js',
      //hotUpdateChunkFilename: debug ?'js/[name]/[name].js' : 'js/[name]/[name].[chunkhash:8].js'
    },
    //devtool: 'source-map',
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        {
          //对于小型的图片资源，也可以将其进行统一打包，由url-loader实现，代码中url-loader?limit=8192含义就是对于所有小于8192字节的图片资源也进行打包。
          test: /\.(png|jpg)$/,
          loader: 'url-loader?limit=81920'
        }, {
          //凡是.js结尾的文件都是用babel-loader做处理，而.jsx结尾的文件会先经过jsx-loader处理，然后经过babel-loader处理。
          test: /\.jsx?$/,
          loaders: ['jsx?harmony']
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'react-hot!jsx-loader?harmony'
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: [/\.js$/, /\.jsx$/],
          loaders: ['react-hot', 'babel'],
          exclude: /node_modules/
        }
      ]
    },
    //最后配置一下plugins，加上热替换的插件和防止报错的插件
    plugins: [
    /**
     * 这里插件配件了chunkhash8js不生效，原因暂不清楚 
     */
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      /*new CommonsChunkPlugin({
       name: 'comm', // 将公共模块提取，生成名为`comm`的chunk
       chunks: chunks,
       minChunks: chunks.length // 提取所有entry共同依赖的模块
       }),*/
      new AssetsPlugin({
        filename: 'assets.map.json',
        fullPath: true,
        update: false
      })
    ]/*,
     devServer: {
     port: 3000,
     inline: true,
     historyApiFallback: true,
     colors: true,
     stats: {
     cached: false,
     exclude: excludeFromStats,
     colors: true
     }
     }*/
  };

  if (debug) {
    // 开发阶段，css直接内嵌,多个加载器通过!连接
    var cssLoader = {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader'
    };
    var lessLoader = {
      test: /\.less/,
      loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
    };

    config.module.loaders.push(cssLoader);
    config.module.loaders.push(lessLoader);
  } else {
    // 编译阶段，css分离出来单独引入
    var cssLoader = {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
    };
    //这里需要注意顺序，autoprefixer-loader需要在less-loader前面
    var lessLoader = {
      test: /\.less/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
    };

    config.module.loaders.push(cssLoader);
    config.module.loaders.push(lessLoader);

    //css文件独立出来
    config.plugins.push(new ExtractTextPlugin('css/[name]/[name].[contenthash:8].css'));
    //config.plugins.push(new ExtractTextPlugin('css/[name].css'));
  }

  // 自动生成入口文件，入口js名必须和入口文件名相同
  // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
  var pages = fs.readdirSync(srcDir);

  pages.forEach(function (filename) {
    var m = filename.match(/(.+)\.html$/);

    if (m) {
      var conf = {
        template: path.resolve(srcDir, filename),
        filename: filename
      };

      if (m[1] in config.entry) {
        conf.inject = 'body';
        conf.chunks = ['comm', m[1]];
      }

      config.plugins.push(new HtmlWebpackPlugin(conf));
    }
  });

  return config;
}

function genEntries(debug) {
  var jsDir = path.resolve(srcDir, 'js');
  var names = fs.readdirSync(jsDir);
  var map = {};

  names.forEach(function (name) {
    var m = name.match(/(.+)\.js$/);
    var entry = m ? m[1] : '';

    /**
     * 热加载替换部署模块
     */
    var entryPath = '';
    if (debug) {
      entryPath = entry ? ['webpack-dev-server/client?http://' + IP + ':' + HMRPORT, 'webpack/hot/only-dev-server', path.resolve(jsDir, name)] : '';
    } else {
      entryPath = entry ? [path.resolve(jsDir, name)] : '';
    }

    //var entryPath = entry ? [path.resolve(jsDir, name)] : '';

    if (entry) map[entry] = entryPath;
  });

  //map['index'] = './scripts/importCss.js';

  return map;
}

module.exports = makeConf;
