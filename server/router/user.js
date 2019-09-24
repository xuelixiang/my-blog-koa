const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')

router.post('/register', UserController.register) // 注册账号
router.post('/login', UserController.login) // 登录账号
// router.put('/:id', UserController.updateUser) // 更新账户信息
// router.get('/getUserList', UserController.getUserList) // 获取用户列表
// router.delete('/delete', UserController.delete) // 删除用户

module.exports = router
