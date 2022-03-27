const OSS = require('ali-oss');
const conf = require('../../config');

module.exports = new OSS(conf.oss);