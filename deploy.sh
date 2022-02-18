#local
#CONF="/Users/awei/key/"
#ROOT="/Users/awei/project/wei/core-serve"
#RUN="/Users/awei/project/wei/core-serve/run"

#online
CONF="/data/config"
ROOT="/data/git/core-serve"
RUN="/data/wwwroot/core-serve"

yarn
cp -rf ${CONF}/oss.js ${ROOT}/app/config/oss.js
yarn build
mkdir -p ${RUN}
mkdir -p ${RUN}/app
cp -rf ${ROOT}/app/public ${RUN}/app/public
cp -rf ${ROOT}/app/views ${RUN}/app/views
cp -rf ${ROOT}/app/server.js ${RUN}/app/server.js
cp -rf ${ROOT}/package.json ${RUN}/package.json
cd ${RUN}
pm2 info core-serve
if [[ "$?" != "0" ]]; then
  yarn pm2
  echo "The first startup succeeded!"
else
  yarn restart
  echo "Restart the success!"
fi
