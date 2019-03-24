/**
 * lw 基本工具
 */

/**
 * 随机数函数
 * @param min
 * @param max
 * @returns {number}
 */
const rand = function (min, max) {
  return Math.random() * (max - min + 1) + min | 0; //特殊的技巧，|0可以强制转换为整数
};

/**
 * 年月日生成
 * @returns {string} 如：201808
 */
const getDateStr = function () {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDay();
  m < 10 ? m = '0' + m : null;
  d < 10 ? d = '0' + d : null;
  return y + m + d;
};

/**
 * 随机字符串生成
 * @param len 生成长度 数字类型
 * @returns {string}
 */
const randomString = function (len) {
  len = len || 32;
  let $chars = 'qwertyuioplkjhgfdsazxcvbnm0123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

module.exports = {
  rand,
  getDateStr,
  randomString
};