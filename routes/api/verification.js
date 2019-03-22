const router = require('koa-router')();
const svgCaptcha = require('svg-captcha');;
const md5 = require('js-md5');
const conf = require('../../config');

router.prefix('/core/verification');

/**
 * 生成数字字母验证码
 */
router.get('/code', async function (ctx, next) {
    let fontSize = ctx.query.size || 40;
    let width = ctx.query.w || 150;
    let height = ctx.query.h || 50;
    svgCaptcha.options.fontSize = fontSize; // captcha的宽度
    svgCaptcha.options.width = width; // 验证码的高度
    svgCaptcha.options.height = height; // captcha文本大小
    // svgCaptcha.options.charPreset = charPreset; // 随机字符预设
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1iLlI',
        noise: 2,
        color: true,
        // background: '#fff'
    });
    let key = md5(`${conf.md5Name}${captcha.text.toLowerCase()}`);
    ctx.DATA.data = {
        svg: captcha.data,
        key: key
    };
    ctx.body = ctx.DATA;
});

module.exports = router;
