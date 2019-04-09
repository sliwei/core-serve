/**
 * GET TEST
 */
const get = async (ctx, next) => {
  ctx.DATA.data = ctx.query;
  ctx.DATA.message = 'This is the GET test.';
  ctx.body = ctx.DATA;
};

/**
 * POST TEST
 */
const post = async (ctx, next) => {
  ctx.DATA.data = ctx.request.body;
  ctx.DATA.message = 'This is the POST test.';
  ctx.body = ctx.DATA;
};

module.exports = {
  get,
  post,
};
