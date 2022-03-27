const fs = require('fs');
const oss = require('../utils/tool/oss');
const {getDateStr, randomString, getFileType} = require('../utils/tool');
const {CustomError} = require('../utils/tool/error');

/**
 * @swagger
 * /core/oss/upload:
 *   post:
 *     tags:
 *       - server
 *     summary: 图片
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: 文件
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file
  let files = file, uploadAll = []
  if (Object.prototype.toString.call(file) === '[object Object]') {
    files = [file]
  }
  files.forEach(v => {
    let stream = fs.createReadStream(v.path);
    let type = getFileType(v.name);
    let name = `images/${getDateStr()}/${randomString(16)}.${type}`;
    uploadAll.push(oss.putStream(name, stream))
  })
  let res = await Promise.all(uploadAll);
  if (res.length < 2) {
    ctx.DATA.data = {
      name: res[0].name,
      ossUrl: res[0].url,
      url: `https://i.bstu.cn/${res[0].name}`
    };
  } else {
    ctx.DATA.data = res.map(v => ({
      name: v.name,
      ossUrl: v.url,
      url: `https://i.bstu.cn/${v.name}`
    }));
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 上传
 */
const build_upload = async (ctx, next) => {
  const {key} = ctx.request.body;
  const file = ctx.request.files.file;
  let stream = fs.createReadStream(file.path);
  let res = await oss.putStream(key, stream);
  res.ossUrl = res.url;
  res.url = `https://i.bstu.cn/${res.name}`;
  ctx.DATA.data = res;
  ctx.body = ctx.DATA;
};

/**
 * lw 获取oss列表
 */
const list = async (ctx, next) => {
  const name = ctx.query.name;
  ctx.DATA.data = await oss.list({
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
  ctx.DATA.data = oss.signatureUrl(name, {expires: 3600});
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
      let retList = await oss.list({
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
  let result = await oss.deleteMulti(delList, {quiet: true});
  if (result.res.status !== 200) {
    throw new CustomError(0, '删除失败');
  }
  ctx.DATA.message = '删除成功';
  ctx.body = ctx.DATA;
};

module.exports = {
  upload,
  build_upload,
  list,
  url,
  del,
};
