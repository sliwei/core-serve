const router = require('koa-router')();
const fs = require('fs');
const oss = require('../tool/oss');
const {CustomError, HttpError} = require('../tool/error');

router.prefix('/core/oss');

/**
 * lw 上传
 */
router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file;
  let stream = fs.createReadStream(file.path);
  ctx.DATA.data = await oss().putStream(file.name, stream);
  ctx.body = ctx.DATA;
});

/**
 * lw 获取oss列表
 */
router.get('/list', async (ctx, next) => {
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
});

/**
 * lw 获取文件下载链接
 */
router.get('/url', async (ctx) => {
  const name = ctx.query.name;
  ctx.DATA.data = oss().signatureUrl(name, {expires: 3600});
  ctx.body = ctx.DATA;
});

/**
 * lw 删除文件、文件夹
 */
router.post('/del', async (ctx) => {
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
});

module.exports = router;
