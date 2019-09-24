const Joi = require('joi');
const CommentOrReplySchema = require('../schemas/commentOrReply');

const {
  user: UserModel,
  article: ArticleModel,
  tag: TagModel,
  comment: CommentModel,
  reply: ReplyModel,
  sequelize,
} = require('../models/index');

// 获取评论列表
const fetchCommentList = articleId => {
  const data = CommentModel.findAndCountAll({
    attributes: ['id', 'content', 'createdAt'],
    include: [
      {
        model: ReplyModel,
        attributes: ['id', 'content'],
        include: [
          {
            model: UserModel,
            attributes: ['username'],
          },
        ]
      },
      {
        model: UserModel,
        attributes: ['username'],
      },
      // {model: ArticleModel, as: 'article', include: [TagModel, {model: CommentModel, include: [UserModel, {model: ReplyModel, include: [UserModel]}]}, ReplyModel]},
    ],
    where: { articleId },
    order: [['createdAt', 'DESC']],
  });
  return data;
}

module.exports = {
  // 创建评论
  async createComment(ctx) {
    const { articleId, content, userId } = ctx.request.body;
    const validator = Joi.validate(ctx.request.body, CommentOrReplySchema.createComment);
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message };
    } else {
      await CommentModel.create({ articleId, content, userId });
      const data = await fetchCommentList(articleId);
      ctx.body = { code: 200, message: '创建评论成功', data };
    }
  },

  // 创建回复
  async createReply(ctx) {
    const { articleId, content, userId, commentId } = ctx.request.body;
    const validator = Joi.validate(ctx.request.body, CommentOrReplySchema.createReply);
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message };
    } else {
      await ReplyModel.create({ articleId, content, userId, commentId });
      const data = await fetchCommentList(articleId);
      ctx.body = { code: 200, message: '创建回复成功', data };
    }
  },
  
  // 获取评论列表
  async getCommentList(ctx) {
    const { articleId } = ctx.request.query;
    const data = await fetchCommentList(articleId);
    ctx.body = { code: 200, message: 'success', data };
  },

  // 获删除评论列表
  async delete(ctx) {
    const { commentId, replyId } = ctx.request.query;
    if (commentId) {
      await ReplyModel.destroy({ where: { commentId } });
      await CommentModel.destroy({ where: { id: commentId } });
      // await sequelize.query(
      //   `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.id=${commentId}`
      // );
      ctx.body = { code: 200, message: '评论删除成功' };
    } else if (replyId) {
      await ReplyModel.destroy({ where: { id: replyId } });
      ctx.body = { code: 200, message: '回复删除成功' };
    } else {
      ctx.body = { code: 400, message: 'id不能为空' };
    }
  },

}
