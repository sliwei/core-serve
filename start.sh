#!/bin/sh
# 替换数据库
sed -i "s/##REGION##/${REGION}/" app/server.js
sed -i "s/##ACCESS_KEY_ID##/${ACCESS_KEY_ID}/" app/server.js
sed -i "s/##ACCESS_KEY_SECRET##/${ACCESS_KEY_SECRET}/" app/server.js
sed -i "s/##BUCKET##/${BUCKET}/" app/server.js
# 启动应用
node app/server.js
