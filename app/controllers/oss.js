const fs = require('fs');
const oss = require('../utils/tool/oss');
const {getDateStr, randomString, getFileType} = require('../utils/tool');
const {CustomError} = require('../utils/tool/error');

/**
 * lw 上传
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file[0];
  let stream = fs.createReadStream(file.path);
  let type = getFileType(file.name);
  let name = `images/${getDateStr()}/${randomString(16)}.${type}`;
  let res = await oss().putStream(name, stream);
  ctx.DATA.data = {
    ...res,
    ossUrl: res.url,
    url: `http://oss.bstu.cn/${res.name}`,
  };
  ctx.body = ctx.DATA;
};

/**
 * lw 获取oss列表
 */
const list = async (ctx, next) => {
  const name = ctx.query.name;
  ctx.DATA.data = await oss().list({
    prefix: name,
    delimiter: '/'
  });
  if (ctx.DATA.data.res.status !== 200) {
    throw new CustomError(0, '文件查找失败');
  }
  delete ctx.DATA.data.res;
  ctx.body = ctx.DATA;
};

/**
 * lw 获取文件下载链接
 */
const url = async (ctx) => {
  const name = ctx.query.name;
  ctx.DATA.data = oss().signatureUrl(name, {expires: 3600});
  ctx.body = ctx.DATA;
};

/**
 * lw 删除文件、文件夹
 */
const del = async (ctx) => {
  let dat = ctx.request.body;
  let delList = dat[0];
  let directory = dat[1];
  try {
    for (let i = 0; i < directory.length; i++) {
      let retList = await oss().list({
        prefix: directory[i]
      });
      retList.objects.reverse();
      retList.objects.map(item => {
        delList.push(item.name)
      });
    }
  } catch (e) {
    throw new CustomError(0, '删除文件:整合失败');
  }
  let result = await oss().deleteMulti(delList, {quiet: true});
  if (result.res.status !== 200) {
    throw new CustomError(0, '删除失败');
  }
  ctx.DATA.message = '删除成功';
  ctx.body = ctx.DATA;
};

module.exports = {
  upload,
  list,
  url,
  del,
};
