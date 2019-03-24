const util = require('util');
const ERROR_MSG = require('./errorMsg');

function CustomError(code, msg) {
  Error.call(this, '');

  this.code = code;
  this.msg = msg || ERROR_MSG[code] || 'unknown error';

  this.getCodeMsg = function () {
    return {
      code: this.code,
      msg: this.msg
    }
  }
}

util.inherits(CustomError, Error)

function HttpError(code, msg) {
  if ([0, 1, 200, 400, 401, 403, 404, 500, 503].indexOf(code) < 0) {
    throw Error('not an invalid http code')
  }

  CustomError.call(this, code, msg)
}

util.inherits(HttpError, CustomError);

module.exports = {
  HttpError,
  CustomError
};