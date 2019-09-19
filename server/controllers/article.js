const Joi = require('joi');
const ArticleSchema = require('../schemas/article');

const {
  user: UserModel,
  article: ArticleModel,
  tag: TagModel,
  sequelize,
} = require('../models/index');

module.exports = {
  // 创建文章
  async create(ctx) {
    const { title, content, tags } = ctx.request.body;
    console.log('create::', title, content);
    const validator = Joi.validate(ctx.request.body, ArticleSchema.create);
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message };
    } else {
      const titleUniqueItem = await ArticleModel.findOne({
        where: { title}
      });
      if (titleUniqueItem) {
        console.log('titleUniqueItem:', titleUniqueItem);
        console.log('titleUniqueItem:', titleUniqueItem.get({ plain: true, }));
        console.log('titleUniqueItem11:', titleUniqueItem.toJSON());
        ctx.body = { code: 400, message: '标题重复', titleUniqueItem };
      } else {
        const tagList = tags.map(i => ({ name: i }));
        const data = await ArticleModel.create({
          title,
          content,
          tags: tagList,
        }, {
          include: [TagModel],
        });
        ctx.body = { code: 200, message: '创建文章成功', data };
      }
    }
  },

  // 创建文章
  async update(ctx) {
    const { title, content, tags, articleId, showOrder } = ctx.request.body;
    console.log('create::', title, content, tags, articleId, showOrder);
    if (showOrder !== undefined) {
      const data = await ArticleModel.update({ showOrder }, { where: { id: articleId } });
      ctx.body = { code: 200, message: showOrder ? '置顶成功' : '取消置顶成功', data };
    } else {
      const validator = Joi.validate(ctx.request.body, ArticleSchema.update);
      if (validator.error) {
        ctx.body = { code: 400, message: validator.error.message };
      } else {
        const titleUniqueItem = await ArticleModel.findOne({
          where: { title}
        });
        if (titleUniqueItem && titleUniqueItem.id !== articleId) {
          console.log('titleUniqueItem:', titleUniqueItem);
          console.log('titleUniqueItem:', titleUniqueItem.get({ plain: true, }));
          console.log('titleUniqueItem11:', titleUniqueItem.toJSON());
          ctx.body = { code: 400, message: '标题重复', titleUniqueItem };
        } else {
          const tagList = tags.map(i => ({ name: i, articleId }));
          await ArticleModel.update({ title, content }, { where: { id: articleId } });
          await TagModel.destroy({ where: { articleId } });
          await TagModel.bulkCreate(tagList);
          const data = await ArticleModel.findOne({
            where: { id: articleId },
            include: [
              { model: TagModel, attributes: ['name'] },
            ],
            row: true,
          });
          ctx.body = { code: 200, message: '修改文章成功', data };
        }
      }
    }
  },

  // 获取文章列表
  async getArticleList(ctx) {
    const { page = 1, pageSize = 5, title, tag, fetchTop, showOrderDesc } = ctx.request.query;
    console.log('getArticleList:', ctx.request.query, ctx.query);
    let offset = (page - 1) * pageSize;
    let queryParams = {};
    let order = [['createdAt', 'DESC']];
    if (title) {
      queryParams.title = { $like: `%${title}%` };
    }
    if (showOrderDesc) {
      order = [['showOrder', 'DESC'], ['updatedAt', 'DESC']];
    }
    if (fetchTop) {
      queryParams.showOrder = 1;
      order = [['updatedAt', 'DESC']];
    }
    const tagFilter = tag ? { name: tag } : null;
    const limit = parseInt(pageSize);

    console.log('queryParams:', queryParams, tagFilter);
    const data = await ArticleModel.findAndCountAll({
      where: queryParams,
      include: [{
        model: TagModel,
        attributes: ['name'],
        where: tagFilter,
      }],
      offset,
      limit,
      order,
      row: true,
    });
    ctx.body = { code: 200, data };
  },

  // 获取指定id的文章
  async getArticleById(ctx) {
    const id = ctx.params.id;
    const data = await ArticleModel.findOne({
      where: { id },
      include: [
        { model: TagModel, attributes: ['name'] },
      ],
      row: true,
    });
    ctx.body = { code: 200, data };
  },

  // 删除文章
  async delete(ctx) {
    const { id: articleId } = ctx.query;
    await TagModel.destroy({ where: { articleId } });
    await ArticleModel.destroy({ where: { id: articleId } });
    ctx.body = { code: 200, message: '删除成功' };
  },

}

