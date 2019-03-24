const router = require('koa-router')();

router.prefix('/core/test');

/**
 * GET TEST
 */
router.get('/get', function (ctx, next) {
  ctx.DATA.data = ctx.query;
  ctx.DATA.message = 'This is the GET test.';
  ctx.body = ctx.DATA;
});

/**
 * POST TEST
 */
router.post('/post', function (ctx, next) {
  ctx.DATA.data = ctx.request.body;
  ctx.DATA.message = 'This is the POST test.';
  ctx.body = ctx.DATA;
});

module.exports = router;