const router = require('koa-router')();

const oss = require('./api/oss');
const verification = require('./api/verification');
const token = require('./api/token');

const routes = [
  oss,
  verification,
  token,
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
