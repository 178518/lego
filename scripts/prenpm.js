var fs = require('fs');
var path = require('path');
//提供直接执行系统命令的重要方法
var exec = require('child_process').exec;
var cwd = process.cwd();
var srcDir = path.resolve(process.cwd(), 'src');

function genEntries() {
  var jsDir = path.resolve(srcDir, 'js/components');
  var names = fs.readdirSync(jsDir);
  var map = [];

  names.forEach(function (name) {
    if (name !== '.DS_Store') {
      map.push(name);
    }
  });

  return map;
}

/**
 * 取得组件的对应关系
 * 取得组件的包名
 */
var entries = genEntries();

entries.forEach(function (name) {
  console.log("Process Floder '" + name + "' Start");

  var aeReactComponentsLess = path.join(cwd, 'src/js/components/' + name + '/css/' + name + '.less'),
    tempDir = 'lib/' + name + '/css';

  if (name === 'style') {
    exec('cp -r src/js/components/style lib/style', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }

  //判断文件是否存在
  fs.exists(aeReactComponentsLess, function (exists) {
    if (exists) {
      //建立目录
      fs.mkdirSync(tempDir, '0777');

      //将文件回写到babel的对应目录以便发布
      fs.createReadStream(aeReactComponentsLess)
        .pipe(fs.createWriteStream(path.join(cwd, 'lib/' + name + '/css/' + name + '.less')));
    }
  });

  console.log("Process Floder '" + name + "' End");
});

/**
 * 发布文件配置写入
 */
fs.createReadStream(path.join(cwd, 'package-prepublish.json'))
  .pipe(fs.createWriteStream(path.join(cwd, 'lib/package.json')));

console.log('prenpm done');
