const router = require('koa-router')()
const ArticleRouter = require('./article')
// const UserRouter = require('./user')
// const UserController = require('../controllers/user')

router.use('/article', ArticleRouter.routes())
// router.use('/user', UserRouter.routes())

// 登录注册
// router.post('/login', UserController.login)
// router.post('/register', UserController.register)

router.get('/', async ctx => {
  console.log('hello koa2');
  ctx.body = 'hello koa2'
})

module.exports = router
