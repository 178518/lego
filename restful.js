var http = require('http');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

//创建http服务
var server = http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;
  var callback = qs.parse(url.parse(request.url).query).callback;

  //构造请求信息
  var options = {
    /*hostname: 'news-at.zhihu.com',
    port: 80,
    path: '/api/4/news/latest',
    method: 'GET'

    hostname: 'www.baidu.com',
     port: 80,
     path: '/',
     method: 'GET'*/

     hostname: 'api.t.sina.com.cn',
     port: 80,
     path: '/statuses/public_timeline.json?source=2043051649&count=5',
     method: 'GET'
  };

  console.log('uri: ' + uri);
  console.log('callback: ' + callback);

  if (uri === '/zhihu') {
    //发起一个客户端请求
    var client_request = http.request(options, function (res) {
      //响应状态，响应头信息
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');

      var body = '';
      //数据获取成功
      res.on('data', function (data) {
        body += data;
        console.log(body);
      });

      //数据获取结束
      res.on("end", function () {
        var jsonData = body,
          text = '';

        if (jsonData.length > 0) {
          response.writeHead(200, {'Content-Type': 'text/javasript'});

          if (callback) {
            text = callback + "(" + jsonData + ")";
          } else {
            text = jsonData;
          }

          console.log(text);

          response.write(text);
          response.end();
        }
      });

    });

    //客户端访问错误
    client_request.on('error', function (e) {
      console.log('problem with request: ' + e.message);
    });

    //关闭客户端链接
    client_request.end();
  }
});

server.listen(8088);

console.info("==> 🌎  Listening on port 8088");

