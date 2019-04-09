/**
 * lw 配置文件
 */
const oss = require('./oss');

module.exports = {
  port: 3005, // 端口
  oss: oss,
  cookieOptions: {
    maxAge: 1000 * 3600 * 48,
    path: '/',
    httpOnly: false
  },
};
