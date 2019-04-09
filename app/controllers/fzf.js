const {HttpError} = require('../utils/tool/error');

const fzf = async (ctx, next) => {
  throw new HttpError(404);
};

module.exports = {fzf};
