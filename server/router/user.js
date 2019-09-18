const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')

router.put('/:id', UserController.updateUser) // 更新账户信息
router.get('/getUserList', UserController.getUserList) // 获取用户列表
router.delete('/delete', UserController.delete) // 删除用户

module.exports = router
