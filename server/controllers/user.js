const Joi = require('joi');
const UserSchema = require('../schemas/user');
const { encrypt, comparePassword } = require('../lib/bcryptjs.js');
const { createToken } = require('../lib/token');

const {
  user: UserModel,
  article: ArticleModel,
  tag: TagModel,
  comment: CommentModel,
  reply: ReplyModel,
  sequelize,
} = require('../models/index');

module.exports = {
  // 注册
  async register(ctx) {
    const { username, password, email } = ctx.request.body;
    const validator = Joi.validate(ctx.request.body, UserSchema.register);
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message };
    } else {
      const usernameItem = await UserModel.findOne({
        where: {
          username,
        }
      });
      if (usernameItem) {
        ctx.body = { code: 400, message: '用户名已被使用' };
      } else {
        const emailItem = await UserModel.findOne({
          where: {
            email,
          }
        });
        if (emailItem) {
          ctx.body = { code: 400, message: '邮箱已被注册' };
        } else {
          const saltPassword = await encrypt(password);
          await UserModel.create({ username, password: saltPassword, email });
          ctx.body = { code: 200, message: '注册成功' };
        }
      }
    }
  },

  // 登录
  async login(ctx) {
    const { account, password } = ctx.request.body;
    const validator = Joi.validate(ctx.request.body, UserSchema.login);
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message };
    } else {
      const userItem = await UserModel.findOne({
        where: {
          $or: { username: account, email: account },
        },
      });
      if (!userItem) {
        ctx.body = { code: 400, message: '用户不存在' };
      } else {
        const isMatch = comparePassword(password, userItem.password);
        if (!isMatch) {
          ctx.body = { code: 400, message: '密码不正确' };
        } else {
          const { id, auth, username, email } = userItem;
          const token = createToken({ username, userId: id, auth, email });
          ctx.body = { code: 200, message: 'success', data: {
              userId: id,
              username,
              auth,
              email,
              token,
            }
          };
        }
      }
    }
  },

}

