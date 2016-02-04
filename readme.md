#说明

基于React的组件化实践

##安装步骤
***

### 1、使用cnpm代理npm，并切换到国内源
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### 2、安装webpack和各种依赖
推荐"node-dev"这个工具，代码改动会自动重启node进程

```
cnpm install -g webpack gulp node-dev
```
### 3、安装本地热部署和各种依赖工具包
>webpack必选安装到本地，前面只是安装webpack命令，这里需要特别注意

```
cnpm install
```

### 5、编译工程
```
cnpm run build
基于gulp对整个工程进行线下预处理，预编译，编译后的文件会自动抽取公共的css/js文件到comm，同时基于内容进行hash解决线上缓存问题。
```

### 6、启动应用
```
cnpm run start
cnpm run hmr
```

### 7、启动应用，模拟生产环境
```
cnpm run production
```

### 8、tnpm包预处理
```
cnpm run prepublish
```
