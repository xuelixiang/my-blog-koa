const router = require('koa-router')()
const ArticleRouter = require('./article')
const CommentRouter = require('./commentOrReply')
const TagRouter = require('./tag')
const UserRouter = require('./user')

router.use('/user', UserRouter.routes())
router.use('/article', ArticleRouter.routes())
router.use('/commentOrReply', CommentRouter.routes())
router.use('/tag', TagRouter.routes())

router.get('/', async ctx => {
  console.log('hello koa2');
  ctx.body = 'hello koa2'
})

module.exports = router
