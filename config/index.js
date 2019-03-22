/**
 * lw 服务器配置
 */
const db = require('./mysql');
const oss = require('./oss');

module.exports = {
    port: 3000,         // 端口
    socket_port: 4000,  // socket端口
    socket_safe: false, // socket 连接如果是https协议，则需要证书
    ssh_options: {      // https证书
        key: '/etc/letsencrypt/live/api.bstu.cn/privkey.pem',
        ca: '/etc/letsencrypt/live/api.bstu.cn/chain.pem',
        cert: '/etc/letsencrypt/live/api.bstu.cn/fullchain.pem'
    },
    db: db,
    tokenName: 'yun.bstu.cn.server', // 验证码生成加自定义字符
    md5Name: 'yun.bstu.cn.server',
    verificationSta: true, // 启用验证码BB
    cookieOptions: {
        // maxAge: 1000 * 3600 * 48,
        maxAge: 1000 * 20,
        path: '/',
        httpOnly: false
    },
    oss: oss,
};