const Router = require('koa-router')
const router = new Router()
const CommentController = require('../controllers/commentOrReply')

router.post('/createComment', CommentController.createComment)
router.post('/createReply', CommentController.createReply)
router.get('/getCommentList', CommentController.getCommentList)
router.get('/delete', CommentController.delete)
// router.put('/update', CommentController.update)
// router.get('/get/:id', CommentController.getArticleById)
// router.get('/getList', CommentController.getArticleList)
// router.delete('/delete', CommentController.delete)

module.exports = router
