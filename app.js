require('babel-polyfill');
const http = require('http');
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const favicon = require('koa-favicon');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const colors = require('colors');
const {resolve} = require('path');
const swagger = require('swagger-injector');
const fs = require('fs');

const {CustomError, HttpError} = require('./routes/tool/error');
const conf = require('./config');
const index = require('./routes');

// 允许上传文件
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 1000 * 1024 * 1024, // 设置上传文件大小最大限制
  }
}));

// 网站图标
app.use(favicon(resolve(__dirname, './public', 'favicon.ico')));

// 允许跨域(允许所有就不能使用cookie)
app.use(cors({
  origin: function (ctx) {
    // return 'http://192.168.1.137:8080';
    return '*';
  },
  exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
  maxAge: 3600,
  // credentials: true,
  allowMethods: ['GET', 'PUT', 'POST'],
  allowHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// 返回美化json
app.use(json());

// koa-logger
app.use(logger());

// 资源文件
app.use(require('koa-static')(resolve(__dirname, './public')));

// 模板引擎
app.use(views(resolve(__dirname, './views'), {map: {html: 'nunjucks'}}));

// 加入cookie.get、set及自定义返回格式
app.use(async (ctx, next) => {
  let msg = {
    0: '失败',
    1: '验证码错误',
    200: '成功',
    400: '请求出错',
    401: '未授权的请求',
    403: '禁止：禁止执行访问',
    404: '找不到：请检查URL以确保路径正确',
    500: '服务器的内部错误',
    503: '服务不可用'
  };
  ctx.json = dat => {
    !dat.message && (dat.message = msg[dat.code]);
    return dat;
  };

  // 自定义返回格式
  ctx.DATA = {
    data: {},
    message: '',
    code: 200,
  };
  await next();
});

// swagger
app.use(swagger.koa({
  path: resolve(__dirname, './public', 'swagger.json'),
}));

// error 业务逻辑错误
app.use((ctx, next) => {
  return next().catch((err) => {
    console.log(err);
    let code = 0;
    let msg = 'unknown error';
    if (err instanceof CustomError || err instanceof HttpError) {
      const res = err.getCodeMsg();
      code = err instanceof HttpError ? res.code : 200;
      msg = res.msg
    }
    ctx.DATA.code = code;
    ctx.DATA.message = msg;
    ctx.body = ctx.DATA;
  })
});

// routes
app.use(index.routes(), index.allowedMethods());

// koa error-handling 服务端、http错误
app.on('error', (err, ctx) => {
  if (!err.status) err.status = 500;
  console.log(`${err.stack}`.red);

  /*----错误日志备份----*/
  let logPath = resolve(__dirname, './log', 'error.log');
  let json = {};
  json.time = new Date().toLocaleString();
  json.url = ctx.url;
  json.type = ctx.method;
  json.request = ctx.request;
  if (ctx.method === 'GET') {
    json.parm = ctx.query;
  } else {
    json.parm = ctx.request.body;
  }
  json.status = err.status;
  json.message = err.message;
  json = JSON.stringify(json);
  let log = '';
  log += json + ',';
  log += '\r\n';
  // log += err.stack;
  // log += '\r\n';
  fs.writeFile(logPath, log, {'flag': 'a'});
  /*----错误日志备份----*/
});

// start
const port = conf.port || '3000';
const server = http.createServer(app.callback());

server.listen(port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(port + ' is already in use');
      process.exit(1);
    default:
      throw error
  }
});

server.on('listening', () => {
  console.log('Listening on port: %d', port)
});
