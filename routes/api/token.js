const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const conf = require('../../config');
const {createToken, checkToken} = require('../tool/token');

router.prefix('/core/token');

/**
 * 创建token
 */
router.post('/create', async (ctx, next) => {
  let dat = ctx.request.body;
  let token = await jwt.sign(dat, conf.tokenName, {
    expiresIn: conf.cookieOptions.maxAge / 1000 + 's'
  });
  ctx.DATA.data = {
    token: token
  };
  ctx.body = ctx.DATA;
});

/**
 * 验证token
 */
router.post('/check', async (ctx, next) => {
  let token = ctx.request.body;
  try {
    await jwt.verify(token.token, conf.tokenName, function (err, decoded) {
      if (err) {
        console.log('jwt expired');
        ctx.DATA.code = 401;
      } else {
        ctx.DATA.data = {...decoded};
      }
    });
  } catch (e) {
    console.log('jwt expired');
    ctx.DATA.code = 401;
  }
  ctx.body = ctx.DATA;
});

/**
 * 验证token
 */
router.post('/test', checkToken, async (ctx, next) => {
  ctx.DATA.data = ctx.res.USER;
  ctx.body = ctx.DATA;
});

module.exports = router;
