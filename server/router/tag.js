const Router = require('koa-router')
const router = new Router()
const TagController = require('../controllers/tag')

router.get('/getTagsList', TagController.getTagsList)
router.get('/getArticleListByTagName', TagController.getArticleListByTagName)
// router.post('/createReply', CommentController.createReply)
// router.get('/getCommentList', CommentController.getCommentList)
// router.get('/delete', CommentController.delete)

module.exports = router
