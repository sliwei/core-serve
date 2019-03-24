const router = require('koa-router')();

const test = require('./api/test');
const oss = require('./api/oss');

const routes = [
  test,
  oss,
];

for (let route of routes) {
  router.use(route.routes(), route.allowedMethods())
}

const index = async (ctx, next) => {
  await ctx.render('index')
};

const fzf = async (ctx, next) => {
  await ctx.render('404')
};

router.get('/', index);
router.get('*', fzf);

module.exports = router;
