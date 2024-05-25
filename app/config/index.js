/**
 * 配置文件
 */
require('dotenv').config()

if (!process.env.ENV) {
  console.error('请设置环境变量ENV,MODE,DATABASE,USERNAME,PASSWORD,HOST,PORT')
}

const config = {
  mode: process.env.MODE, // development || production
  port: 3000, // 端口
  cookieOptions: {
    maxAge: 1000 * 3600 * 48,
    path: '/',
    httpOnly: false
  },
  env: 'live',
  api_url: {
  },
  oss: {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    bucket: process.env.BUCKET
  }
}

console.log('模式:', process.env.MODE)
console.log('环境:', process.env.ENV)
console.log('Listening on port: http://localhost:%d', config.port)

module.exports = config
