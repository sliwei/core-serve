const conf = require('../../config');
const md5 = require('js-md5');
const {CustomError, HttpError} = require('./error');

/**
 * 检测验证码正确性
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const checkCode = async (ctx, next) => {
  if (conf.verificationSta) {
    let code = ctx.request.body.code || '';
    let key = ctx.request.body.key;
    if (ctx.request.method === 'GET') {
      code = ctx.params.code || '';
    }
    // let key = ctx.cookie.get('code2');
    let codeSta = false;
    if (code) {
      let getCode = `${conf.md5Name}${code.toLowerCase()}`;
      let md5Code = md5(getCode);
      if (code && md5Code === key) {
        codeSta = true;
      }
    }
    if (!codeSta) {
      throw new HttpError(1)
    }
  }
  // !('check' in ctx.res) ? ctx.res.check = {} : null;
  // ctx.res.check.code = codeSta;
  await next();
};

module.exports = {checkCode};
