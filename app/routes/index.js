const router = require('koa-router')();

const {get, post} = require('../controllers/test');
const {upload, build_upload, list, url, del} = require('../controllers/oss');
const {index} = require('../controllers/index');
const {fzf} = require('../controllers/fzf');

// test
router.get('/core/test/get', get);
router.post('/core/test/post', post);
// oss
router.post('/core/oss/upload', upload);
router.post('/core/oss/build_upload', build_upload);
router.get('/core/oss/list', list);
router.get('/core/oss/url', url);
router.post('/core/oss/del', del);
// index
router.get('/', index);
// fzf
router.get('*', fzf);

module.exports = router;
