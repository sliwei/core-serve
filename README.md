# core-serve

[![deploy](https://github.com/sliwei/core-serve/actions/workflows/action.yaml/badge.svg)](https://github.com/sliwei/core-serve/actions/workflows/action.yaml)

> 基础服务中心

## Dev Setup

``` bash
# 安装
npm install

# 启动
npm run start

# 访问
localhost:xxxx

```

## Build Setup

``` bash

# 打包
npm run build

# 复制以下文件到线上环境
> app/server.js
> app/views
> app/public
> package.json

# 安装
npm i

# 启动
npm run pm2 || pm2 start app/server.js --name=core-serve

# 重启
pm2 restart core-serve || pm2 restart :id

```

## 项目结构

```

# 开发环境文件
blog-serve
  app
    config              // 配置
    controllers         // 操作层
    models              // 数据库模型
    public              // 资源文件夹
    routes              // 路由
    utils               // 工具
    views               // 模板
    index.js            // 开发主入口
    server.js           // 打包生成文件
  bin
    www.js              // 开发启动入口
  node_modules          // 插件包
  package.json          // 插件配置
  webpack.config.js     // 打包配置

# 线上环境文件(打包完成后，Jenkins或复制以下文件到线上运行即可)
blog-serve
  app
    public              // 资源文件夹
    views               // 模板
    server.js           // 打包生成文件
  node_modules          // 插件包
  package.json          // 插件配置

```

## 项目技术栈

字段|描述
----|----
ali-oss|阿里oss
koa2-cors|跨域
nunjucks|html模板
swagger-injector|接口文档
