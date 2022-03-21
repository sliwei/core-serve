const router = require('koa-router')();
const swaggerJsdoc = require('swagger-jsdoc')
const { join } = require('path')

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      description: '服务端',
      version: '1.0.0',
      title: '服务端'
    },
    host: '',
    basePath: '/',
    tags: [
      {
        name: 'server',
        description: 'auth'
      }
    ],
    schemes: ['http', 'https'],
    // components: {
    //   schemas: {
    //     Order: {
    //       type: 'object'
    //     }
    //   },
    //   securitySchemes: {
    //     BasicAuth: { type: 'http', scheme: 'basic' }
    //   }
    // }
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [join(__dirname, '../controllers/*.js')]
}
const openapiSpecification = swaggerJsdoc(options)
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
// swagger
router.get('/core/api/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = openapiSpecification
})
// index
router.get('/', index);
// fzf
router.get('*', fzf);

module.exports = router;
