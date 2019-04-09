const index = async (ctx, next) => {
  await ctx.render('index')
};

module.exports = {index};
