const {
  user: UserModel,
  article: ArticleModel,
  tag: TagModel,
  comment: CommentModel,
  reply: ReplyModel,
  sequelize,
} = require('../models/index');

module.exports = {
  // 列表
  async getTagsList(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
    });
    ctx.body = { code: 200, message: '成功', data };
  },

  // 根据标签名称获取文章列表
  async getArticleListByTagName(ctx) {
    const { tagName, page = 1, pageSize = 3 } = ctx.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    const data = await ArticleModel.findAndCountAll({
      attributes: ['title', 'content', 'updatedAt'],
      include: [{
        model: TagModel,
        where: {
          name: tagName,
        },
        // include: [ArticleModel],
      }],
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
    });
    ctx.body = { code: 200, message: '根据标签名称获取文章列表成功', data };
  },

}
